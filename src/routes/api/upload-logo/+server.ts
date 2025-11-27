import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Logo upload endpoint
 *
 * New behavior:
 * - DOES NOT write anything to the filesystem.
 * - Returns base64 data URL so the client can preview and send it along
 *   to brand-guidelines APIs, which store it in the database.
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('logo') as File | null;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
			return json({ error: 'File must be an image' }, { status: 400 });
		}

		if (file.size > 5 * 1024 * 1024) {
			return json({ error: 'File size must be less than 5MB' }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64Data = buffer.toString('base64');
		const mimeType =
			file.type || (file.name.endsWith('.svg') ? 'image/svg+xml' : 'image/png');
		const dataUrl = `data:${mimeType};base64,${base64Data}`;

		return json({
			success: true,
			filename: file.name,
			fileData: dataUrl,
			fileSize: file.size,
			mimeType
		});
	} catch (error) {
		console.error('Logo upload error:', error);
		return json({ error: 'Failed to upload logo' }, { status: 500 });
	}
};


