import { json } from '@sveltejs/kit';
import { performGroundingSearch } from '$lib/services/grounding-search';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const body = await request.json();
		const industry = typeof body.industry === 'string' ? body.industry.trim() : '';

		if (!industry) {
			return json({ error: 'industry is required' }, { status: 400 });
		}

		const groundingData = await performGroundingSearch(industry);

		return json({
			success: true,
			groundingData
		});
	} catch (error) {
		console.error('Grounding search error:', error);
		return json(
			{
				error: 'Failed to perform grounding search',
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
};

