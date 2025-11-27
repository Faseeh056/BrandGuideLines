import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { brandBuilderChats, brandLogos, brandGuidelines } from '$lib/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { getLogoAssetById } from '$lib/server/logo-storage';

type LogoSnapshot = {
	brandName: string | null;
	source: 'ai-generated' | 'upload' | 'unknown';
	filename: string | null;
	mimeType: string | null;
	userId: string;
	userName: string | null | undefined;
	acceptedAt: string;
	assetId: string;
	fileUrl: string;
};

function inferMimeType(dataUrl?: string): string | null {
	if (!dataUrl || typeof dataUrl !== 'string') return null;
	const match = dataUrl.match(/^data:([^;]+);base64,/i);
	return match ? match[1] : null;
}

export const POST: RequestHandler = async ({ locals, params, request }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		return json({ success: false, error: 'Authentication required' }, { status: 401 });
	}

	const chatId = params.id;
	if (!chatId) {
		return json({ success: false, error: 'Chat ID is required' }, { status: 400 });
	}

	let body: any;
	try {
		body = await request.json();
	} catch (error) {
		return json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
	}

	const providedLogoData: string | undefined = body?.logoData || body?.fileData;
	let storageId: string | undefined = body?.storageId || body?.logoId;
	let fileUrl: string | undefined = body?.fileUrl;
	const filename: string | null = body?.filename || null;
	let mimeType: string | null = body?.mimeType || null;

	// Extract logo data directly - prefer base64 data URL
	let logoData: string | null = null;
	
	if (providedLogoData && providedLogoData.startsWith('data:')) {
		// Use logo data directly
		logoData = providedLogoData;
		const parsed = providedLogoData.match(/^data:([^;]+);base64,(.+)$/);
		if (parsed) {
			mimeType = parsed[1];
		}
	} else if (fileUrl) {
		// If fileUrl is provided, use it as logo data
		logoData = fileUrl;
	} else if (storageId) {
		// Legacy: try to get from logo-storage for backward compatibility
		try {
			const asset = await getLogoAssetById(storageId);
			if (asset?.data) {
				// Convert buffer to base64 data URL
				const base64 = asset.data.toString('base64');
				logoData = `data:${asset.mimeType};base64,${base64}`;
				mimeType = asset.mimeType;
			}
		} catch (error) {
			console.warn('Failed to get logo from storage:', error);
		}
	}
	
	if (!logoData) {
		return json(
			{ success: false, error: 'Logo data is required' },
			{ status: 400 }
		);
	}

	const brandName: string | null =
		body?.brandName || body?.brand_name || body?.brand || null;

	const snapshot: LogoSnapshot = {
		brandName,
		source: (body?.source as LogoSnapshot['source']) || 'unknown',
		filename,
		mimeType: mimeType || inferMimeType(logoData),
		userId: session.user.id,
		userName: session.user.name || session.user.email,
		acceptedAt: new Date().toISOString(),
		assetId: storageId || '',
		fileUrl: fileUrl || logoData
	};

	const updatePayload: { 
		latestLogoSnapshot: string; 
		logo: string | null;
		updatedAt: Date; 
		brandName?: string | null 
	} = {
		latestLogoSnapshot: JSON.stringify(snapshot),
		logo: logoData, // Store logo directly in chat table
		updatedAt: new Date()
	};

	if (brandName) {
		updatePayload.brandName = brandName;
	}

	const [updated] = await db
		.update(brandBuilderChats)
		.set(updatePayload)
		.where(and(eq(brandBuilderChats.id, chatId), eq(brandBuilderChats.userId, session.user.id)))
		.returning({ id: brandBuilderChats.id, brandName: brandBuilderChats.brandName });

	if (!updated) {
		return json({ success: false, error: 'Chat not found' }, { status: 404 });
	}

	// Also save logo to brandLogos table if we can find the brandGuidelinesId
	// Try to find brandGuidelines by brandName (chatId should match brandGuidelines.id)
	try {
		// First try: use chatId as brandGuidelinesId (if they match)
		let brandGuidelinesId: string | null = chatId;
		
		// Verify that this ID exists in brandGuidelines
		const guidelineCheck = await db
			.select({ id: brandGuidelines.id })
			.from(brandGuidelines)
			.where(and(
				eq(brandGuidelines.id, chatId),
				eq(brandGuidelines.userId, session.user.id)
			))
			.limit(1);

		// If chatId doesn't match brandGuidelines, try to find by brandName
		if (guidelineCheck.length === 0 && brandName) {
			const guidelineByName = await db
				.select({ id: brandGuidelines.id })
				.from(brandGuidelines)
				.where(and(
					eq(brandGuidelines.brandName, brandName),
					eq(brandGuidelines.userId, session.user.id)
				))
				.orderBy(desc(brandGuidelines.createdAt))
				.limit(1);
			
			if (guidelineByName.length > 0) {
				brandGuidelinesId = guidelineByName[0].id;
			} else {
				brandGuidelinesId = null;
			}
		}

		// Save to brandLogos table if we have a valid brandGuidelinesId
		if (brandGuidelinesId) {
			await db
				.insert(brandLogos)
				.values({
					id: brandGuidelinesId, // Same as brand_guidelines.id
					logo: logoData
				})
				.onConflictDoUpdate({
					target: brandLogos.id,
					set: {
						logo: logoData,
						updatedAt: new Date()
					}
				});
			console.log('✅ Logo saved to brandLogos table');
		}
	} catch (error) {
		console.warn('⚠️ Failed to save logo to brandLogos table:', error);
		// Don't fail the request if brandLogos save fails
	}

	return json({ success: true, snapshot });
};

