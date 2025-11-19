/**
 * Professional Icon Generator Service using Gemini API
 * Generates accurate, professional SVG icons for brand guidelines
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$lib/env';

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Initialize Gemini client
function initializeGemini() {
	// Get API key - check env object first, then process.env directly as fallback
	let apiKey = env?.GOOGLE_GEMINI_API || '';
	
	// If not found in env object, try process.env directly (prioritize Google_Gemini_Api)
	if (!apiKey || apiKey.trim() === '') {
		if (typeof process !== 'undefined' && process.env) {
			// Try Google_Gemini_Api first (user's variable name)
			apiKey = process.env.Google_Gemini_Api || 
			         process.env.GOOGLE_GEMINI_API || 
			         process.env.GOOGLE_AI_API_KEY || '';
			
			if (apiKey) {
				// Clean the value (remove quotes and trim)
				apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
			}
		}
	}
	
	if (!apiKey || apiKey.trim() === '') {
		console.warn('⚠️ Gemini API key not found - icon generation will use fallback');
		return false;
	}

	try {
		genAI = new GoogleGenerativeAI(apiKey);
		model = genAI.getGenerativeModel({ 
			model: 'gemini-2.0-flash',
			generationConfig: {
				temperature: 0.2, // Very low temperature for consistent, accurate professional icons
				topP: 0.85,
				topK: 35,
				maxOutputTokens: 2000
			}
		});
		return true;
	} catch (error) {
		console.error('❌ Failed to initialize Gemini for icon generation:', error);
		return false;
	}
}

// Initialize on module load
const geminiAvailable = initializeGemini();

// Cache for generated icons to avoid repeated API calls
const iconCache = new Map<string, { svg: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Generate a professional SVG icon using Gemini API
 */
export async function generateProfessionalIcon(
	iconName: string,
	size: number = 24,
	color: string = 'currentColor',
	strokeWidth: number = 2,
	style: 'minimal' | 'outline' | 'filled' = 'minimal'
): Promise<string> {
	// Check cache first
	const cacheKey = `${iconName}-${size}-${color}-${strokeWidth}-${style}`;
	const cached = iconCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.svg;
	}

	// If Gemini is not available, use fallback
	if (!geminiAvailable || !model) {
		return generateFallbackIcon(iconName, size, color, strokeWidth);
	}

	try {
		// Create professional icon generation prompt
		const prompt = createIconGenerationPrompt(iconName, size, color, strokeWidth, style);
		
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const generatedSvg = extractSVGFromResponse(response.text(), size);
		
		if (generatedSvg && isValidSVG(generatedSvg)) {
			// Cache the generated icon
			iconCache.set(cacheKey, {
				svg: generatedSvg,
				timestamp: Date.now()
			});
			return generatedSvg;
		} else {
			console.warn('⚠️ Invalid SVG generated, using fallback');
			return generateFallbackIcon(iconName, size, color, strokeWidth);
		}
	} catch (error) {
		console.error('❌ Error generating icon with Gemini:', error);
		return generateFallbackIcon(iconName, size, color, strokeWidth);
	}
}

/**
 * Create a professional prompt for Gemini to generate icons
 */
function createIconGenerationPrompt(
	iconName: string,
	size: number,
	color: string,
	strokeWidth: number,
	style: string
): string {
	return `You are a WORLD-CLASS professional icon designer creating enterprise-grade SVG icons for brand guidelines. Your icons MUST be accurate, minimal, and follow industry standards.

CRITICAL: Generate ONLY professional, accurate icons. NO placeholder icons, NO generic shapes, NO "shit" icons. The icon MUST precisely represent "${iconName}" using universal professional iconography.

ICON REQUEST:
- Icon Name: "${iconName}"
- Size: ${size}x${size}px
- ViewBox: 0 0 ${size} ${size}
- Color: ${color}
- Stroke Width: ${strokeWidth}px
- Style: ${style} (minimal professional line art)

PROFESSIONAL REQUIREMENTS:
1. ACCURACY: Icon MUST accurately represent "${iconName}" - use professional iconography standards
2. MINIMALISM: Clean, simple design with minimal strokes - suitable for brand guidelines
3. PROFESSIONAL: Follow Material Design, iOS HIG, and Lucide icon style (Feather family)
4. READABILITY: Icon must be instantly recognizable at ${size}x${size}px
5. CONSISTENCY: Match Lucide/Feather style (minimal line art, rounded caps/joins)

DESIGN SPECIFICATIONS:
- Stroke-based: fill="none" stroke="${color}"
- Stroke width: ${strokeWidth}px (exact)
- Stroke linecap: round
- Stroke linejoin: round
- Use geometric primitives: circles, rectangles, clean paths
- Center icon in viewBox with ${Math.round(size * 0.15)}px padding from edges
- Keep paths optimized and minimal
- NO gradients, shadows, filters, or complex effects
- NO embedded images or external references
- ALL paths must be within 0 0 ${size} ${size} viewBox bounds

PROFESSIONAL ICON EXAMPLES:
- Burger: 3 evenly spaced horizontal lines (bun-patty-bun)
- Pizza: Triangle slice with 2-3 small circles (toppings)
- Stop: Rounded square (modern stop button)
- Memory/RAM: Rectangle with 3-4 vertical bars inside
- Premium: Crown with 3-5 points or geometric star
- Settings: Gear with 6-8 teeth, centered circle
- Navigation: Arrow pointing right or compass rose
- Add: Plus sign (two perpendicular lines)
- Delete: Trash bin (rectangular bin with lid)
- Shopping Cart: Cart with wheels and handle
- User: Person silhouette (head and shoulders)

OUTPUT: Return ONLY the SVG element. NO markdown, NO XML declaration, NO explanations, NO comments.

REQUIRED FORMAT:
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="..." stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

Generate a professional, accurate, minimal SVG icon that precisely represents "${iconName}":`;
}

/**
 * Extract SVG from Gemini response
 */
function extractSVGFromResponse(responseText: string, size: number): string {
	// Remove markdown code blocks if present
	let svg = responseText
		.replace(/```svg\n?/g, '')
		.replace(/```\n?/g, '')
		.replace(/```xml\n?/g, '')
		.trim();

	// Extract SVG element if embedded in text
	const svgMatch = svg.match(/<svg[\s\S]*?<\/svg>/i);
	if (svgMatch) {
		svg = svgMatch[0];
	} else {
		// If no SVG found, return empty string
		return '';
	}

	// Ensure proper attributes
	// First, check if viewBox exists
	const hasViewBox = svg.includes('viewBox=');
	const hasWidth = svg.includes('width=');
	const hasHeight = svg.includes('height=');
	
	// If no viewBox, add it based on size
	if (!hasViewBox) {
		if (hasWidth) {
			const widthMatch = svg.match(/width\s*=\s*["'](\d+)["']/i);
			if (widthMatch) {
				const width = parseInt(widthMatch[1]);
				svg = svg.replace(/<svg([^>]*)>/i, `<svg$1 viewBox="0 0 ${width} ${width}">`);
			}
		} else {
			// Add viewBox, width, and height
			svg = svg.replace(
				/<svg([^>]*)>/i,
				`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"$1>`
			);
		}
	}
	
	// Ensure width and height are set
	if (!hasWidth || !hasHeight) {
		svg = svg.replace(/<svg([^>]*)>/i, (match, attrs) => {
			let newAttrs = attrs;
			if (!hasWidth) {
				newAttrs += ` width="${size}"`;
			}
			if (!hasHeight) {
				newAttrs += ` height="${size}"`;
			}
			return `<svg${newAttrs}>`;
		});
	}
	
	// Ensure fill="none" and xmlns are present for stroke-based icons
	if (!svg.includes('fill="none"') && !svg.includes("fill='none'")) {
		svg = svg.replace(/<svg([^>]*)>/i, (match, attrs) => {
			if (!attrs.includes('fill=')) {
				return `<svg fill="none"${attrs}>`;
			}
			return match;
		});
	}
	
	if (!svg.includes('xmlns=')) {
		svg = svg.replace(/<svg([^>]*)>/i, `<svg xmlns="http://www.w3.org/2000/svg"$1>`);
	}

	return svg.trim();
}

/**
 * Validate SVG
 */
function isValidSVG(svg: string): boolean {
	if (!svg || !svg.includes('<svg')) {
		return false;
	}

	// Basic validation
	try {
		// Check if it's well-formed XML
		if (!svg.match(/<svg[\s\S]*?<\/svg>/i)) {
			return false;
		}

		// Check for required attributes
		if (!svg.includes('viewBox') && !svg.includes('width') && !svg.includes('height')) {
			return false;
		}

		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Generate fallback icon (simple letter-based icon)
 */
function generateFallbackIcon(iconName: string, size: number, color: string, strokeWidth: number): string {
	const cleanName = iconName
		.replace(/^(icon|ico|img|image)-?/i, '')
		.replace(/-?(icon|ico|img|image)$/i, '')
		.trim();
	
	const words = cleanName.split(/[\s\-_]+/).filter(w => w.length > 0);
	let letters = '';
	if (words.length >= 2) {
		letters = (words[0][0] + words[1][0]).toUpperCase();
	} else if (cleanName.length >= 2) {
		letters = cleanName.substring(0, 2).toUpperCase();
	} else {
		letters = cleanName[0]?.toUpperCase() || '?';
	}
	
	const fontSize = size * 0.4;
	const center = size / 2;
	const radius = size * 0.38;
	
	return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="${center}" cy="${center}" r="${radius}" 
			stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>
		<text x="${center}" y="${center + fontSize * 0.3}" 
			font-family="system-ui, -apple-system, Arial, sans-serif" font-size="${fontSize}" 
			font-weight="600" fill="${color}" text-anchor="middle">${letters}</text>
	</svg>`;
}

/**
 * Clear icon cache
 */
export function clearIconCache(): void {
	iconCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
	return {
		size: iconCache.size,
		keys: Array.from(iconCache.keys())
	};
}

