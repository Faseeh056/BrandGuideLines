import { json } from '@sveltejs/kit';
import { analyzeBrandPrompt } from '$lib/services/brand-builder-analyzer';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.auth();

		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const body = await request.json();
		const { userPrompt } = body;

		if (!userPrompt || typeof userPrompt !== 'string') {
			return json({ error: 'userPrompt is required' }, { status: 400 });
		}

		const analysis = await analyzeBrandPrompt(userPrompt);

		return json({
			success: true,
			analysis
		});
	} catch (error: any) {
		console.error('Prompt analysis error:', error);
		return json(
			{
				error: error.message || 'Failed to analyze prompt',
				details: error.stack
			},
			{ status: 500 }
		);
	}
};


