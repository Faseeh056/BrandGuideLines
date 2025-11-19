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
		// Try gemini-2.0-flash-exp first, fallback to gemini-2.0-flash
		let model;
		try {
			model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
		} catch (e) {
			console.warn('[brand-builder-analyzer] gemini-2.0-flash-exp not available, using gemini-2.0-flash');
			model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-2.0-flash' });
		}

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
	return `You are a brand analysis expert. Analyze the following user prompt about creating brand guidelines and extract all available information.

CRITICAL RULES:
1. Only extract information that is EXPLICITLY mentioned in the prompt
2. Do NOT infer or guess information that isn't clearly stated
3. If information is not mentioned, mark it as missing
4. Be precise and accurate with your extraction
5. For "style", look for words like: minimalistic, maximalistic, funky, futuristic, retro, vintage, playful, professional, bold, modern, classic, elegant

EXAMPLES (3-shot learning):

Example 1 - Complete Info:
User Prompt: "Create brand guidelines for 'Aurora Labs', biotech startup making wearable sleep trackers. Target: busy professionals 30–50, style: Futuristic + minimalistic, primary use: mobile app and packaging."
Analysis Result:
{
  "brandName": "Aurora Labs",
  "industry": "Biotech / Wearables",
  "style": "Futuristic / Minimalistic",
  "audience": "Busy professionals 30-50",
  "description": "Biotech startup making wearable sleep trackers",
  "values": null,
  "hasCompleteInfo": true,
  "missingFields": [],
  "extractedInfo": {
    "primary_use": "mobile app and packaging"
  }
}

Example 2 - Partial Info:
User Prompt: "I need a brand for my startup 'PixelFarm'"
Analysis Result:
{
  "brandName": "PixelFarm",
  "industry": null,
  "style": null,
  "audience": null,
  "description": null,
  "values": null,
  "hasCompleteInfo": false,
  "missingFields": ["industry", "style"],
  "extractedInfo": {}
}

Example 3 - Style Mentioned:
User Prompt: "Create brand for TechFlow, SaaS company, minimalistic style"
Analysis Result:
{
  "brandName": "TechFlow",
  "industry": "SaaS",
  "style": "Minimalistic",
  "audience": null,
  "description": null,
  "values": null,
  "hasCompleteInfo": true,
  "missingFields": [],
  "extractedInfo": {}
}

NOW ANALYZE THIS USER PROMPT:
"${userPrompt}"

OUTPUT FORMAT (return ONLY valid JSON, no markdown, no code blocks):
{
  "brandName": "extracted brand name or null",
  "industry": "extracted industry or null",
  "style": "extracted style (minimalistic/funky/futuristic/maximalistic/modern/etc.) or null",
  "audience": "extracted target audience or null",
  "description": "extracted description or null",
  "values": "extracted values/mission or null",
  "hasCompleteInfo": true/false,
  "missingFields": ["array of missing field names like 'industry', 'style']",
  "extractedInfo": {
    "any additional extracted information as key-value pairs"
  }
}

Return ONLY the JSON object, no additional text.`;
}

