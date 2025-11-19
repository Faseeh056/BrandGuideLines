import { json } from '@sveltejs/kit';
import { generateEnhancedProgressiveStep } from '$lib/services/enhanced-progressive-generator';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.auth();

		if (!session?.user?.id) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const body = await request.json();
		const {
			step,
			brandName,
			industry,
			style,
			audience,
			description,
			values,
			industrySpecificInfo,
			previousSteps,
			feedback,
			extractedColors,
			extractedTypography
		} = body;

		// Validate required fields
		if (!step || !brandName || !industry || !style) {
			return json(
				{
					error: 'Missing required fields: step, brandName, industry, style'
				},
				{ status: 400 }
			);
		}

		// Generate the step
		const result = await generateEnhancedProgressiveStep({
			step,
			brandName,
			industry,
			style,
			audience,
			description,
			values,
			industrySpecificInfo,
			previousSteps,
			feedback,
			extractedColors,
			extractedTypography
		});

		return json({
			success: true,
			content: result.content,
			message: result.message
		});
	} catch (error: any) {
		console.error('Enhanced progressive generation error:', error);
		return json(
			{
				error: error.message || 'Failed to generate step',
				details: error.stack
			},
			{ status: 500 }
		);
	}
};


