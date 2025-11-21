// Define the COMMON generation steps (always shown for all brands)
export const COMMON_GENERATION_STEPS = [
	'brand-positioning',
	'logo-guidelines',
	'color-palette',
	'typography',
	'iconography'
] as const;

// Legacy: Keep GENERATION_STEPS for backward compatibility, but it should use dynamic steps
export const GENERATION_STEPS = [...COMMON_GENERATION_STEPS] as const;

export type GenerationStep = (typeof COMMON_GENERATION_STEPS)[number] | string;

export interface ProgressiveGenerationRequest {
	step: GenerationStep;
	previousSteps?: any;
	userApproval?: boolean;
	feedback?: string;
}

/**
 * Generate industry-specific steps based on industry using Gemini API
 * Returns array of step IDs that should be included after the common 5 steps
 * This function works on both client and server:
 * - On server: calls Gemini service directly (if fetchFn provided, uses it for API call)
 * - On client: calls API endpoint via fetch
 */
export async function getIndustrySpecificSteps(
	industry: string,
	industrySpecificInfo?: Record<string, any>,
	fetchFn?: typeof fetch,
	groundingData?: {
		summary: string;
		keyFindings: string[];
		websites: Array<{ url: string; title: string; extractedFacts: string[] }>;
	}
): Promise<string[]> {
	// Normalize industry name
	const normalizedIndustry = industry?.trim() || '';
	
	if (!normalizedIndustry) {
		// If no industry specified, return empty array (only show common 5 steps)
		return [];
	}

	// Check if we're on server-side and can use Gemini directly
	// In SvelteKit, server-side code runs in Node.js where process is available
	// Client-side code runs in browser where process is not available
	const isServerSide = typeof process !== 'undefined' && typeof process.env !== 'undefined';
	
	if (isServerSide && !fetchFn) {
		// On server without fetchFn: use Gemini service directly (most efficient)
		try {
			const { generateIndustrySpecificSteps } = await import('$lib/services/industry-steps-generator');
			const steps = await generateIndustrySpecificSteps(normalizedIndustry, industrySpecificInfo, groundingData);
			console.log(`[progressive-generation] ✓ Generated ${steps.length} industry-specific steps for "${normalizedIndustry}" (server-side direct):`, steps);
			return steps;
		} catch (error) {
			console.warn(`[progressive-generation] Failed to use Gemini directly, will try API with fetchFn:`, error);
			// Fall through to API call (will use fetchFn if provided)
		}
	}

	// Call API endpoint (works on both client and server with proper fetch)
	try {
		console.log(`[progressive-generation] Calling API to generate steps for industry: "${normalizedIndustry}"`, {
			industrySpecificInfo: industrySpecificInfo || {},
			usingFetchFn: !!fetchFn
		});

		// Use provided fetch function (event.fetch on server) or global fetch (client)
		const fetchToUse = fetchFn || (typeof fetch !== 'undefined' ? fetch : null);
		
		if (!fetchToUse) {
			throw new Error('No fetch function available');
		}

		const response = await fetchToUse('/api/brand-builder/industry-steps', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				industry: normalizedIndustry,
				industrySpecificInfo: industrySpecificInfo || {},
				groundingData: groundingData || undefined
			})
		});

		console.log(`[progressive-generation] API response status: ${response.status}`);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
			console.error(`[progressive-generation] API error:`, errorData);
			throw new Error(errorData.error || `HTTP ${response.status}`);
		}

		const result = await response.json();
		console.log(`[progressive-generation] API result:`, result);
		
		if (result.success && Array.isArray(result.steps)) {
			console.log(`[progressive-generation] ✓ Generated ${result.steps.length} industry-specific steps for "${normalizedIndustry}":`, result.steps);
			return result.steps;
		} else {
			console.warn(`[progressive-generation] ⚠ Invalid response format from API:`, result);
			return [];
		}
	} catch (error) {
		console.error(`[progressive-generation] ✗ Error generating industry steps for "${normalizedIndustry}":`, error);
		// Return empty array on error - will only show common 5 steps
		return [];
	}
}

/**
 * Get all steps (common + industry-specific) for a given industry
 */
export async function getAllStepsForIndustry(
	industry: string,
	industrySpecificInfo?: Record<string, any>,
	fetchFn?: typeof fetch,
	groundingData?: {
		summary: string;
		keyFindings: string[];
		websites: Array<{ url: string; title: string; extractedFacts: string[] }>;
	}
): Promise<string[]> {
	const commonSteps = [...COMMON_GENERATION_STEPS];
	const industrySteps = await getIndustrySpecificSteps(industry, industrySpecificInfo, fetchFn, groundingData);
	return [...commonSteps, ...industrySteps];
}

/**
 * Get next step dynamically based on industry
 */
export async function getNextStep(
	currentStep: string,
	industry?: string,
	industrySpecificInfo?: Record<string, any>,
	fetchFn?: typeof fetch
): Promise<string | null> {
	if (!industry) {
		// Fallback to common steps only
		const currentIndex = COMMON_GENERATION_STEPS.indexOf(currentStep as any);
		if (currentIndex === -1 || currentIndex === COMMON_GENERATION_STEPS.length - 1) {
			return null;
		}
		return COMMON_GENERATION_STEPS[currentIndex + 1];
	}

	const allSteps = await getAllStepsForIndustry(industry, industrySpecificInfo, fetchFn);
	const currentIndex = allSteps.indexOf(currentStep);
	if (currentIndex === -1 || currentIndex === allSteps.length - 1) {
		return null;
	}
	return allSteps[currentIndex + 1];
}

/**
 * Get progress percentage based on all steps (common + industry-specific)
 */
export async function getProgress(
	currentStep: string,
	industry?: string,
	industrySpecificInfo?: Record<string, any>,
	fetchFn?: typeof fetch
): Promise<number> {
	if (!industry) {
		// Fallback to common steps only
		const currentIndex = COMMON_GENERATION_STEPS.indexOf(currentStep as any);
		if (currentIndex === -1) return 0;
		return Math.round(((currentIndex + 1) / COMMON_GENERATION_STEPS.length) * 100);
	}

	const allSteps = await getAllStepsForIndustry(industry, industrySpecificInfo, fetchFn);
	const currentIndex = allSteps.indexOf(currentStep);
	if (currentIndex === -1) return 0;
	return Math.round(((currentIndex + 1) / allSteps.length) * 100);
}
