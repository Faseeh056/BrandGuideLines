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
 * Fallback industry-specific questions for common industries
 * Used when AI generation fails or returns invalid questions
 */
const FALLBACK_INDUSTRY_QUESTIONS: Record<string, IndustryQuestion[]> = {
	retail: [
		{
			id: 'retailType',
			question: 'What type of retail business are you?',
			type: 'text-with-suggestions',
			suggestions: ['Fashion & Apparel', 'Electronics & Tech', 'Home & Furniture', 'Grocery & Food', 'Health & Beauty', 'Sports & Outdoor', 'Jewelry & Accessories', 'General Merchandise'],
			required: false,
			icon: '🏪',
			helper: 'This determines the visual style and customer experience approach for your brand'
		},
		{
			id: 'salesChannel',
			question: 'What is your primary sales channel?',
			type: 'text-with-suggestions',
			suggestions: ['Physical Stores', 'E-commerce Only', 'Omnichannel (Both)', 'Marketplace (Amazon, etc.)', 'Direct-to-Consumer', 'Wholesale/B2B'],
			required: false,
			icon: '🛒',
			helper: 'This shapes your brand touchpoints and visual consistency requirements'
		},
		{
			id: 'pricePoint',
			question: 'What is your market positioning?',
			type: 'text-with-suggestions',
			suggestions: ['Budget/Value', 'Mid-Range', 'Premium', 'Luxury', 'Discount/Outlet'],
			required: false,
			icon: '💰',
			helper: 'Price positioning influences typography, imagery style, and overall brand aesthetic'
		}
	],
	technology: [
		{
			id: 'techSector',
			question: 'Which technology sector best describes your business?',
			type: 'text-with-suggestions',
			suggestions: ['SaaS/Cloud Software', 'Mobile Apps', 'AI/Machine Learning', 'Cybersecurity', 'Fintech', 'Healthtech', 'E-commerce Platform', 'Developer Tools', 'IoT/Hardware'],
			required: false,
			icon: '💻',
			helper: 'Different tech sectors have distinct visual languages and user expectations'
		},
		{
			id: 'targetCustomer',
			question: 'Who is your primary customer?',
			type: 'text-with-suggestions',
			suggestions: ['Enterprise (B2B)', 'Small Business (SMB)', 'Consumers (B2C)', 'Developers', 'Government/Public Sector', 'Startups'],
			required: false,
			icon: '🎯',
			helper: 'Your target customer determines the appropriate tone, complexity, and visual approach'
		}
	],
	healthcare: [
		{
			id: 'healthcareType',
			question: 'What type of healthcare services do you provide?',
			type: 'text-with-suggestions',
			suggestions: ['Hospital/Medical Center', 'Clinic/Practice', 'Telemedicine', 'Pharmaceutical', 'Medical Devices', 'Health Insurance', 'Mental Health', 'Wellness & Preventive'],
			required: false,
			icon: '🏥',
			helper: 'This helps create appropriate imagery and compliance-focused guidelines'
		},
		{
			id: 'patientType',
			question: 'Who is your primary patient/customer demographic?',
			type: 'text-with-suggestions',
			suggestions: ['General Public', 'Seniors/Elderly', 'Children/Pediatric', 'Women\'s Health', 'Chronic Care', 'Corporate/Workplace', 'Athletes/Sports'],
			required: false,
			icon: '👥',
			helper: 'Understanding your audience helps tailor communication tone and visual accessibility'
		}
	],
	food: [
		{
			id: 'foodType',
			question: 'What type of food business are you?',
			type: 'text-with-suggestions',
			suggestions: ['Restaurant/Dining', 'Fast Food/QSR', 'Café/Coffee Shop', 'Food Delivery', 'Packaged Foods/CPG', 'Catering', 'Food Truck', 'Bakery/Desserts'],
			required: false,
			icon: '🍽️',
			helper: 'This determines the visual style, photography approach, and brand personality'
		},
		{
			id: 'cuisineStyle',
			question: 'What cuisine or food category do you specialize in?',
			type: 'text-with-suggestions',
			suggestions: ['American/Comfort', 'Italian', 'Asian Fusion', 'Mexican/Latin', 'Health/Organic', 'Vegan/Plant-Based', 'Fine Dining', 'Casual/Family'],
			required: false,
			icon: '🍕',
			helper: 'Cuisine type influences color palette, typography, and overall brand aesthetic'
		}
	],
	finance: [
		{
			id: 'financeType',
			question: 'What type of financial services do you offer?',
			type: 'text-with-suggestions',
			suggestions: ['Banking', 'Investment/Wealth Management', 'Insurance', 'Fintech/Digital Payments', 'Lending/Credit', 'Accounting/Tax', 'Financial Planning', 'Cryptocurrency'],
			required: false,
			icon: '🏦',
			helper: 'Financial service type determines trust signals, compliance needs, and visual approach'
		},
		{
			id: 'targetClient',
			question: 'Who is your primary client segment?',
			type: 'text-with-suggestions',
			suggestions: ['Individual Consumers', 'High Net Worth', 'Small Business', 'Enterprise/Corporate', 'Millennials/Gen Z', 'Retirees', 'Startups'],
			required: false,
			icon: '🎯',
			helper: 'Client segment shapes messaging tone, complexity level, and brand personality'
		}
	],
	education: [
		{
			id: 'educationType',
			question: 'What type of educational service do you provide?',
			type: 'text-with-suggestions',
			suggestions: ['K-12 School', 'Higher Education', 'Online Learning/EdTech', 'Corporate Training', 'Test Prep/Tutoring', 'Language Learning', 'Professional Certification', 'Early Childhood'],
			required: false,
			icon: '🎓',
			helper: 'Education type determines visual complexity, tone, and engagement approach'
		},
		{
			id: 'learnerAge',
			question: 'What is your primary learner demographic?',
			type: 'text-with-suggestions',
			suggestions: ['Children (K-5)', 'Teens (6-12)', 'College Students', 'Working Professionals', 'Career Changers', 'Lifelong Learners', 'All Ages'],
			required: false,
			icon: '👥',
			helper: 'Learner age group influences visual style, interactivity, and communication approach'
		}
	],
	ecommerce: [
		{
			id: 'ecommerceType',
			question: 'What type of e-commerce business are you?',
			type: 'text-with-suggestions',
			suggestions: ['Marketplace/Multi-vendor', 'Direct-to-Consumer Brand', 'Dropshipping', 'Subscription Box', 'Digital Products', 'B2B E-commerce', 'Social Commerce'],
			required: false,
			icon: '🛍️',
			helper: 'Business model determines checkout flow, trust signals, and visual hierarchy'
		},
		{
			id: 'productCategory',
			question: 'What product category do you primarily sell?',
			type: 'text-with-suggestions',
			suggestions: ['Fashion & Apparel', 'Electronics', 'Home & Garden', 'Beauty & Personal Care', 'Food & Beverages', 'Sports & Fitness', 'Toys & Games', 'Art & Crafts'],
			required: false,
			icon: '📦',
			helper: 'Product category influences photography style, color palette, and brand personality'
		}
	]
};

/**
 * Get fallback questions for an industry
 */
function getFallbackQuestions(industry: string): IndustryQuestion[] {
	const normalizedIndustry = industry.toLowerCase().trim();

	// Direct match
	if (FALLBACK_INDUSTRY_QUESTIONS[normalizedIndustry]) {
		return FALLBACK_INDUSTRY_QUESTIONS[normalizedIndustry];
	}

	// Partial match
	for (const [key, questions] of Object.entries(FALLBACK_INDUSTRY_QUESTIONS)) {
		if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
			return questions;
		}
	}

	// Generic fallback for unknown industries
	return [
		{
			id: 'businessModel',
			question: `What type of ${industry} business are you?`,
			type: 'text-with-suggestions',
			suggestions: ['Service Provider', 'Product Company', 'Platform/Marketplace', 'Consulting/Agency', 'Hybrid Model'],
			required: false,
			icon: '🏢',
			helper: 'This helps us understand your business model and create appropriate guidelines'
		},
		{
			id: 'targetMarket',
			question: 'Who is your primary target market?',
			type: 'text-with-suggestions',
			suggestions: ['Consumers (B2C)', 'Businesses (B2B)', 'Enterprise', 'Small Business', 'Government', 'Both B2B and B2C'],
			required: false,
			icon: '🎯',
			helper: 'Understanding your audience helps tailor the brand voice and visual style'
		}
	];
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
	alreadyAskedQuestionIds?: string[], // Track already asked question IDs
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

			const rawQuestions = JSON.parse(jsonMatch[0]);

			// Validate and ensure all questions have proper suggestions
			const validatedQuestions: IndustryQuestion[] = rawQuestions
				.filter((q: any) => q && q.id && q.question)
				.map((q: any) => {
					// Ensure suggestions exist and have at least 3 options
					const suggestions = Array.isArray(q.suggestions) && q.suggestions.length >= 3
						? q.suggestions
						: null;

					return {
						id: q.id,
						question: q.question,
						// Always use text-with-suggestions if we have suggestions, otherwise text
						type: suggestions ? 'text-with-suggestions' : 'text',
						suggestions: suggestions || undefined,
						required: q.required ?? false,
						icon: q.icon || '💡',
						helper: q.helper || `This helps us tailor your ${industry} brand guidelines`
					} as IndustryQuestion;
				});

			// Check if we got valid questions with suggestions
			const questionsWithSuggestions = validatedQuestions.filter(
				q => q.type === 'text-with-suggestions' && q.suggestions && q.suggestions.length >= 3
			);

			// If no valid questions with suggestions, use fallback
			if (questionsWithSuggestions.length === 0) {
				console.log(`[industry-questions] AI returned no valid questions with suggestions for ${industry}, using fallback`);
				return getFallbackQuestions(industry);
			}

			return questionsWithSuggestions;
		} catch (parseError) {
			console.error('Failed to parse industry questions:', parseError);
			console.error('Raw response:', text);

			// Fallback: return industry-specific questions
			console.log(`[industry-questions] Parse error for ${industry}, using fallback questions`);
			return getFallbackQuestions(industry);
		}
	} catch (error) {
		console.error('Error generating industry questions:', error);
		// Fallback: return industry-specific questions
		console.log(`[industry-questions] Error for ${industry}, using fallback questions`);
		return getFallbackQuestions(industry);
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
		? `\n\nEXISTING BRAND INFORMATION:\n- Brand Name: ${existingInfo.brandName || 'Not provided'}\n- Visual Style: ${existingInfo.style || 'Not provided'}\n- Target Audience: ${existingInfo.audience || 'Not provided'}`
		: '';

	const alreadyAskedInfo =
		alreadyAskedQuestionIds && alreadyAskedQuestionIds.length > 0
			? `\n\n⚠️ DO NOT ASK ABOUT THESE TOPICS (already covered):\n${alreadyAskedQuestionIds.map((id) => `- ${id}`).join('\n')}`
			: '';

	// Build grounding section with emphasis on using this data for suggestions
	let groundingSection = '';
	if (groundingData) {
		groundingSection = `
🔍 INDUSTRY RESEARCH DATA FOR "${industry.toUpperCase()}":

SUMMARY: ${groundingData.summary}

KEY INDUSTRY PATTERNS:
${groundingData.keyFindings.slice(0, 6).map((finding, idx) => `${idx + 1}. ${finding}`).join('\n')}

REAL BRAND EXAMPLES:
${groundingData.websites.slice(0, 4).map((site) => `• ${site.title}: ${site.extractedFacts.slice(0, 3).join('; ')}`).join('\n')}

⚠️ CRITICAL: Use the above research data to create RELEVANT suggestions. Extract actual categories, segments, models, and options that exist in the ${industry} industry based on this data.`;
	}

	return `You are a ${industry} industry expert creating follow-up questions for a brand builder tool.

TASK: Generate 2-3 industry-specific questions with SELECTABLE OPTIONS based on the research data below.

${groundingSection || `Industry: ${industry} (No research data available - use your knowledge of common ${industry} categories and segments)`}
${contextInfo}
${alreadyAskedInfo}

CRITICAL REQUIREMENTS:

1. **ALL QUESTIONS MUST HAVE SUGGESTIONS**
   - Every question MUST be type "text-with-suggestions"
   - Every question MUST have 4-8 relevant options in the "suggestions" array
   - Options must be specific to the ${industry} industry
   - Options should come from the research data above or common industry knowledge

2. **QUESTION TOPICS** - Choose from:
   - Business model / service type within ${industry}
   - Target customer segment specific to ${industry}
   - Product/service category or specialty
   - Price point / market positioning
   - Geographic or demographic focus
   - Distribution channel or sales model

3. **SUGGESTIONS QUALITY**
   - Based on REAL ${industry} categories from the research data
   - Specific and actionable (not generic like "Other" or "Various")
   - 4-8 options per question
   - Cover the main segments/categories in the industry

OUTPUT FORMAT - Return ONLY a valid JSON array:
[
  {
    "id": "uniqueId",
    "question": "Clear question text?",
    "type": "text-with-suggestions",
    "suggestions": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
    "required": false,
    "icon": "relevant-emoji",
    "helper": "Brief explanation of why this helps create better brand guidelines"
  }
]

EXAMPLES FOR REFERENCE:

For Retail industry:
[
  {
    "id": "retailType",
    "question": "What type of retail business are you?",
    "type": "text-with-suggestions",
    "suggestions": ["Fashion & Apparel", "Electronics & Tech", "Home & Furniture", "Grocery & Food", "Health & Beauty", "Sports & Outdoor", "Books & Media", "General Merchandise"],
    "required": false,
    "icon": "🏪",
    "helper": "This determines the visual style and customer experience approach for your brand"
  },
  {
    "id": "salesChannel",
    "question": "What is your primary sales channel?",
    "type": "text-with-suggestions",
    "suggestions": ["Physical Stores Only", "E-commerce Only", "Omnichannel (Both)", "Marketplace (Amazon, etc.)", "Direct-to-Consumer", "Wholesale/B2B"],
    "required": false,
    "icon": "🛒",
    "helper": "This shapes your brand touchpoints and visual consistency requirements"
  }
]

For Technology industry:
[
  {
    "id": "techSector",
    "question": "Which technology sector best describes your business?",
    "type": "text-with-suggestions",
    "suggestions": ["SaaS/Cloud Software", "Mobile Apps", "AI/Machine Learning", "Cybersecurity", "Fintech", "Healthtech", "E-commerce Platform", "Developer Tools"],
    "required": false,
    "icon": "💻",
    "helper": "Different tech sectors have distinct visual languages and user expectations"
  }
]

NOW GENERATE 2-3 QUESTIONS FOR: "${industry}"

Return ONLY the JSON array, no other text.`;
}

/**
 * Get basic essential questions - ONLY asks for missing information
 * If information was extracted from the prompt, it will NOT be asked again
 */
export function getEssentialQuestions(analysis: {
	brandName?: string;
	industry?: string;
	style?: string;
}): IndustryQuestion[] {
	const questions: IndustryQuestion[] = [];

	// Brand Name - ONLY if not provided
	const hasBrandName = analysis.brandName && analysis.brandName.trim().length > 0;
	if (!hasBrandName) {
		questions.push({
			id: 'brandName',
			question: 'What is your brand name?',
			type: 'text',
			required: true,
			icon: '🏢',
			helper: 'This is the official name of your brand or company'
		});
	}

	// Industry - ONLY if not provided
	const hasIndustry = analysis.industry && analysis.industry.trim().length > 0;
	if (!hasIndustry) {
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

	// Style/Vibe - ONLY if not provided
	// Limited to 4 options for mock webpage generation
	const hasStyle = analysis.style && analysis.style.trim().length > 0;
	if (!hasStyle) {
		const styleOptions = [
			'Minimalistic',
			'Maximalistic',
			'Funky',
			'Futuristic'
		];

		questions.push({
			id: 'style',
			question: "What's your brand's visual style/vibe?",
			type: 'text-with-suggestions',
			required: true,
			icon: '🎨',
			helper: 'Choose one of four styles that best represents your brand\'s aesthetic. This will be used to generate your mock webpage.',
			suggestions: styleOptions
		});
	}

	// NOTE: Logo question is NOT added here - it will be added at the END after all industry questions
	// This ensures we have all information (industry, vibe, audience, etc.) before generating the logo

	return questions;
}

