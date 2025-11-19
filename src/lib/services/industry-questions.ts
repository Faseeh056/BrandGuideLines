import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$lib/env';

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
	alreadyAskedQuestionIds?: string[] // NEW: Track already asked question IDs
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

		const prompt = createIndustryQuestionsPrompt(industry, existingInfo, alreadyAskedQuestionIds);

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
	alreadyAskedQuestionIds?: string[]
): string {
	const contextInfo = existingInfo
		? `\n\nEXISTING INFORMATION:\n- Brand Name: ${existingInfo.brandName || 'Not provided'}\n- Style: ${existingInfo.style || 'Not provided'}\n- Audience: ${existingInfo.audience || 'Not provided'}`
		: '';
	
	const alreadyAskedInfo = alreadyAskedQuestionIds && alreadyAskedQuestionIds.length > 0
		? `\n\n⚠️ IMPORTANT - DO NOT ASK THESE QUESTIONS (already asked):\n${alreadyAskedQuestionIds.map(id => `- ${id}`).join('\n')}\n\nDO NOT generate questions with IDs that are similar to these. Ask about COMPLETELY DIFFERENT aspects.`
		: '';

	return `You are a brand consultant. Generate industry-specific follow-up questions for the "${industry}" industry to gather more detailed information for creating accurate brand guidelines.

CRITICAL RULES:
1. **Generate 2-3 questions** (aim for 2-3, not just 1) - These should be the most important questions that will significantly improve brand guideline accuracy
2. Questions must be SPECIFIC to ${industry} industry - Think about what makes this industry unique
3. Questions should help generate more accurate, industry-appropriate content (colors, typography, imagery, tone, applications)
4. Use appropriate question types: 'text', 'text-with-suggestions', or 'select'
5. Include helpful suggestions for 'text-with-suggestions' type (5-8 options)
6. All questions should be optional (required: false) - these are refinement questions
7. **AVOID DUPLICATE QUESTIONS** - Each question must have a UNIQUE id and ask about DIFFERENT aspects
8. **DO NOT ask similar questions** - If you ask about "platform", don't ask about "platforms" or "target platform" - ask about something completely different (e.g., game genre, monetization model, target age group)
9. **Question IDs must be unique and descriptive** - Use specific IDs like "gamingPlatform", "gameGenre", "targetAgeGroup", "monetizationModel" (NOT generic like "platform", "type", "category")
10. **Check already asked questions** - Make sure your question IDs are NOT similar to any already asked questions${alreadyAskedInfo}
11. **DIVERSITY IS KEY** - Ask about different aspects: business model, target audience, product/service type, market positioning, use cases, etc.

EXAMPLES (3-shot learning):

Example 1 - SaaS Industry:
Industry: "SaaS"
Output:
[
  {
    "id": "targetUserType",
    "question": "What's your target user type?",
    "type": "text-with-suggestions",
    "suggestions": ["B2B Enterprise", "B2B SMB", "B2C", "B2B2C"],
    "required": false,
    "icon": "👥",
    "helper": "This helps us create more targeted brand guidelines for your specific user base"
  },
  {
    "id": "productCategory",
    "question": "What category does your SaaS product fall into?",
    "type": "text-with-suggestions",
    "suggestions": ["Project Management", "CRM", "Marketing Automation", "Analytics", "Communication", "HR/People Ops", "Finance/Accounting", "Developer Tools"],
    "required": false,
    "icon": "📊",
    "helper": "This helps us tailor UI/UX guidelines and iconography"
  }
]

Example 2 - Healthcare Industry:
Industry: "Healthcare"
Output:
[
  {
    "id": "healthcareType",
    "question": "What type of healthcare services do you provide?",
    "type": "text-with-suggestions",
    "suggestions": ["Hospital", "Clinic", "Telemedicine", "Pharmaceutical", "Medical Device", "Health Insurance", "Wellness/Preventive Care"],
    "required": false,
    "icon": "🏥",
    "helper": "This helps us create appropriate imagery and compliance-focused guidelines"
  },
  {
    "id": "patientDemographics",
    "question": "Who is your primary patient demographic?",
    "type": "text-with-suggestions",
    "suggestions": ["General Public", "Seniors", "Children", "Women's Health", "Mental Health", "Chronic Care", "Emergency Care"],
    "required": false,
    "icon": "👨‍⚕️",
    "helper": "This helps us tailor communication tone and visual style"
  }
]

Example 3 - Gaming Industry:
Industry: "Gaming"
Output:
[
  {
    "id": "gameGenre",
    "question": "What genre does your game fall into?",
    "type": "text-with-suggestions",
    "suggestions": ["Action", "Adventure", "RPG", "Strategy", "Puzzle", "Racing", "Sports", "Simulation", "Fighting", "Horror", "MMO", "Mobile Casual"],
    "required": false,
    "icon": "🎮",
    "helper": "This helps us create genre-appropriate visual style and color palettes"
  },
  {
    "id": "targetAgeGroup",
    "question": "What's your primary target age group?",
    "type": "text-with-suggestions",
    "suggestions": ["Kids (6-12)", "Teens (13-17)", "Young Adults (18-25)", "Adults (26-35)", "Mature (36+)", "All Ages"],
    "required": false,
    "icon": "👥",
    "helper": "This helps us tailor typography, imagery, and communication tone"
  },
  {
    "id": "monetizationModel",
    "question": "What's your monetization model?",
    "type": "text-with-suggestions",
    "suggestions": ["Free-to-Play", "Premium/Paid", "Subscription", "In-App Purchases", "Ad-Supported", "Hybrid"],
    "required": false,
    "icon": "💰",
    "helper": "This helps us create appropriate UI/UX guidelines and marketing materials"
  }
]

Example 4 - Fashion Industry:
Industry: "Fashion"
Output:
[
  {
    "id": "fashionCategory",
    "question": "What's your fashion category?",
    "type": "text-with-suggestions",
    "suggestions": ["Luxury", "Streetwear", "Sustainable/Eco", "Fast Fashion", "Athleisure", "Vintage/Retro", "High-End Designer", "Accessible Fashion"],
    "required": false,
    "icon": "👗",
    "helper": "This helps us create appropriate brand positioning and visual style"
  },
  {
    "id": "targetMarket",
    "question": "What's your primary market focus?",
    "type": "text-with-suggestions",
    "suggestions": ["Women's", "Men's", "Unisex", "Children's", "Plus Size", "Petite", "Luxury Market"],
    "required": false,
    "icon": "🌍",
    "helper": "This helps us tailor photography and marketing guidelines"
  }
]

NOW GENERATE QUESTIONS FOR THIS INDUSTRY:
Industry: "${industry}"${contextInfo}

OUTPUT FORMAT (return ONLY valid JSON array, no markdown, no code blocks):
[
  {
    "id": "uniqueQuestionId",
    "question": "Question text",
    "type": "text" | "text-with-suggestions" | "select",
    "suggestions": ["option1", "option2", ...], // Only if type is "text-with-suggestions"
    "required": false,
    "icon": "emoji",
    "helper": "Optional helper text"
  }
]

Return ONLY the JSON array, no additional text. 

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

