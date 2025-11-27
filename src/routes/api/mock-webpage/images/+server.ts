import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchBrandImages, type ThemeKey } from '../generator';

interface ImageRequest {
	brandName: string;
	theme: ThemeKey | string;
	imageType?: string;
	count?: number;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: ImageRequest = await request.json();
		const { brandName, theme, count = 4 } = body;

		if (!brandName || !theme) {
			return json({ success: false, error: 'Brand name and theme are required' }, { status: 400 });
		}

		const images = await fetchBrandImages(brandName, theme.toLowerCase() as ThemeKey, count);
		return json({ success: true, images });
	} catch (error: any) {
		console.error('Image fetch error:', error);
		return json(
			{ success: false, error: error?.message || 'Failed to fetch images' },
			{ status: 500 }
		);
	}
};
