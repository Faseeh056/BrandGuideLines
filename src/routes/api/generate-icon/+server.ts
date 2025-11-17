/**
 * API endpoint for generating professional icons using Gemini API
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateProfessionalIcon } from '$lib/services/icon-generator-service';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { iconName, size = 24, color = 'currentColor', strokeWidth = 2, style = 'minimal' } = await request.json();

		if (!iconName) {
			return json({ error: 'Icon name is required' }, { status: 400 });
		}

		// Generate professional icon using Gemini
		const svg = await generateProfessionalIcon(iconName, size, color, strokeWidth, style);

		return json({ svg, iconName, size, color, strokeWidth, style });
	} catch (error: any) {
		console.error('Error generating icon:', error);
		return json(
			{ error: error.message || 'Failed to generate icon' },
			{ status: 500 }
		);
	}
};

