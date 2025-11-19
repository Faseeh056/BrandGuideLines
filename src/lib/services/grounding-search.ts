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
 * Scrape multiple websites and extract relevant facts
 */
export async function scrapeIndustryWebsites(
	websites: IndustryWebsite[],
	industry: string
): Promise<ScrapedIndustryData> {
	const scrapedResults = [];
	const errors: string[] = [];
	
	console.log(`🔍 Starting to scrape ${websites.length} websites for ${industry} industry...`);
	
	for (const website of websites) {
		try {
			console.log(`📡 Scraping ${website.url}...`);
			
			// Scrape the website
			const scrapedData = await webScraper.scrapeWebpage(website.url);
			
			// Extract relevant facts using Gemini
			const extractedFacts = await extractRelevantFacts(scrapedData, industry, website.title);
			
			scrapedResults.push({
				url: website.url,
				title: website.title || scrapedData.title || website.url,
				scrapedData: {
					colors: scrapedData.colors?.palette || (Array.isArray(scrapedData.colors) ? scrapedData.colors : []),
					typography: scrapedData.typography || {},
					fonts: (scrapedData as any).fonts || [],
					elements: (scrapedData as any).elements?.slice(0, 50) || [], // Limit elements
					logo: (scrapedData as any).logo || null,
					title: scrapedData.title || website.title
				},
				extractedFacts
			});
			
			console.log(`✅ Successfully scraped ${website.url} - extracted ${extractedFacts.length} facts`);
			
			// Add delay between scrapes to be respectful
			await new Promise(resolve => setTimeout(resolve, 2000));
		} catch (error) {
			console.error(`❌ Failed to scrape ${website.url}:`, error);
			errors.push(`${website.url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
	
	// Generate summary of findings
	const summary = await generateIndustrySummary(scrapedResults, industry);
	const keyFindings = extractKeyFindings(scrapedResults);
	
	return {
		websites: scrapedResults,
		summary,
		keyFindings
	};
}

/**
 * Extract relevant facts from scraped website data using Gemini
 */
async function extractRelevantFacts(
	scrapedData: any,
	industry: string,
	websiteTitle: string
): Promise<string[]> {
	try {
		const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });
		
		const prompt = `You are analyzing a website (${websiteTitle}) in the "${industry}" industry to extract relevant brand guideline facts.

Here's what was scraped from the website:
- Colors: ${JSON.stringify(scrapedData.colors?.palette || scrapedData.colors || [])}
- Typography: ${JSON.stringify(scrapedData.typography || {})}
- Fonts: ${JSON.stringify(scrapedData.fonts || [])}
- Logo info: ${JSON.stringify(scrapedData.logo || {})}
- Key elements: ${JSON.stringify((scrapedData.elements || []).slice(0, 20))}

Extract 5-10 specific, actionable facts about brand guidelines for the ${industry} industry based on this website. Focus on:
1. Color usage patterns and palettes
2. Typography choices and font combinations
3. Design patterns and visual elements
4. Brand identity elements
5. Industry-specific design conventions

Format each fact as a concise sentence. Return ONLY a JSON array of strings:
["Fact 1", "Fact 2", "Fact 3", ...]

IMPORTANT: Only return valid JSON array. No markdown, no code blocks, just the JSON array.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		
		// Extract JSON array
		const jsonMatch = text.match(/\[[\s\S]*\]/);
		if (!jsonMatch) {
			return [];
		}
		
		const facts: string[] = JSON.parse(jsonMatch[0]);
		return facts.filter(fact => fact && fact.trim().length > 0);
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
	
	// Return top 10 most common/important facts
	return Array.from(factCounts.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
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

/**
 * Main function: Perform grounding search for an industry
 */
export async function performGroundingSearch(industry: string): Promise<ScrapedIndustryData> {
	console.log(`🔍 Starting grounding search for industry: ${industry}`);
	
	// Step 1: Find relevant websites
	const websites = await findIndustryWebsites(industry, 5);
	console.log(`✅ Found ${websites.length} relevant websites`);
	
	// Step 2: Scrape websites and extract facts
	const scrapedData = await scrapeIndustryWebsites(websites, industry);
	console.log(`✅ Completed grounding search - ${scrapedData.websites.length} websites analyzed`);
	
	return scrapedData;
}

