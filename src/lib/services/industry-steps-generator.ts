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
 * Now uses grounding data to create steps based on actual industry practices
 */
export async function generateIndustrySpecificSteps(
	industry: string,
	industrySpecificInfo?: Record<string, any>,
	groundingData?: {
		summary: string;
		keyFindings: string[];
		websites: Array<{ url: string; title: string; extractedFacts: string[] }>;
	}
): Promise<string[]> {
	try {
		if (!industry || industry.trim() === '') {
			console.log('[industry-steps-generator] No industry provided, returning empty array');
			return [];
		}

		const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

		// Build context from industry-specific info
		const contextInfo = industrySpecificInfo && Object.keys(industrySpecificInfo).length > 0
			? `\n\nAdditional Context:\n${JSON.stringify(industrySpecificInfo, null, 2)}`
			: '';

		// Build grounding data section
		const groundingSection = groundingData ? `
		
🔍 REAL-WORLD INDUSTRY ANALYSIS:
Based on analysis of ${groundingData.websites.length} leading ${industry} brands:

INDUSTRY SUMMARY:
${groundingData.summary}

KEY FINDINGS FROM ACTUAL BRANDS:
${groundingData.keyFindings.slice(0, 8).map((finding, i) => `${i + 1}. ${finding}`).join('\n')}

ANALYZED BRANDS AND THEIR PRACTICES:
${groundingData.websites.map((site, idx) => `
${idx + 1}. ${site.title}:
   - ${site.extractedFacts.slice(0, 4).join('\n   - ')}
`).join('\n')}

CRITICAL: The steps you generate MUST be based on actual patterns, elements, and practices found in these real brands. Each step should reflect what successful ${industry} brands actually use in their brand guidelines.
` : '';

		const prompt = `You are a senior brand guidelines expert with deep knowledge of the "${industry}" industry. Your task is to generate industry-specific brand guideline steps that are based on ACTUAL practices from successful brands in this industry.

COMMON STEPS (ALREADY INCLUDED - DO NOT INCLUDE THESE):
1. brand-positioning
2. logo-guidelines
3. color-palette
4. typography
5. iconography

TASK:
Generate 2-4 additional brand guideline steps that are SPECIFIC to the "${industry}" industry. These steps MUST be based on actual patterns, elements, and practices found in real ${industry} brands (see REAL-WORLD INDUSTRY ANALYSIS above).

CRITICAL REQUIREMENTS:
1. GROUNDED IN REALITY: Each step must be based on actual practices from the analyzed brands. Reference specific patterns, elements, or guidelines that these brands actually use.

2. STEP ID FORMAT: Generate step IDs in kebab-case (e.g., "medical-imagery", "product-photography", "ui-ux-patterns", "regulatory-compliance")

3. INDUSTRY-SPECIFIC: Each step should be unique to the "${industry}" industry and reflect what successful brands in this industry actually include in their brand guidelines.

4. PRACTICAL & ACTIONABLE: Steps should be practical, implementable, and reflect real-world brand guideline structures used by industry leaders.

5. BASED ON SCRAPED DATA: ${groundingData ? 'Use the REAL-WORLD INDUSTRY ANALYSIS to identify what actual brand elements, patterns, or guidelines these brands use. Generate steps that mirror these real practices.' : 'Focus on industry-standard brand guideline elements.'}

6. AVOID GENERIC: Do NOT include generic steps like "photography" or "applications" unless they are truly industry-specific and based on actual brand practices.

7. QUALITY OVER QUANTITY: Generate 2-4 high-quality steps that reflect real industry practices, not generic suggestions.

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
Industry: "${industry}"${contextInfo}${groundingSection}

ANALYSIS PROCESS:
1. Review the REAL-WORLD INDUSTRY ANALYSIS above
2. Identify common patterns, elements, or brand guideline sections that appear across multiple brands
3. Identify industry-specific elements that are unique to ${industry} brands
4. Generate step IDs that represent these actual brand guideline elements

Return ONLY a JSON array of step IDs (kebab-case strings), no additional text or explanation.
Example format: ["step-id-1", "step-id-2", "step-id-3"]

IMPORTANT: 
- Return ONLY the JSON array
- Use kebab-case for step IDs
- Make steps specific to "${industry}" industry
- Base steps on ACTUAL practices from analyzed brands
- Generate 2-4 steps (prioritize quality and real-world relevance)
- Do NOT include the common 5 steps
- Each step should represent a real brand guideline element used by successful ${industry} brands`;

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

