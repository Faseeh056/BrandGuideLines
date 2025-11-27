import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { brandGuidelines, brandLogos } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	try {
		const session = await locals.auth();

		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		console.log('[brand-guidelines/[id]] Fetching guideline:', {
			id: params.id,
			userId: session.user.id,
			idType: typeof params.id,
			idLength: params.id?.length
		});

		const guideline = await db
			.select()
			.from(brandGuidelines)
			.where(and(eq(brandGuidelines.id, params.id), eq(brandGuidelines.userId, session.user.id)))
			.limit(1);

		console.log('[brand-guidelines/[id]] Query result:', {
			found: guideline.length > 0,
			guidelineId: guideline[0]?.id,
			guidelineBrandName: guideline[0]?.brandName
		});

		if (guideline.length === 0) {
			// Try to see if guideline exists but belongs to different user
			const anyGuideline = await db
				.select({ id: brandGuidelines.id, userId: brandGuidelines.userId })
				.from(brandGuidelines)
				.where(eq(brandGuidelines.id, params.id))
				.limit(1);
			
			console.log('[brand-guidelines/[id]] Guideline exists check:', {
				exists: anyGuideline.length > 0,
				belongsToUser: anyGuideline[0]?.userId === session.user.id,
				actualUserId: anyGuideline[0]?.userId
			});

			return json({ 
				error: 'Brand guideline not found',
				debug: {
					requestedId: params.id,
					userId: session.user.id,
					exists: anyGuideline.length > 0
				}
			}, { status: 404 });
		}

		// Fetch logo from brandLogos table (id = brandGuidelines.id)
		let logoFromBrandLogos = null;
		try {
			const brandLogo = await db
				.select()
				.from(brandLogos)
				.where(eq(brandLogos.id, params.id))
				.limit(1);
			
			if (brandLogo.length > 0 && brandLogo[0].logo) {
				logoFromBrandLogos = brandLogo[0].logo;
			}
		} catch (error) {
			console.warn('Failed to fetch logo from brandLogos table:', error);
		}

		// Merge logo from brandLogos into guideline response
		const guidelineData = guideline[0];
		if (logoFromBrandLogos) {
			// Add logo to guideline data for easy access
			guidelineData.logoFromBrandLogos = logoFromBrandLogos;
		}

		return json({
			success: true,
			guideline: guidelineData,
			logo: logoFromBrandLogos // Also return logo separately for convenience
		});
	} catch (error) {
		console.error('Error fetching brand guideline:', error);
		return json(
			{
				error: 'Failed to fetch brand guideline'
			},
			{ status: 500 }
		);
	}
};

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	try {
		const session = await locals.auth();

		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const { content, brandName, structuredData } = await request.json();

		if (!content || !brandName) {
			return json({ error: 'Content and brand name are required' }, { status: 400 });
		}

		const updateData: any = {
			content: content.trim(),
			brandName: brandName.trim(),
			updatedAt: new Date()
		};

		// Include structuredData if provided
		if (structuredData) {
			updateData.structuredData = structuredData.trim();
		}

		const updatedGuideline = await db
			.update(brandGuidelines)
			.set(updateData)
			.where(and(eq(brandGuidelines.id, params.id), eq(brandGuidelines.userId, session.user.id)))
			.returning();

		if (updatedGuideline.length === 0) {
			return json({ error: 'Brand guideline not found' }, { status: 404 });
		}

		return json({
			success: true,
			guideline: updatedGuideline[0]
		});
	} catch (error) {
		console.error('Error updating brand guideline:', error);
		return json(
			{
				error: 'Failed to update brand guideline'
			},
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	try {
		const session = await locals.auth();

		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const deletedGuideline = await db
			.delete(brandGuidelines)
			.where(and(eq(brandGuidelines.id, params.id), eq(brandGuidelines.userId, session.user.id)))
			.returning();

		if (deletedGuideline.length === 0) {
			return json({ error: 'Brand guideline not found' }, { status: 404 });
		}

		return json({
			success: true,
			message: 'Brand guideline deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting brand guideline:', error);
		return json(
			{
				error: 'Failed to delete brand guideline'
			},
			{ status: 500 }
		);
	}
};
