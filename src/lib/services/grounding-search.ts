import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$lib/env';
import { webScraper } from './web-scraping/webScraper.js';

// Initialize Gemini AI (lazy initialization)
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
	if (!genAI) {
		let apiKey = env?.GOOGLE_GEMINI_API || '';
		
		if (!apiKey || apiKey.trim() === '') {
			if (typeof process !== 'undefined' && process.env) {
				apiKey = process.env.Google_Gemini_Api || 
				         process.env.GOOGLE_GEMINI_API || 
				         process.env.GOOGLE_AI_API_KEY || '';
				
				if (apiKey) {
					apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
				}
			}
		}
		
		if (!apiKey || apiKey.trim() === '') {
			throw new Error('GOOGLE_GEMINI_API is not configured. Please check your .env file.');
		}
		genAI = new GoogleGenerativeAI(apiKey);
	}
	return genAI;
}

export interface IndustryWebsite {
	url: string;
	title: string;
	description: string;
	relevance: string;
}

export interface ScrapedIndustryData {
	websites: Array<{
		url: string;
		title: string;
		scrapedData: any;
		extractedFacts: string[];
	}>;
	summary: string;
	keyFindings: string[];
}

/**
 * Find industry-relevant websites using Gemini
 */
export async function findIndustryWebsites(industry: string, limit: number = 5): Promise<IndustryWebsite[]> {
	try {
		const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });
		
		const prompt = `You are a research assistant. Find ${limit} well-known, reputable websites in the "${industry}" industry that would be good examples for brand guidelines.

For each website, provide:
- The exact URL (must be a real, accessible website)
- The company/brand name
- A brief description of why this website is relevant for ${industry} brand guidelines
- What makes it a good example (design, branding, industry standards)

Focus on:
1. Industry leaders and well-known brands
2. Websites with strong brand identity
3. Companies that represent best practices in ${industry}
4. Mix of different company sizes/types if applicable

Return ONLY a JSON array in this exact format:
[
  {
    "url": "https://example.com",
    "title": "Company Name",
    "description": "Why this is relevant",
    "relevance": "What makes it a good example"
  }
]

IMPORTANT: Only return valid JSON. No markdown, no code blocks, just the JSON array.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		
		// Extract JSON from response
		const jsonMatch = text.match(/\[[\s\S]*\]/);
		if (!jsonMatch) {
			throw new Error('No valid JSON found in AI response');
		}
		
		const websites: IndustryWebsite[] = JSON.parse(jsonMatch[0]);
		
		// Validate URLs
		const validWebsites = websites.filter(website => {
			try {
				new URL(website.url);
				return true;
			} catch {
				return false;
			}
		});
		
		return validWebsites.slice(0, limit);
	} catch (error) {
		console.error('Error finding industry websites:', error);
		// Return fallback websites based on industry
		return getFallbackWebsites(industry, limit);
	}
}

/**
 * Scrape multiple websites and extract relevant facts (PARALLELIZED for speed)
 */
export async function scrapeIndustryWebsites(
	websites: IndustryWebsite[],
	industry: string
): Promise<ScrapedIndustryData> {
	console.log(`🔍 Starting parallel scraping of ${websites.length} websites for ${industry} industry...`);
	
	// Scrape all websites in parallel for maximum speed
	const scrapePromises = websites.map(async (website) => {
		try {
			console.log(`📡 Scraping ${website.url}...`);
			
			// Scrape the website
			const scrapedData = await webScraper.scrapeWebpage(website.url);
			
			// Extract relevant facts using Gemini (also in parallel)
			const extractedFacts = await extractRelevantFacts(scrapedData, industry, website.title);
			
			return {
				url: website.url,
				title: website.title || scrapedData.title || website.url,
				scrapedData: {
					colors: scrapedData.colors?.palette || (Array.isArray(scrapedData.colors) ? scrapedData.colors : []),
					typography: scrapedData.typography || {},
					fonts: (scrapedData as any).fonts || [],
					elements: (scrapedData as any).elements?.slice(0, 30) || [], // Reduced limit for speed
					logo: (scrapedData as any).logo || null,
					title: scrapedData.title || website.title
				},
				extractedFacts
			};
		} catch (error) {
			console.error(`❌ Failed to scrape ${website.url}:`, error);
			return null;
		}
	});
	
	// Wait for all scrapes to complete in parallel
	const results = await Promise.all(scrapePromises);
	const scrapedResults = results.filter((r): r is NonNullable<typeof r> => r !== null);
	
	console.log(`✅ Completed parallel scraping - ${scrapedResults.length}/${websites.length} websites successfully scraped`);
	
	// Generate summary and key findings in parallel
	const [summary, keyFindings] = await Promise.all([
		generateIndustrySummary(scrapedResults, industry),
		Promise.resolve(extractKeyFindings(scrapedResults))
	]);
	
	return {
		websites: scrapedResults,
		summary,
		keyFindings
	};
}

/**
 * Extract relevant facts from scraped website data using Gemini (OPTIMIZED for speed)
 */
async function extractRelevantFacts(
	scrapedData: any,
	industry: string,
	websiteTitle: string
): Promise<string[]> {
	try {
		const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });
		
		// Optimize: Limit data sent to AI for faster processing while maintaining accuracy
		const colors = (scrapedData.colors?.palette || scrapedData.colors || []).slice(0, 8);
		const fonts = (scrapedData.fonts || []).slice(0, 5);
		const elements = (scrapedData.elements || []).slice(0, 15);
		
		const prompt = `Analyze this ${industry} website (${websiteTitle}) and extract 6-8 key brand guideline facts. Focus on actionable, specific patterns that can inform brand guideline creation.

Data:
- Colors: ${JSON.stringify(colors)}
- Typography: ${JSON.stringify(scrapedData.typography || {})}
- Fonts: ${JSON.stringify(fonts)}
- Elements: ${JSON.stringify(elements)}

Extract concise facts about color patterns, typography, design conventions. Return ONLY a JSON array:
["Fact 1", "Fact 2", ...]`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		
		// Extract JSON array
		const jsonMatch = text.match(/\[[\s\S]*\]/);
		if (!jsonMatch) {
			return [];
		}
		
		const facts: string[] = JSON.parse(jsonMatch[0]);
		return facts.filter(fact => fact && fact.trim().length > 0).slice(0, 8); // Limit to 8 facts per website for better accuracy
	} catch (error) {
		console.error('Error extracting facts:', error);
		return [];
	}
}

/**
 * Generate a summary of industry findings
 */
async function generateIndustrySummary(
	scrapedResults: Array<{ url: string; title: string; extractedFacts: string[] }>,
	industry: string
): Promise<string> {
	try {
		const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });
		
		const allFacts = scrapedResults.flatMap(result => result.extractedFacts);
		const websitesList = scrapedResults.map(r => r.title).join(', ');
		
		const prompt = `Based on analysis of ${scrapedResults.length} websites (${websitesList}) in the "${industry}" industry, create a comprehensive summary of brand guideline patterns and best practices.

Key findings from websites:
${allFacts.map((fact, i) => `${i + 1}. ${fact}`).join('\n')}

Create a 3-4 paragraph summary that:
1. Identifies common patterns across these ${industry} websites
2. Highlights industry-specific design conventions
3. Notes color and typography trends
4. Provides actionable insights for creating ${industry} brand guidelines

Return only the summary text, no markdown formatting.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		return response.text().trim();
	} catch (error) {
		console.error('Error generating summary:', error);
		return `Analysis of ${scrapedResults.length} websites in the ${industry} industry revealed common patterns in color usage, typography, and design elements.`;
	}
}

/**
 * Extract key findings from scraped data
 */
function extractKeyFindings(
	scrapedResults: Array<{ extractedFacts: string[] }>
): string[] {
	const allFacts = scrapedResults.flatMap(result => result.extractedFacts);
	
	// Group similar facts and pick most common ones
	const factCounts = new Map<string, number>();
	allFacts.forEach(fact => {
		const normalized = fact.toLowerCase().trim();
		factCounts.set(normalized, (factCounts.get(normalized) || 0) + 1);
	});
	
	// Return top 12 most common/important facts (increased for 5 websites to maintain accuracy)
	return Array.from(factCounts.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 12)
		.map(([fact]) => fact);
}

/**
 * Get fallback websites if AI search fails
 */
function getFallbackWebsites(industry: string, limit: number): IndustryWebsite[] {
	const fallbackMap: Record<string, IndustryWebsite[]> = {
		'SaaS': [
			{ url: 'https://www.salesforce.com', title: 'Salesforce', description: 'Leading SaaS platform', relevance: 'Strong brand identity' },
			{ url: 'https://www.slack.com', title: 'Slack', description: 'Communication platform', relevance: 'Modern design' },
			{ url: 'https://www.atlassian.com', title: 'Atlassian', description: 'Developer tools', relevance: 'Professional branding' }
		],
		'Fintech': [
			{ url: 'https://www.stripe.com', title: 'Stripe', description: 'Payment processing', relevance: 'Clean design' },
			{ url: 'https://www.paypal.com', title: 'PayPal', description: 'Digital payments', relevance: 'Trustworthy branding' }
		],
		'Healthcare': [
			{ url: 'https://www.mayo.edu', title: 'Mayo Clinic', description: 'Medical institution', relevance: 'Professional healthcare branding' }
		],
		'Ecommerce': [
			{ url: 'https://www.shopify.com', title: 'Shopify', description: 'E-commerce platform', relevance: 'Modern e-commerce design' }
		]
	};
	
	const fallbacks = fallbackMap[industry] || [
		{ url: 'https://www.google.com', title: 'Google', description: 'Technology company', relevance: 'Strong brand guidelines' }
	];
	
	return fallbacks.slice(0, limit);
}

// Cache for grounding search results (in-memory, per industry)
const groundingCache = new Map<string, { data: ScrapedIndustryData; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

/**
 * Main function: Perform grounding search for an industry (OPTIMIZED with caching and reduced websites)
 */
export async function performGroundingSearch(industry: string): Promise<ScrapedIndustryData> {
	const normalizedIndustry = industry.toLowerCase().trim();
	
	// Check cache first
	const cached = groundingCache.get(normalizedIndustry);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		console.log(`✅ Using cached grounding data for ${industry}`);
		return cached.data;
	}
	
	console.log(`🔍 Starting optimized grounding search for industry: ${industry}`);
	
	// Step 1: Find relevant websites (5 websites for comprehensive and accurate data)
	const websites = await findIndustryWebsites(industry, 5);
	console.log(`✅ Found ${websites.length} relevant websites`);
	
	// Step 2: Scrape websites and extract facts (now parallelized)
	const scrapedData = await scrapeIndustryWebsites(websites, industry);
	console.log(`✅ Completed grounding search - ${scrapedData.websites.length} websites analyzed`);
	
	// Cache the result
	groundingCache.set(normalizedIndustry, {
		data: scrapedData,
		timestamp: Date.now()
	});
	
	return scrapedData;
}

