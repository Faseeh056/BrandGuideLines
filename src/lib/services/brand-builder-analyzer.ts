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
	const promptLength = userPrompt.length;
	const isLongPrompt = promptLength > 200;
	const isShortPrompt = promptLength < 50;
	
	return `You are an expert brand analyst with deep understanding of brand guidelines creation. Your task is to perform a COMPREHENSIVE and DEEP analysis of the user's prompt, whether it's short or long.

ANALYSIS APPROACH:
${isLongPrompt ? `
This is a LONG prompt (${promptLength} characters). Perform DEEP analysis:
- Extract ALL mentioned information, even if subtle or implied
- Look for context clues and related information
- Identify patterns and connections between mentioned elements
- Extract industry-specific details, use cases, and requirements
- Note any brand values, mission, or vision statements
- Identify target demographics, psychographics, and user personas
- Extract style preferences, design directions, and aesthetic choices
- Look for technical requirements, platforms, or applications
` : isShortPrompt ? `
This is a SHORT prompt (${promptLength} characters). Perform FOCUSED analysis:
- Extract every piece of information, no matter how small
- Look for implicit meanings and context
- Identify what can be inferred from the brand name itself
- Note any style keywords or industry hints
- Extract any audience indicators
` : `
This is a MEDIUM prompt (${promptLength} characters). Perform BALANCED analysis:
- Extract all explicit information
- Look for implicit context and connections
- Identify missing critical information
`}

CRITICAL EXTRACTION RULES:
1. Extract information that is EXPLICITLY mentioned
2. Also extract information that is CLEARLY IMPLIED from context
3. For brand names, analyze if they suggest industry or style (e.g., "TechFlow" suggests tech/SaaS)
4. Look for synonyms and related terms (e.g., "startup" = tech/SaaS, "app" = mobile/software)
5. For style, recognize: minimalistic, maximalistic, funky, futuristic, retro, vintage, playful, professional, bold, modern, classic, elegant, clean, vibrant, sophisticated, edgy, warm, cool, corporate, creative
6. Extract partial information even if incomplete (e.g., "tech company" even if specific industry unclear)
7. Identify use cases: website, mobile app, packaging, print, social media, etc.
8. Extract brand personality traits mentioned or implied

FIELD-SPECIFIC EXTRACTION GUIDELINES:

brandName: Extract any company name, brand name, product name, or project name mentioned. If multiple, prioritize the main brand.

industry: Extract industry, sector, domain, or business type. Look for:
- Direct mentions: "SaaS", "healthcare", "fintech", "e-commerce"
- Indirect mentions: "startup" (often tech/SaaS), "app" (software/mobile), "retail" (e-commerce)
- Context clues: product type, service type, target market type

style: Extract aesthetic, design direction, or visual style. Look for:
- Direct style words: minimalistic, modern, bold, etc.
- Mood words: professional, playful, serious, friendly
- Design direction: clean, vibrant, sophisticated, edgy
- Color preferences: bright, muted, monochrome, colorful

audience: Extract target audience, customer base, or user personas. Look for:
- Demographics: age ranges, professions, locations
- Psychographics: lifestyles, interests, behaviors
- User types: professionals, students, consumers, businesses
- Market segments: B2B, B2C, enterprise, SMB

description: Extract brand description, mission, product description, or what the brand does.

values: Extract brand values, mission statement, vision, principles, or core beliefs.

EXAMPLES:

Example 1 - Long Detailed Prompt:
User: "I'm launching a new fintech startup called 'WealthBridge' that helps young professionals (ages 25-40) manage their investments through a mobile-first platform. We want a modern, trustworthy brand that feels approachable but professional. Our values are transparency, empowerment, and simplicity. The brand will be used across our mobile app, website, and marketing materials."
Analysis:
{
  "brandName": "WealthBridge",
  "industry": "Fintech",
  "style": "Modern / Professional / Approachable",
  "audience": "Young professionals ages 25-40",
  "description": "Fintech startup helping young professionals manage investments through mobile-first platform",
  "values": "Transparency, empowerment, simplicity",
  "hasCompleteInfo": true,
  "missingFields": [],
  "extractedInfo": {
    "use_cases": ["mobile app", "website", "marketing materials"],
    "platform": "mobile-first",
    "personality": "approachable but professional",
    "trustworthy": true
  }
}

Example 2 - Short Prompt:
User: "Brand for PixelFarm"
Analysis:
{
  "brandName": "PixelFarm",
  "industry": null,
  "style": null,
  "audience": null,
  "description": null,
  "values": null,
  "hasCompleteInfo": false,
  "missingFields": ["industry", "style"],
  "extractedInfo": {
    "name_suggests": "design/creative/tech related (pixel suggests digital/design)"
  }
}

Example 3 - Medium Prompt with Context:
User: "Create guidelines for 'GreenLeaf', an eco-friendly skincare brand targeting millennials who care about sustainability. We want a natural, organic feel."
Analysis:
{
  "brandName": "GreenLeaf",
  "industry": "Skincare / Beauty / E-commerce",
  "style": "Natural / Organic",
  "audience": "Millennials who care about sustainability",
  "description": "Eco-friendly skincare brand",
  "values": "Sustainability, eco-friendly",
  "hasCompleteInfo": true,
  "missingFields": [],
  "extractedInfo": {
    "niche": "eco-friendly skincare",
    "target_demographic": "millennials",
    "brand_focus": "sustainability"
  }
}

NOW PERFORM DEEP ANALYSIS OF THIS PROMPT:
"${userPrompt}"

OUTPUT FORMAT (return ONLY valid JSON, no markdown, no code blocks):
{
  "brandName": "extracted brand name or null",
  "industry": "extracted industry or null",
  "style": "extracted style or null",
  "audience": "extracted target audience or null",
  "description": "extracted description or null",
  "values": "extracted values/mission or null",
  "hasCompleteInfo": true/false,
  "missingFields": ["array of missing critical field names"],
  "extractedInfo": {
    "any additional extracted information as key-value pairs"
  }
}

Return ONLY the JSON object, no additional text.`;
}

