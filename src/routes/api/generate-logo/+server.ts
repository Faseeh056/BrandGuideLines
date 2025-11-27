import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$lib/env';
import { saveLogoAsset } from '$lib/server/logo-storage';

/**
 * API endpoint for generating professional logos using Gemini 2.0 Flash Image model
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const {
			brandName,
			industry,
			style,
			description,
			values,
			logoStyle,
			logoColors,
			logoSymbols,
			logoTagline,
			logoUsage,
			audience
		} = body;

		if (!brandName) {
			return json({ error: 'Brand name is required' }, { status: 400 });
		}

		// Get API key
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
			return json({ error: 'Google Gemini API key is not configured' }, { status: 500 });
		}

		// Initialize Gemini
		const genAI = new GoogleGenerativeAI(apiKey);
		
		// Use gemini-2.0-flash for generating SVG logo code
		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash'
		});

		// Build comprehensive prompt for logo generation
		let brandContext = `Brand: "${brandName}"`;
		
		if (industry) {
			brandContext += `\nIndustry: ${industry}`;
		}
		
		if (description) {
			brandContext += `\nDescription: ${description}`;
		}
		
		if (style) {
			brandContext += `\nStyle: ${style}`;
		}
		
		if (values) {
			brandContext += `\nBrand Values: ${values}`;
		}
		
		if (audience) {
			brandContext += `\nTarget Audience: ${audience}`;
		}

		// Check if user provided enhancement feedback
		const enhancementPrompt = body.enhancementPrompt || body.feedback || '';

		// Build sophisticated style direction based on brand style
		const getStyleDirection = (brandStyle: string): string => {
			const s = brandStyle?.toLowerCase() || '';
			if (s.includes('minimalistic') || s.includes('minimal')) {
				return `MINIMALIST AESTHETIC:
- Maximum 2 colors (one primary brand color + one neutral)
- Clean geometric shapes with mathematical precision
- Extensive negative space - let the logo breathe
- Ultra-thin or medium-weight sans-serif typography
- No gradients, no shadows, no textures
- Think: Apple, Muji, Braun - sophisticated simplicity
- The mark should be reducible to a single memorable shape`;
			}
			if (s.includes('maximalistic') || s.includes('bold') || s.includes('vibrant')) {
				return `MAXIMALIST/BOLD AESTHETIC:
- 3-4 vibrant, high-saturation colors with strong contrast
- Dynamic, energetic shapes with visual weight
- Layered elements creating depth and interest
- Bold, impactful typography with character
- Gradients encouraged for modern depth
- Think: Spotify, Discord, Slack - bold and memorable
- Make a strong visual statement that commands attention`;
			}
			if (s.includes('funky') || s.includes('playful') || s.includes('creative')) {
				return `FUNKY/PLAYFUL AESTHETIC:
- Unexpected color combinations - break conventional rules
- Organic, hand-drawn feel or quirky geometric shapes
- Asymmetry and visual surprise elements
- Rounded, friendly typography with personality
- Motion implied through shape arrangement
- Think: Mailchimp, Dropbox, Headspace - friendly and fun
- Inject personality and warmth into every element`;
			}
			if (s.includes('futuristic') || s.includes('tech') || s.includes('modern')) {
				return `FUTURISTIC/TECH AESTHETIC:
- Neon accents: electric blue, cyan, magenta, purple
- Geometric precision with tech-inspired shapes
- Angular elements suggesting innovation
- Clean sans-serif or custom tech typography
- Subtle gradients suggesting light and energy
- Think: Tesla, SpaceX, Stripe - cutting-edge innovation
- Convey forward-thinking technology and progress`;
			}
			if (s.includes('elegant') || s.includes('luxury') || s.includes('premium')) {
				return `ELEGANT/LUXURY AESTHETIC:
- Refined palette: deep navy, burgundy, forest green + gold/champagne accents
- Sophisticated serif or elegant sans-serif typography
- Refined details and perfect proportions
- Subtle use of metallic tones (gold gradient: #D4AF37 to #F4E4BC)
- Generous spacing and balanced composition
- Think: Chanel, Rolex, Mercedes - timeless sophistication
- Every element should feel considered and premium`;
			}
			if (s.includes('professional') || s.includes('corporate') || s.includes('business')) {
				return `PROFESSIONAL/CORPORATE AESTHETIC:
- Trust-building colors: deep blues, teals, confident grays
- Clean, structured geometric forms
- Balanced, symmetrical compositions
- Professional sans-serif typography with excellent legibility
- Conservative but distinctive design choices
- Think: IBM, Microsoft, Deloitte - trustworthy expertise
- Communicate reliability, competence, and authority`;
			}
			return `BALANCED PROFESSIONAL AESTHETIC:
- 2-3 harmonious colors with clear hierarchy
- Clean, memorable mark with distinctive character
- Professional typography appropriate to industry
- Balanced composition that works at all sizes
- Timeless design that won't feel dated
- Focus on clarity, memorability, and versatility`;
		};

		// Build industry-specific design direction
		const getIndustryDirection = (brandIndustry: string): string => {
			const ind = brandIndustry?.toLowerCase() || '';
			if (ind.includes('tech') || ind.includes('software') || ind.includes('saas') || ind.includes('ai')) {
				return `TECH/SOFTWARE INDUSTRY:
- Abstract geometric marks suggesting connectivity, data, or innovation
- Modern color palette: blues, purples, teals, or bold primaries
- Clean sans-serif typography suggesting precision
- Shapes: nodes, connections, circuits, abstract data visualization
- Convey: innovation, efficiency, intelligence, progress`;
			}
			if (ind.includes('health') || ind.includes('medical') || ind.includes('wellness') || ind.includes('pharma')) {
				return `HEALTHCARE/WELLNESS INDUSTRY:
- Trust-inducing colors: calming blues, healing greens, clean whites
- Organic shapes suggesting care, growth, vitality
- Symbols: crosses, hearts, leaves, human figures, DNA helix
- Professional yet approachable typography
- Convey: trust, care, health, professionalism, hope`;
			}
			if (ind.includes('finance') || ind.includes('bank') || ind.includes('invest') || ind.includes('insurance')) {
				return `FINANCE/BANKING INDUSTRY:
- Stability colors: deep navy, forest green, burgundy, gold accents
- Strong, solid geometric shapes suggesting security
- Symbols: shields, pillars, upward arrows, abstract growth charts
- Authoritative serif or clean sans-serif typography
- Convey: trust, security, growth, prosperity, stability`;
			}
			if (ind.includes('food') || ind.includes('restaurant') || ind.includes('cafe') || ind.includes('bakery')) {
				return `FOOD/RESTAURANT INDUSTRY:
- Appetite-inducing colors: warm oranges, reds, natural browns, fresh greens
- Organic, rounded shapes suggesting freshness and flavor
- Symbols: utensils, chef hats, plates, ingredients, steam
- Friendly, approachable typography with warmth
- Convey: freshness, quality, taste, hospitality, comfort`;
			}
			if (ind.includes('fashion') || ind.includes('apparel') || ind.includes('clothing') || ind.includes('beauty')) {
				return `FASHION/BEAUTY INDUSTRY:
- Sophisticated palette: black, white, gold, blush, bold accents
- Elegant, refined shapes with style and flair
- Minimalist or dramatic depending on brand positioning
- Fashion-forward typography: elegant serifs or modern sans
- Convey: style, elegance, confidence, beauty, aspiration`;
			}
			if (ind.includes('education') || ind.includes('learning') || ind.includes('school') || ind.includes('academy')) {
				return `EDUCATION/LEARNING INDUSTRY:
- Inspiring colors: blues, greens, warm yellows, optimistic oranges
- Symbols: books, graduation caps, lightbulbs, growth metaphors
- Approachable yet authoritative design
- Clear, readable typography suggesting knowledge
- Convey: knowledge, growth, opportunity, achievement, wisdom`;
			}
			if (ind.includes('retail') || ind.includes('ecommerce') || ind.includes('shop') || ind.includes('store')) {
				return `RETAIL/E-COMMERCE INDUSTRY:
- Versatile, memorable color palette that stands out
- Dynamic shapes suggesting activity and choice
- Symbols: shopping bags, tags, arrows, abstract commerce
- Friendly, accessible typography
- Convey: value, variety, convenience, trust, excitement`;
			}
			if (ind.includes('real estate') || ind.includes('property') || ind.includes('housing')) {
				return `REAL ESTATE INDUSTRY:
- Trust colors: blues, greens, warm neutrals, gold accents
- Symbols: houses, rooflines, keys, doors, skylines
- Solid, grounded geometric shapes
- Professional, trustworthy typography
- Convey: home, security, investment, trust, quality`;
			}
			if (ind.includes('travel') || ind.includes('tourism') || ind.includes('hospitality') || ind.includes('hotel')) {
				return `TRAVEL/HOSPITALITY INDUSTRY:
- Inspiring colors: sky blues, sunset oranges, ocean teals, nature greens
- Dynamic shapes suggesting movement and adventure
- Symbols: globes, planes, compasses, waves, landmarks
- Inviting, adventurous typography
- Convey: adventure, relaxation, discovery, comfort, escape`;
			}
			if (ind.includes('fitness') || ind.includes('sports') || ind.includes('gym') || ind.includes('athletic')) {
				return `FITNESS/SPORTS INDUSTRY:
- Energetic colors: bold reds, oranges, electric blues, dynamic blacks
- Powerful, dynamic shapes suggesting motion and strength
- Angular, athletic forms with energy
- Bold, impactful typography with strength
- Convey: energy, strength, achievement, motivation, power`;
			}
			return `GENERAL INDUSTRY:
- Select colors that resonate with your specific market
- Create a distinctive mark that communicates your unique value
- Typography should match your brand personality
- Balance memorability with professionalism
- Ensure the design works across all applications`;
		};

		const styleDirection = getStyleDirection(style);
		const industryDirection = getIndustryDirection(industry);

		const prompt = `You are an elite brand identity designer who has created iconic logos for Fortune 500 companies. Your logos are featured in design museums. You understand that a great logo is not just an image—it's the visual soul of a brand.

BRAND BRIEF:
${brandContext}
${enhancementPrompt ? `\nCLIENT FEEDBACK FOR REVISION:\n${enhancementPrompt}\nIncorporate this feedback while maintaining design excellence.` : ''}

═══════════════════════════════════════════════════════════════
STYLE DIRECTION - FOLLOW THIS EXACTLY:
═══════════════════════════════════════════════════════════════
${styleDirection}

═══════════════════════════════════════════════════════════════
INDUSTRY CONTEXT - INCORPORATE THESE ELEMENTS:
═══════════════════════════════════════════════════════════════
${industryDirection}

═══════════════════════════════════════════════════════════════
ELITE DESIGN PRINCIPLES (NON-NEGOTIABLE):
═══════════════════════════════════════════════════════════════

1. MEMORABILITY: The logo must be instantly recognizable and memorable. A child should be able to draw it from memory. Think Nike swoosh, Apple apple, Twitter bird.

2. SCALABILITY: Must look perfect from 16px favicon to billboard size. Test mentally at both extremes.

3. VERSATILITY: Works on light backgrounds, dark backgrounds, single color, reversed. No design that only works in one context.

4. TIMELESSNESS: Avoid trendy effects that will date the logo. Classic design principles over fleeting trends.

5. DISTINCTIVENESS: Must stand apart from competitors. No generic shapes or overused symbols.

6. MEANINGFUL: Every element should have purpose. The mark should tell the brand story visually.

7. BALANCE: Perfect visual weight distribution. Professional kerning in typography. Harmonious proportions.

═══════════════════════════════════════════════════════════════
TECHNICAL REQUIREMENTS (STRICT):
═══════════════════════════════════════════════════════════════

OUTPUT: Return ONLY valid SVG code. Start with <svg, end with </svg>. No markdown, no explanations, no code fences.

STRUCTURE:
- viewBox="0 0 400 120" (horizontal logo format)
- Include xmlns="http://www.w3.org/2000/svg"
- Group mark in <g id="mark">, text in <g id="wordmark">
- Include <title>${brandName} Logo</title> and <desc>

TYPOGRAPHY:
- Use <text> elements (not paths) for editability
- Font stack: "Inter, system-ui, -apple-system, sans-serif" for modern
- Font stack: "Georgia, Cambria, serif" for elegant
- letter-spacing for refined kerning
- Appropriate font-weight for brand personality

COLORS:
- Use specific hex values (not named colors)
- Define a clear color hierarchy (primary, secondary, accent)
- Ensure WCAG AA contrast compliance
- Colors must match BOTH the style (${style || 'professional'}) AND industry (${industry || 'general'})

SHAPES:
- Clean, optimized paths with minimal nodes
- Precise geometric shapes using rect, circle, ellipse, polygon
- Use transforms for positioning rather than absolute coordinates
- No unnecessary complexity

FORBIDDEN:
- No raster images or base64
- No external resources
- No scripts or event handlers
- No filters or complex effects that don't scale
- No gradients with more than 3 stops
- No text as paths unless absolutely necessary

═══════════════════════════════════════════════════════════════
CREATE THE LOGO NOW
═══════════════════════════════════════════════════════════════

Design a logo for "${brandName}" that will become iconic. The logo should:
- Perfectly embody the ${style || 'professional'} aesthetic
- Clearly communicate the ${industry || 'brand'} industry
- Be worthy of a world-class brand
- Stand the test of time

Output the SVG code only.`;

		console.log('[generate-logo] Generating logo SVG with Gemini...');

		// Generate SVG logo code using Gemini
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		
		// Extract SVG code from response
		let svgCode = text.trim();
		
		// Remove markdown code blocks if present
		svgCode = svgCode.replace(/```svg\n?/g, '').replace(/```\n?/g, '').replace(/```html\n?/g, '');
		svgCode = svgCode.replace(/^<svg/, '<svg').trim();
		
		// Ensure it starts with <svg
		if (!svgCode.startsWith('<svg')) {
			// Try to find SVG tag in the text
			const svgMatch = svgCode.match(/<svg[\s\S]*<\/svg>/i);
			if (svgMatch) {
				svgCode = svgMatch[0];
			} else {
				throw new Error('Generated content does not contain valid SVG code');
			}
		}
		
		// Validate SVG structure
		if (!svgCode.includes('</svg>')) {
			throw new Error('Generated SVG code is incomplete');
		}
		
		const svgBuffer = Buffer.from(svgCode, 'utf-8');
		const session = typeof locals.auth === 'function' ? await locals.auth() : null;
		const filename = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo.svg`;

		const { id: storageId, fileUrl } = await saveLogoAsset({
			buffer: svgBuffer,
			filename,
			mimeType: 'image/svg+xml',
			userId: session?.user?.id,
			source: 'ai-generated'
		});

		console.log('[generate-logo] Logo generated successfully');

		return json({
			success: true,
			logoUrl: fileUrl,
			logoId: storageId,
			filename,
			type: 'ai-generated',
			svgCode: svgCode // Also return raw SVG for potential editing
		});
	} catch (error: any) {
		console.error('Error generating logo:', error);
		return json(
			{ 
				error: error.message || 'Failed to generate logo',
				details: error.stack
			},
			{ status: 500 }
		);
	}
};

