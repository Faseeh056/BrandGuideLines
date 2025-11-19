import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$lib/env';
import type { ScrapedIndustryData } from '$lib/services/grounding-search';

// Initialize Gemini AI (lazy initialization)
function getGenAI(): GoogleGenerativeAI {
	const apiKey = env?.GOOGLE_GEMINI_API || '';
	if (!apiKey) {
		throw new Error('GOOGLE_GEMINI_API is not configured. Please set it in your .env file.');
	}
	return new GoogleGenerativeAI(apiKey);
}

export interface IndustryQuestion {
	id: string;
	question: string;
	type: 'text' | 'text-with-suggestions' | 'select' | 'logo';
	suggestions?: string[];
	required: boolean;
	icon: string;
	helper?: string;
}

/**
 * Generate industry-specific questions based on selected industry
 * Uses 3-shot prompt approach
 */
export async function generateIndustryQuestions(
	industry: string,
	existingInfo?: {
		brandName?: string;
		style?: string;
		audience?: string;
	},
	alreadyAskedQuestionIds?: string[], // NEW: Track already asked question IDs
	groundingData?: ScrapedIndustryData,
	previousQuestions?: string[]
): Promise<IndustryQuestion[]> {
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
					console.log('[industry-questions] ✓ Found API key in process.env directly');
				}
			}
		}
		
		// Final check
		if (!apiKey || apiKey.trim() === '') {
			console.error('[industry-questions] API key not found. env.GOOGLE_GEMINI_API:', env?.GOOGLE_GEMINI_API || 'undefined/empty');
			console.error('[industry-questions] process.env.Google_Gemini_Api:', typeof process !== 'undefined' && process.env ? process.env.Google_Gemini_Api || 'NOT FOUND' : 'process not available');
			throw new Error('Google Gemini API key is not configured. Please check your .env file and ensure Google_Gemini_Api is set correctly, then restart the dev server.');
		}
		
		// Use the API key directly instead of env object
		const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-2.0-flash' });

		const prompt = createIndustryQuestionsPrompt(
			industry,
			existingInfo,
			alreadyAskedQuestionIds,
			groundingData,
			previousQuestions
		);

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		try {
			const jsonMatch = text.match(/\[[\s\S]*\]/);
			if (!jsonMatch) {
				throw new Error('No valid JSON array found in response');
			}

			const questions: IndustryQuestion[] = JSON.parse(jsonMatch[0]);
			return questions;
		} catch (parseError) {
			console.error('Failed to parse industry questions:', parseError);
			console.error('Raw response:', text);
			
			// Fallback: return empty array
			return [];
		}
	} catch (error) {
		console.error('Error generating industry questions:', error);
		return [];
	}
}

function createIndustryQuestionsPrompt(
	industry: string,
	existingInfo?: {
		brandName?: string;
		style?: string;
		audience?: string;
	},
	alreadyAskedQuestionIds?: string[],
	groundingData?: ScrapedIndustryData,
	previousQuestions?: string[]
): string {
	const contextInfo = existingInfo
		? `\n\nEXISTING INFORMATION:\n- Brand Name: ${existingInfo.brandName || 'Not provided'}\n- Style: ${existingInfo.style || 'Not provided'}\n- Audience: ${existingInfo.audience || 'Not provided'}`
		: '';

	const alreadyAskedInfo =
		alreadyAskedQuestionIds && alreadyAskedQuestionIds.length > 0
			? `\n\n⚠️ IMPORTANT - DO NOT ASK QUESTIONS ON THESE TOPICS AGAIN:\n${alreadyAskedQuestionIds
					.map((id) => `- ${id}`)
					.join('\n')}`
			: '';

	const askedQuestionSection =
		previousQuestions && previousQuestions.length > 0
			? `\n\nQUESTIONS/ANGLES ALREADY COVERED:\n${previousQuestions
					.map((q, idx) => `  ${idx + 1}. ${q}`)
					.join('\n')}\nYou must propose entirely new angles.`
			: '';

	const groundingSection = groundingData
		? `\n\n🔍 REAL-WORLD INSIGHTS FROM ${industry.toUpperCase()} BRANDS:\n- SUMMARY: ${groundingData.summary}\n- KEY FINDINGS:\n${groundingData.keyFindings
				.slice(0, 5)
				.map((finding, idx) => `  ${idx + 1}. ${finding}`)
				.join('\n')}\n- EXAMPLES:\n${groundingData.websites
				.slice(0, 3)
				.map((site) => `  • ${site.title}: ${site.extractedFacts.slice(0, 2).join('; ')}`)
				.join('\n')}\n\nEvery follow-up MUST cite or obviously stem from one of these insights. Do not introduce topics that do not appear here or in the EXISTING INFORMATION.`
		: '';

	return `You are a senior brand strategist. Generate 2-3 new follow-up questions for the "${industry}" industry that uncover nuanced details we still need.\n
CRITICAL RULES:\n
1. Each question must explicitly reference the ${industry} industry and call out a concrete phrase, pattern, or example from the REAL-WORLD INSIGHTS section above.\n
2. Output AT LEAST TWO questions (never one). Three is ideal when you have enough insights.\n
3. Keep every question extremely simple, plain-language, and limited to ONE sentence (max 18 words). No jargon, no multi-part prompts.\n
4. Never repeat or lightly rephrase a topic that has already been asked. ${askedQuestionSection}\n
5. If a topic (e.g., "sustainability") is not present in the insights or existing information, you must NOT introduce it.\n
6. Questions must cover different themes (e.g., product innovation, customer experience, go-to-market, operations, partnerships, etc.).\n
7. EVERY question must use the "text-with-suggestions" type and include 4-6 concrete options that each map back to a specific insight, competitor example, or data point provided. Do not invent generic options.\n
8. All questions should be optional (required: false) and include a short helper sentence (max 18 words) that explains the benefit.\n
9. ${alreadyAskedInfo}\n

REAL-WORLD DATA FOR REFERENCE:\n${groundingSection || 'No additional research data is available. Focus on unique, high-impact questions derived from the existing brand information.'}\n

OUTPUT: Return ONLY a JSON array.\n

EXAMPLE OUTPUTS (structure reference only — DO NOT copy verbatim):\n
Example 1 - SaaS Industry:\nIndustry: "SaaS"\nOutput:\n[\n  {\n    "id": "targetUserType",\n    "question": "What's your target user type?",\n    "type": "text-with-suggestions",\n    "suggestions": ["B2B Enterprise", "B2B SMB", "B2C", "B2B2C"],\n    "required": false,\n    "icon": "👥",\n    "helper": "This helps us create more targeted brand guidelines for your specific user base"\n  },\n  {\n    "id": "productCategory",\n    "question": "What category does your SaaS product fall into?",\n    "type": "text-with-suggestions",\n    "suggestions": ["Project Management", "CRM", "Marketing Automation", "Analytics", "Communication", "HR/People Ops", "Finance/Accounting", "Developer Tools"],\n    "required": false,\n    "icon": "📊",\n    "helper": "This helps us tailor UI/UX guidelines and iconography"\n  }\n]\n
Example 2 - Healthcare Industry:\nIndustry: "Healthcare"\nOutput:\n[\n  {\n    "id": "healthcareType",\n    "question": "What type of healthcare services do you provide?",\n    "type": "text-with-suggestions",\n    "suggestions": ["Hospital", "Clinic", "Telemedicine", "Pharmaceutical", "Medical Device", "Health Insurance", "Wellness/Preventive Care"],\n    "required": false,\n    "icon": "🏥",\n    "helper": "This helps us create appropriate imagery and compliance-focused guidelines"\n  },\n  {\n    "id": "patientDemographics",\n    "question": "Who is your primary patient demographic?",\n    "type": "text-with-suggestions",\n    "suggestions": ["General Public", "Seniors", "Children", "Women's Health", "Mental Health", "Chronic Care", "Emergency Care"],\n    "required": false,\n    "icon": "👨‍⚕️",\n    "helper": "This helps us tailor communication tone and visual style"\n  }\n]\n
Example 3 - Gaming Industry:\nIndustry: "Gaming"\nOutput:\n[\n  {\n    "id": "gameGenre",\n    "question": "What genre does your game fall into?",\n    "type": "text-with-suggestions",\n    "suggestions": ["Action", "Adventure", "RPG", "Strategy", "Puzzle", "Racing", "Sports", "Simulation", "Fighting", "Horror", "MMO", "Mobile Casual"],\n    "required": false,\n    "icon": "🎮",\n    "helper": "This helps us create genre-appropriate visual style and color palettes"\n  },\n  {\n    "id": "targetAgeGroup",\n    "question": "What's your primary target age group?",\n    "type": "text-with-suggestions",\n    "suggestions": ["Kids (6-12)", "Teens (13-17)", "Young Adults (18-25)", "Adults (26-35)", "Mature (36+)", "All Ages"],\n    "required": false,\n    "icon": "👥",\n    "helper": "This helps us tailor typography, imagery, and communication tone"\n  },\n  {\n    "id": "monetizationModel",\n    "question": "What's your monetization model?",\n    "type": "text-with-suggestions",\n    "suggestions": ["Free-to-Play", "Premium/Paid", "Subscription", "In-App Purchases", "Ad-Supported", "Hybrid"],\n    "required": false,\n    "icon": "💰",\n    "helper": "This helps us create appropriate UI/UX guidelines and marketing materials"\n  }\n]\n
Example 4 - Fashion Industry:\nIndustry: "Fashion"\nOutput:\n[\n  {\n    "id": "fashionCategory",\n    "question": "What's your fashion category?",\n    "type": "text-with-suggestions",\n    "suggestions": ["Luxury", "Streetwear", "Sustainable/Eco", "Fast Fashion", "Athleisure", "Vintage/Retro", "High-End Designer", "Accessible Fashion"],\n    "required": false,\n    "icon": "👗",\n    "helper": "This helps us create appropriate brand positioning and visual style"\n  },\n  {\n    "id": "targetMarket",\n    "question": "What's your primary market focus?",\n    "type": "text-with-suggestions",\n    "suggestions": ["Women's", "Men's", "Unisex", "Children's", "Plus Size", "Petite", "Luxury Market"],\n    "required": false,\n    "icon": "🌍",\n    "helper": "This helps us tailor photography and marketing guidelines"\n  }\n]\n
NOW GENERATE QUESTIONS FOR THIS INDUSTRY:\nIndustry: "${industry}"${contextInfo}\n
OUTPUT FORMAT (return ONLY valid JSON array, no markdown, no code blocks):\n[\n  {\n    "id": "uniqueQuestionId",\n    "question": "Question text",\n    "type": "text" | "text-with-suggestions" | "select",\n    "suggestions": ["option1", "option2", ...], // Only if type is "text-with-suggestions"\n    "required": false,\n    "icon": "emoji",\n    "helper": "Optional helper text"\n  }\n]\n
Return ONLY the JSON array, no additional text.\n
IMPORTANT: Generate 2-3 questions (preferably 2-3, not just 1) that cover different aspects of the ${industry} industry. Each question should help create more accurate and tailored brand guidelines. Think about what information would be most valuable for generating industry-specific colors, typography, imagery, and tone.`;
}

/**
 * Get basic essential questions (always asked)
 */
export function getEssentialQuestions(analysis: {
	brandName?: string;
	industry?: string;
	style?: string;
}): IndustryQuestion[] {
	const questions: IndustryQuestion[] = [];

	// Brand Name (if missing)
	if (!analysis.brandName) {
		questions.push({
			id: 'brandName',
			question: 'What is your brand name?',
			type: 'text',
			required: true,
			icon: '🏢',
			helper: 'This is the official name of your brand or company'
		});
	}

	// Industry (if missing)
	if (!analysis.industry) {
		questions.push({
			id: 'industry',
			question: 'What industry does your brand operate in?',
			type: 'text-with-suggestions',
			required: true,
			icon: '🎯',
			helper: 'Choose from common industries or type your own',
			suggestions: [
				'SaaS',
				'Fintech',
				'Healthcare',
				'E-commerce',
				'Retail',
				'Technology & Software',
				'Education & Learning',
				'Food & Beverage',
				'Fashion & Luxury',
				'Real Estate',
				'Consulting & Professional Services',
				'Non-profit & Social Impact',
				'Finance & Banking',
				'Healthcare & Medical',
				'Manufacturing & Industrial',
				'Travel & Hospitality',
				'Entertainment & Media',
				'Automotive',
				'Energy & Utilities',
				'Legal Services',
				'Marketing & Advertising',
				'Sports & Fitness',
				'Beauty & Personal Care',
				'Creative Agency & Design'
			]
		});
	}

	// Style/Vibe (ALWAYS ASK - even if mentioned)
	const styleOptions = [
		'Minimalistic',
		'Maximalistic',
		'Funky',
		'Futuristic',
		'Retro/Vintage',
		'Playful',
		'Professional',
		'Bold',
		'Modern',
		'Classic',
		'Elegant',
		'Luxury',
		'Casual',
		'Artistic',
		'Contemporary'
	];

	questions.push({
		id: 'style',
		question: analysis.style
			? `You mentioned "${analysis.style}". Please confirm this is the style you want, or choose a different one:`
			: "What's your brand's visual style/vibe?",
		type: 'text-with-suggestions',
		required: true,
		icon: '🎨',
		helper: 'Choose a style that best represents your brand\'s aesthetic',
		suggestions: styleOptions
	});

	// Logo question (always asked after style)
	questions.push({
		id: 'logo',
		question: 'Do you have a logo, or would you like us to generate one with AI?',
		type: 'logo',
		required: true,
		icon: '🖼️',
		helper: 'Upload your existing logo or let AI create one based on your brand details'
	});

	return questions;
}

