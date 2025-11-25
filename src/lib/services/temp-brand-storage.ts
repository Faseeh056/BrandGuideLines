/**
 * Temporary Brand Storage Service
 * 
 * Manages temporary storage of brand data in sessionStorage for mock webpage generation.
 * Data is stored as JSON and includes user input, selected theme, brand data, and slides.
 */

import { browser } from '$app/environment';

export interface TempBrandData {
	userInput: Record<string, any>;
	selectedTheme: 'Minimalistic' | 'Maximalistic' | 'Funky' | 'Futuristic';
	brandData: any;
	slides: Array<{ name: string; html: string }>;
	timestamp: number;
	buildData?: {
		images: {
			hero: string | null;
			gallery: string[];
		};
		content: Record<string, any>;
		customizedHtml?: string;
	};
}

const STORAGE_KEY = 'temp_brand_data';
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Save brand data to sessionStorage
 */
export function saveTempBrandData(data: Omit<TempBrandData, 'timestamp'>): boolean {
	if (!browser) return false;

	try {
		const tempData: TempBrandData = {
			...data,
			timestamp: Date.now()
		};

		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tempData));
		return true;
	} catch (error) {
		console.error('Failed to save temp brand data:', error);
		return false;
	}
}

/**
 * Load brand data from sessionStorage
 */
export function loadTempBrandData(): TempBrandData | null {
	if (!browser) return null;

	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (!stored) return null;

		const data: TempBrandData = JSON.parse(stored);

		// Check if data has expired
		if (Date.now() - data.timestamp > EXPIRY_TIME) {
			clearTempBrandData();
			return null;
		}

		return data;
	} catch (error) {
		console.error('Failed to load temp brand data:', error);
		return null;
	}
}

/**
 * Update build data in stored brand data
 */
export function updateBuildData(buildData: TempBrandData['buildData']): boolean {
	if (!browser) return false;

	try {
		const existing = loadTempBrandData();
		if (!existing) return false;

		existing.buildData = buildData;
		return saveTempBrandData(existing);
	} catch (error) {
		console.error('Failed to update build data:', error);
		return false;
	}
}

/**
 * Clear temporary brand data
 */
export function clearTempBrandData(): void {
	if (!browser) return;
	sessionStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if temp brand data exists and is valid
 */
export function hasTempBrandData(): boolean {
	if (!browser) return false;
	return loadTempBrandData() !== null;
}

/**
 * Get selected theme from stored data
 */
export function getSelectedTheme(): TempBrandData['selectedTheme'] | null {
	const data = loadTempBrandData();
	return data?.selectedTheme || null;
}

/**
 * Merge additional data into existing temp brand data
 */
export function mergeTempBrandData(additionalData: Partial<TempBrandData>): boolean {
	if (!browser) return false;

	try {
		const existing = loadTempBrandData();
		if (!existing) {
			// If no existing data, create new entry
			const newData: Omit<TempBrandData, 'timestamp'> = {
				userInput: additionalData.userInput || {},
				selectedTheme: additionalData.selectedTheme || 'Minimalistic',
				brandData: additionalData.brandData || {},
				slides: additionalData.slides || [],
				buildData: additionalData.buildData
			};
			return saveTempBrandData(newData);
		}

		// Merge with existing data
		const merged: Omit<TempBrandData, 'timestamp'> = {
			userInput: { ...existing.userInput, ...(additionalData.userInput || {}) },
			selectedTheme: additionalData.selectedTheme || existing.selectedTheme,
			brandData: { ...existing.brandData, ...(additionalData.brandData || {}) },
			slides: additionalData.slides || existing.slides,
			buildData: { ...existing.buildData, ...(additionalData.buildData || {}) }
		};

		return saveTempBrandData(merged);
	} catch (error) {
		console.error('Failed to merge temp brand data:', error);
		return false;
	}
}

