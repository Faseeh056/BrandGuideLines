import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$lib/env';

// Lazy initialization for GoogleGenerativeAI
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
	if (!genAI) {
		// Get API key - check env object first, then process.env directly as fallback
		let apiKey = env?.GOOGLE_GEMINI_API || '';
		
		// If not found in env object, try process.env directly (in case .env wasn't loaded yet)
		if (!apiKey || apiKey.trim() === '') {
			if (typeof process !== 'undefined' && process.env) {
				// Try Google_Gemini_Api first (user's variable name)
				apiKey = process.env.Google_Gemini_Api || 
				         process.env.GOOGLE_GEMINI_API || 
				         process.env.GOOGLE_AI_API_KEY || '';
				
				if (apiKey) {
					// Clean the value (remove quotes and trim)
					apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
					console.log('[industry-steps-generator] ✓ Found API key in process.env directly');
				}
			}
		}
		
		if (!apiKey || apiKey.trim() === '') {
			console.error('[industry-steps-generator] API key not found. env.GOOGLE_GEMINI_API:', env?.GOOGLE_GEMINI_API || 'undefined/empty');
			console.error('[industry-steps-generator] process.env.Google_Gemini_Api:', typeof process !== 'undefined' && process.env ? process.env.Google_Gemini_Api || 'NOT FOUND' : 'process not available');
			throw new Error('GOOGLE_GEMINI_API is not configured. Please check your .env file and ensure Google_Gemini_Api is set correctly, then restart the dev server.');
		}
		genAI = new GoogleGenerativeAI(apiKey);
	}
	return genAI;
}

export interface IndustryStep {
	id: string;
	title: string;
	description: string;
}

/**
 * Generate industry-specific steps using Gemini API
 * Returns array of step IDs that should be included after the common 5 steps
 */
export async function generateIndustrySpecificSteps(
	industry: string,
	industrySpecificInfo?: Record<string, any>
): Promise<string[]> {
	try {
		if (!industry || industry.trim() === '') {
			console.log('[industry-steps-generator] No industry provided, returning empty array');
			return [];
		}

		const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });

		// Build context from industry-specific info
		const contextInfo = industrySpecificInfo && Object.keys(industrySpecificInfo).length > 0
			? `\n\nAdditional Context:\n${JSON.stringify(industrySpecificInfo, null, 2)}`
			: '';

		const prompt = `You are a brand guidelines expert. Generate industry-specific brand guideline steps for the "${industry}" industry.

COMMON STEPS (ALREADY INCLUDED - DO NOT INCLUDE THESE):
1. brand-positioning
2. logo-guidelines
3. color-palette
4. typography
5. iconography

TASK:
Generate 2-3 additional brand guideline steps that are SPECIFIC to the "${industry}" industry. These steps should be relevant ONLY to this industry and help create comprehensive brand guidelines.

REQUIREMENTS:
- Generate step IDs in kebab-case (e.g., "medical-imagery", "product-photography", "ui-ux-patterns")
- Each step should be unique to the "${industry}" industry
- Steps should be practical and actionable
- Do NOT include generic steps like "photography" or "applications" unless they are truly industry-specific
- Focus on what makes this industry unique in terms of brand guidelines

EXAMPLES (3-shot learning):

Example 1 - Healthcare Industry:
Industry: "Healthcare"
Output (JSON array of step IDs):
["medical-imagery", "patient-communications", "regulatory-compliance"]

Example 2 - SaaS Industry:
Industry: "SaaS"
Output (JSON array of step IDs):
["ui-ux-patterns", "product-interface", "onboarding-experience"]

Example 3 - Fashion Industry:
Industry: "Fashion"
Output (JSON array of step IDs):
["fashion-photography", "lookbook-guidelines", "styling"]

Example 4 - Gaming Industry:
Industry: "Gaming"
Output (JSON array of step IDs):
["game-assets", "ui-hud-design", "marketing-materials"]

Example 5 - Food & Beverage Industry:
Industry: "Food & Beverage"
Output (JSON array of step IDs):
["food-photography", "menu-design", "packaging"]

NOW GENERATE FOR:
Industry: "${industry}"${contextInfo}

Return ONLY a JSON array of step IDs (kebab-case strings), no additional text or explanation.
Example format: ["step-id-1", "step-id-2", "step-id-3"]

IMPORTANT: 
- Return ONLY the JSON array
- Use kebab-case for step IDs
- Make steps specific to "${industry}" industry
- Generate 2-3 steps (aim for 2-3, prioritize quality over quantity)
- Do NOT include the common 5 steps`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Parse JSON response
		try {
			// Extract JSON array from response
			const jsonMatch = text.match(/\[[\s\S]*\]/);
			if (jsonMatch) {
				const stepIds: string[] = JSON.parse(jsonMatch[0]);
				
				// Validate: ensure all are strings and in kebab-case
				const validStepIds = stepIds
					.filter((id) => typeof id === 'string' && id.trim() !== '')
					.map((id) => id.trim().toLowerCase().replace(/\s+/g, '-'));
				
				console.log(`[industry-steps-generator] Generated ${validStepIds.length} steps for "${industry}":`, validStepIds);
				return validStepIds;
			} else {
				console.warn('[industry-steps-generator] No JSON array found in response, trying to extract step IDs from text');
				// Fallback: try to extract step IDs from text
				const stepIdPattern = /["']([a-z0-9-]+)["']/gi;
				const matches = text.matchAll(stepIdPattern);
				const extractedIds = Array.from(matches, (m) => m[1]).filter((id) => id && !id.includes('brand-positioning') && !id.includes('logo-guidelines') && !id.includes('color-palette') && !id.includes('typography') && !id.includes('iconography'));
				
				if (extractedIds.length > 0) {
					console.log(`[industry-steps-generator] Extracted ${extractedIds.length} step IDs from text:`, extractedIds);
					return extractedIds;
				}
			}
		} catch (parseError) {
			console.error('[industry-steps-generator] Failed to parse JSON response:', parseError);
			console.error('[industry-steps-generator] Raw response:', text);
		}

		// Fallback: return empty array if parsing fails
		console.warn(`[industry-steps-generator] Failed to generate steps for "${industry}", returning empty array`);
		return [];
	} catch (error) {
		console.error(`[industry-steps-generator] Error generating steps for "${industry}":`, error);
		// Return empty array on error - will only show common 5 steps
		return [];
	}
}

