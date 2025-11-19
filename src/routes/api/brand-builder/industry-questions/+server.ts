import { json } from '@sveltejs/kit';
import { generateIndustryQuestions } from '$lib/services/industry-questions';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.auth();

		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const body = await request.json();
		const { industry, existingInfo, alreadyAskedQuestionIds } = body;

		if (!industry || typeof industry !== 'string') {
			return json({ error: 'industry is required' }, { status: 400 });
		}

		const questions = await generateIndustryQuestions(industry, existingInfo, alreadyAskedQuestionIds);

		return json({
			success: true,
			questions
		});
	} catch (error: any) {
		console.error('Industry questions error:', error);
		return json(
			{
				error: error.message || 'Failed to generate industry questions',
				details: error.stack
			},
			{ status: 500 }
		);
	}
};


