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
		const { userPrompt, context } = body;

		if (!userPrompt || typeof userPrompt !== 'string') {
			return json({ error: 'userPrompt is required' }, { status: 400 });
		}

		// If context is provided (during generation), enhance the analysis
		let enhancedPrompt = userPrompt;
		if (context?.isDuringGeneration && context?.currentSteps) {
			// Add context about current steps to help AI understand
			const stepsInfo = context.currentSteps
				.map((s: any) => `Step ${(s.index || 0) + 1}: ${s.title || 'Unknown'} (${s.isApproved ? 'approved' : 'pending'})`)
				.join(', ');
			enhancedPrompt = `User is currently generating brand guidelines. Current steps: ${stepsInfo}. User's request: ${userPrompt}`;
		}

		const analysis = await analyzeBrandPrompt(enhancedPrompt);

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


