import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$lib/env';

// Initialize Gemini AI (lazy initialization)
// Note: This function is kept for backward compatibility but may not be used
function getGenAI(): GoogleGenerativeAI {
	const apiKey = env?.GOOGLE_GEMINI_API || '';
	if (!apiKey) {
		throw new Error('GOOGLE_GEMINI_API is not configured. Please set it in your .env file.');
	}
	return new GoogleGenerativeAI(apiKey);
}

export interface PromptAnalysisResult {
	brandName?: string;
	industry?: string;
	style?: string; // minimalistic, funky, futuristic, maximalistic, etc.
	audience?: string;
	description?: string;
	values?: string;
	hasCompleteInfo: boolean;
	missingFields: string[];
	extractedInfo: Record<string, any>;
}

/**
 * Analyze user's initial prompt to extract brand information
 * Uses 3-shot prompt approach with examples
 */
export async function analyzeBrandPrompt(userPrompt: string): Promise<PromptAnalysisResult> {
	try {
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
					console.log('[brand-builder-analyzer] ✓ Found API key in process.env directly');
				}
			}
		}
		
		// Final check
		if (!apiKey || apiKey.trim() === '') {
			// Debug: log what we found
			if (typeof process !== 'undefined' && process.env) {
				const foundKeys = Object.keys(process.env).filter(k => 
					k.toUpperCase().includes('GEMINI') || k.toUpperCase().includes('GOOGLE_AI')
				);
				console.error('[brand-builder-analyzer] API key not found. Searched keys:', foundKeys);
				console.error('[brand-builder-analyzer] env.GOOGLE_GEMINI_API value:', env?.GOOGLE_GEMINI_API || 'undefined/empty');
				console.error('[brand-builder-analyzer] process.env.Google_Gemini_Api:', process.env.Google_Gemini_Api || 'NOT FOUND');
			}
			throw new Error('Google Gemini API key is not configured. Please check your .env file and ensure Google_Gemini_Api is set correctly, then restart the dev server.');
		}
		
		// Use the API key directly instead of env object
		// Use gemini-2.0-flash
		const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-2.0-flash' });

		const prompt = createAnalysisPrompt(userPrompt);

		let result;
		let response;
		let text;
		
		try {
			result = await model.generateContent(prompt);
			response = await result.response;
			text = response.text();
		} catch (apiError: any) {
			console.error('[brand-builder-analyzer] Gemini API error:', apiError);
			const errorMessage = apiError?.message || 'Unknown API error';
			
			// Provide more specific error messages
			if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key')) {
				throw new Error('Google Gemini API key is invalid. Please check your .env file and ensure Google_Gemini_Api is set correctly, then restart the dev server.');
			} else if (errorMessage.includes('QUOTA') || errorMessage.includes('quota')) {
				throw new Error('Google Gemini API quota exceeded. Please check your API usage limits.');
			} else if (errorMessage.includes('SAFETY') || errorMessage.includes('safety')) {
				throw new Error('Content was blocked by safety filters. Please try rephrasing your prompt.');
			} else {
				throw new Error(`Failed to analyze prompt: ${errorMessage}`);
			}
		}

		// Parse JSON response
		try {
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No valid JSON found in response');
			}

			const analysis: PromptAnalysisResult = JSON.parse(jsonMatch[0]);

			// Validate and determine missing fields
			const criticalFields = ['brandName', 'industry', 'style'];
			analysis.missingFields = criticalFields.filter(field => {
				const value = analysis[field as keyof PromptAnalysisResult];
				return !value || (typeof value === 'string' && value.trim() === '');
			});

			analysis.hasCompleteInfo = analysis.missingFields.length === 0;

			if (!analysis.extractedInfo) {
				analysis.extractedInfo = {};
			}

			return analysis;
		} catch (parseError) {
			console.error('Failed to parse prompt analysis:', parseError);
			console.error('Raw response:', text);
			
			// Fallback
			return {
				hasCompleteInfo: false,
				missingFields: ['brandName', 'industry', 'style'],
				extractedInfo: {}
			};
		}
	} catch (error) {
		console.error('Error analyzing brand prompt:', error);
		throw new Error('Failed to analyze brand prompt. Please try again.');
	}
}

function createAnalysisPrompt(userPrompt: string): string {
	return `You are an expert brand analyst. Extract brand information from the user's prompt with HIGH PRECISION.

CRITICAL: Only extract information that is EXPLICITLY STATED or VERY CLEARLY IMPLIED. Do NOT guess or infer loosely.

ALLOWED STYLE VALUES (IMPORTANT - use ONLY these exact values):
- "Minimalistic" - clean, simple, minimal design
- "Maximalistic" - bold, busy, maximalist design
- "Funky" - playful, quirky, creative, fun design
- "Futuristic" - modern, tech-forward, innovative design

If user mentions style keywords, map them to ONE of these four:
- clean, simple, minimal, elegant, sleek → "Minimalistic"
- bold, busy, ornate, elaborate, rich → "Maximalistic"
- playful, fun, quirky, creative, colorful, vibrant → "Funky"
- modern, tech, innovative, cutting-edge, futuristic, high-tech → "Futuristic"

If style is unclear or not mentioned, set style to null.

EXTRACTION RULES:

1. brandName: Extract ONLY if a specific name is mentioned (in quotes, capitalized, or clearly identified as the brand/company name). Do NOT guess.

2. industry: Extract ONLY if explicitly mentioned OR very clearly implied by context:
   - "SaaS company" → "SaaS"
   - "healthcare startup" → "Healthcare"
   - "e-commerce store" → "E-commerce"
   - "restaurant" → "Food & Beverage"
   - Do NOT extract industry just from brand name alone

3. style: Extract ONLY if user mentions style/design preferences. Map to ONE of the four allowed values above. Set to null if not mentioned.

4. audience: Extract ONLY if target audience/customers are explicitly mentioned.

5. description: Extract if user describes what the brand/company does.

6. values: Extract if user mentions brand values, mission, or principles.

EXAMPLES:

Example 1 - Complete Information:
User: "Create brand guidelines for TechFlow, a minimalistic SaaS company for enterprise businesses"
{
  "brandName": "TechFlow",
  "industry": "SaaS",
  "style": "Minimalistic",
  "audience": "Enterprise businesses",
  "description": "SaaS company for enterprise",
  "values": null,
  "hasCompleteInfo": true,
  "missingFields": [],
  "extractedInfo": {}
}

Example 2 - Partial Information:
User: "Brand for my coffee shop called Bean & Brew"
{
  "brandName": "Bean & Brew",
  "industry": "Food & Beverage",
  "style": null,
  "audience": null,
  "description": "Coffee shop",
  "values": null,
  "hasCompleteInfo": false,
  "missingFields": ["style"],
  "extractedInfo": {}
}

Example 3 - Minimal Information:
User: "Need brand guidelines for Acme Corp"
{
  "brandName": "Acme Corp",
  "industry": null,
  "style": null,
  "audience": null,
  "description": null,
  "values": null,
  "hasCompleteInfo": false,
  "missingFields": ["industry", "style"],
  "extractedInfo": {}
}

Example 4 - Style Mapping:
User: "Create a fun, playful brand for KidZone toy company"
{
  "brandName": "KidZone",
  "industry": "Retail",
  "style": "Funky",
  "audience": null,
  "description": "Toy company",
  "values": null,
  "hasCompleteInfo": true,
  "missingFields": [],
  "extractedInfo": {
    "original_style_keywords": "fun, playful"
  }
}

Example 5 - Tech/Modern Style:
User: "Build brand for NexGen, a cutting-edge AI startup"
{
  "brandName": "NexGen",
  "industry": "Technology & Software",
  "style": "Futuristic",
  "audience": null,
  "description": "AI startup",
  "values": null,
  "hasCompleteInfo": true,
  "missingFields": [],
  "extractedInfo": {
    "original_style_keywords": "cutting-edge"
  }
}

NOW ANALYZE THIS PROMPT:
"${userPrompt}"

OUTPUT (return ONLY valid JSON, no markdown):
{
  "brandName": "string or null",
  "industry": "string or null",
  "style": "Minimalistic" | "Maximalistic" | "Funky" | "Futuristic" | null,
  "audience": "string or null",
  "description": "string or null",
  "values": "string or null",
  "hasCompleteInfo": boolean,
  "missingFields": ["array of missing: brandName, industry, style"],
  "extractedInfo": {}
}

Return ONLY the JSON object.`;
}

