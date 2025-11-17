/**
 * AI Icon Generator Utility
 * Generates minimal SVG icons for icons not available in Lucide
 */

/**
 * Generate a minimal SVG icon based on the icon name
 * Uses AI-like pattern matching to create appropriate icons
 */
export function generateIconSVG(iconName: string, size: number = 24, color: string = 'currentColor', strokeWidth: number = 2): string {
	const name = iconName.toLowerCase().trim();
	
	// Remove common prefixes/suffixes
	const cleanName = name
		.replace(/^(icon|ico|img|image)-?/i, '')
		.replace(/-?(icon|ico|img|image)$/i, '')
		.trim();
	
	// Pattern matching for common icon types
	if (cleanName.includes('burger') || cleanName.includes('hamburger')) {
		return generateBurgerIcon(size, color, strokeWidth);
	}
	
	if (cleanName.includes('pizza')) {
		return generatePizzaIcon(size, color, strokeWidth);
	}
	
	if (cleanName.includes('stop') && !cleanName.includes('play')) {
		return generateStopIcon(size, color, strokeWidth);
	}
	
	if (cleanName.includes('memory') || cleanName.includes('ram')) {
		return generateMemoryIcon(size, color, strokeWidth);
	}
	
	if (cleanName.includes('premium') || cleanName.includes('vip')) {
		return generatePremiumIcon(size, color, strokeWidth);
	}
	
	if (cleanName.includes('favorite') || cleanName.includes('favourite')) {
		return generateFavoriteIcon(size, color, strokeWidth);
	}
	
	// Default: Generate a geometric shape based on first letter
	return generateLetterIcon(iconName, size, color, strokeWidth);
}

/**
 * Generate a burger/hamburger icon
 */
function generateBurgerIcon(size: number, color: string, strokeWidth: number): string {
	const center = size / 2;
	const top = size * 0.3;
	const middle = size * 0.5;
	const bottom = size * 0.7;
	const width = size * 0.7;
	const left = (size - width) / 2;
	const right = left + width;
	
	return `
		<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
			<line x1="${left}" y1="${top}" x2="${right}" y2="${top}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
			<circle cx="${center}" cy="${middle}" r="${size * 0.08}" fill="${color}"/>
			<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
		</svg>
	`.trim();
}

/**
 * Generate a pizza icon
 */
function generatePizzaIcon(size: number, color: string, strokeWidth: number): string {
	const center = size / 2;
	const radius = size * 0.4;
	
	return `
		<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center + radius * 0.7} ${center + radius * 0.3} Z" 
				fill="${color}" opacity="0.2" stroke="${color}" stroke-width="${strokeWidth}"/>
			<circle cx="${center + radius * 0.3}" cy="${center - radius * 0.2}" r="${size * 0.06}" fill="${color}"/>
			<circle cx="${center + radius * 0.5}" cy="${center + radius * 0.2}" r="${size * 0.06}" fill="${color}"/>
		</svg>
	`.trim();
}

/**
 * Generate a stop icon (square)
 */
function generateStopIcon(size: number, color: string, strokeWidth: number): string {
	const padding = size * 0.25;
	
	return `
		<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="${padding}" y="${padding}" width="${size - padding * 2}" height="${size - padding * 2}" 
				fill="${color}" stroke="${color}" stroke-width="${strokeWidth}"/>
		</svg>
	`.trim();
}

/**
 * Generate a memory/RAM icon
 */
function generateMemoryIcon(size: number, color: string, strokeWidth: number): string {
	const width = size * 0.6;
	const height = size * 0.8;
	const left = (size - width) / 2;
	const top = (size - height) / 2;
	const barWidth = width * 0.15;
	const barGap = width * 0.1;
	
	return `
		<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="${left}" y="${top}" width="${width}" height="${height}" 
				stroke="${color}" stroke-width="${strokeWidth}" fill="none" rx="${size * 0.05}"/>
			<rect x="${left + barGap}" y="${top + barGap}" width="${barWidth}" height="${height - barGap * 2}" fill="${color}"/>
			<rect x="${left + barGap * 2 + barWidth}" y="${top + barGap}" width="${barWidth}" height="${height - barGap * 2}" fill="${color}"/>
			<rect x="${left + barGap * 3 + barWidth * 2}" y="${top + barGap}" width="${barWidth}" height="${height - barGap * 2}" fill="${color}"/>
		</svg>
	`.trim();
}

/**
 * Generate a premium/VIP icon (crown or star)
 */
function generatePremiumIcon(size: number, color: string, strokeWidth: number): string {
	const center = size / 2;
	const radius = size * 0.35;
	
	return `
		<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M ${center} ${center - radius} L ${center - radius * 0.6} ${center + radius * 0.2} L ${center - radius * 0.3} ${center - radius * 0.2} L ${center} ${center + radius * 0.3} L ${center + radius * 0.3} ${center - radius * 0.2} L ${center + radius * 0.6} ${center + radius * 0.2} Z" 
				fill="${color}" stroke="${color}" stroke-width="${strokeWidth * 0.5}"/>
		</svg>
	`.trim();
}

/**
 * Generate a favorite icon (heart)
 */
function generateFavoriteIcon(size: number, color: string, strokeWidth: number): string {
	const center = size / 2;
	const radius = size * 0.3;
	
	return `
		<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M ${center} ${center + radius * 0.2} C ${center} ${center - radius * 0.3}, ${center - radius * 0.6} ${center - radius * 0.6}, ${center - radius * 0.6} ${center} C ${center - radius * 0.6} ${center + radius * 0.4}, ${center} ${center + radius * 0.8}, ${center} ${center + radius * 0.8} C ${center} ${center + radius * 0.8}, ${center + radius * 0.6} ${center + radius * 0.4}, ${center + radius * 0.6} ${center} C ${center + radius * 0.6} ${center - radius * 0.6}, ${center} ${center - radius * 0.3}, ${center} ${center + radius * 0.2} Z" 
				fill="${color}" stroke="${color}" stroke-width="${strokeWidth * 0.5}"/>
		</svg>
	`.trim();
}

/**
 * Generate a letter-based icon as fallback
 */
function generateLetterIcon(iconName: string, size: number, color: string, strokeWidth: number): string {
	// Get first letter or first two letters
	// Clean the name first
	const cleanName = iconName
		.replace(/^(icon|ico|img|image)-?/i, '')
		.replace(/-?(icon|ico|img|image)$/i, '')
		.trim();
	
	// Extract first meaningful letter(s)
	const words = cleanName.split(/[\s\-_]+/).filter(w => w.length > 0);
	let letters = '';
	if (words.length >= 2) {
		// Use first letter of first two words
		letters = (words[0][0] + words[1][0]).toUpperCase();
	} else if (cleanName.length >= 2) {
		// Use first two letters
		letters = cleanName.substring(0, 2).toUpperCase();
	} else {
		// Use first letter
		letters = cleanName[0]?.toUpperCase() || '?';
	}
	
	const fontSize = size * 0.4;
	const center = size / 2;
	const radius = size * 0.38;
	
	return `
		<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="${center}" cy="${center}" r="${radius}" 
				stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>
			<text x="${center}" y="${center + fontSize * 0.3}" 
				font-family="system-ui, -apple-system, Arial, sans-serif" font-size="${fontSize}" 
				font-weight="600" fill="${color}" text-anchor="middle">${letters}</text>
		</svg>
	`.trim();
}

/**
 * Generate icon based on category/type
 */
export function generateIconByCategory(category: string, name: string, size: number = 24, color: string = 'currentColor', strokeWidth: number = 2): string {
	const cat = category.toLowerCase();
	const iconName = name.toLowerCase();
	
	// Food category
	if (cat.includes('food') || cat.includes('restaurant')) {
		if (iconName.includes('burger')) return generateBurgerIcon(size, color, strokeWidth);
		if (iconName.includes('pizza')) return generatePizzaIcon(size, color, strokeWidth);
		return generateLetterIcon(name, size, color, strokeWidth);
	}
	
	// Media category
	if (cat.includes('media') || cat.includes('video') || cat.includes('audio')) {
		if (iconName.includes('stop')) return generateStopIcon(size, color, strokeWidth);
		return generateLetterIcon(name, size, color, strokeWidth);
	}
	
	// Technology category
	if (cat.includes('tech') || cat.includes('computer') || cat.includes('hardware')) {
		if (iconName.includes('memory') || iconName.includes('ram')) {
			return generateMemoryIcon(size, color, strokeWidth);
		}
		return generateLetterIcon(name, size, color, strokeWidth);
	}
	
	// Premium/VIP category
	if (cat.includes('premium') || cat.includes('vip') || cat.includes('pro')) {
		return generatePremiumIcon(size, color, strokeWidth);
	}
	
	// Favorite category
	if (cat.includes('favorite') || cat.includes('favourite') || cat.includes('like')) {
		return generateFavoriteIcon(size, color, strokeWidth);
	}
	
	// Default: letter icon
	return generateLetterIcon(name, size, color, strokeWidth);
}

