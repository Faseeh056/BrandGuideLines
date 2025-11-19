import { json } from '@sveltejs/kit';
import { generateIndustrySpecificSteps } from '$lib/services/industry-steps-generator';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.auth();

		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const body = await request.json();
		const { industry, industrySpecificInfo } = body;

		if (!industry || typeof industry !== 'string') {
			return json({ error: 'industry is required' }, { status: 400 });
		}

		console.log('[industry-steps API] Generating steps for industry:', industry);
		
		const steps = await generateIndustrySpecificSteps(industry, industrySpecificInfo);

		console.log('[industry-steps API] Generated steps:', steps);

		return json({
			success: true,
			steps
		});
	} catch (error: any) {
		console.error('[industry-steps API] Error:', error);
		return json(
			{
				error: error.message || 'Failed to generate industry-specific steps',
				details: error.stack
			},
			{ status: 500 }
		);
	}
};

