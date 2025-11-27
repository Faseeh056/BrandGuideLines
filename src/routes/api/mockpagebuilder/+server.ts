import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { and, eq } from 'drizzle-orm';
import { db, mockWebpages, brandGuidelines } from '$lib/db';
import type { ThemeKey } from '$lib/types/theme-content';
import { buildMinimalisticFromSlides } from './buildminimalsitic';
import { buildMaximalisticPage } from './buildmaximalistic';
import { buildFunkyFromSlides } from './buildfunky';
import { buildFuturisticThemeConfig } from './buildfuturistic';

interface BuildRequestBody {
	brandData: any;
	slides: Array<{ name: string; html: string }>;
	theme?: ThemeKey;
}

const THEME_DIR_MAP: Record<ThemeKey, string> = {
	Minimalistic: 'Minimalistic',
	Maximalistic: 'Maximalistic',
	Funky: 'Funky',
	Futuristic: 'Futuristic'
};

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const brandGuidelinesId = url.searchParams.get('brandGuidelinesId');
		const brandName = url.searchParams.get('brandName');

		if (!brandGuidelinesId && !brandName) {
			return json({ error: 'brandGuidelinesId or brandName is required' }, { status: 400 });
		}

		const whereClause = buildMockPageWhereClause(session.user.id, brandGuidelinesId, brandName);
		const [page] = await db.select().from(mockWebpages).where(whereClause).limit(1);

		if (!page) {
			return json({ success: false, error: 'Mock page not found' }, { status: 404 });
		}

		return json({
			success: true,
			page: formatMockPage(page)
		});
	} catch (error: any) {
		console.error('[mockpagebuilder] fetch error', error);
		return json({ error: error?.message || 'Failed to fetch mock page' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
	try {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const brandGuidelinesId = url.searchParams.get('brandGuidelinesId');
		const brandName = url.searchParams.get('brandName');

		if (!brandGuidelinesId && !brandName) {
			return json({ error: 'brandGuidelinesId or brandName is required' }, { status: 400 });
		}

		const whereClause = buildMockPageWhereClause(session.user.id, brandGuidelinesId, brandName);
		const deleted = await db.delete(mockWebpages).where(whereClause).returning();

		return json({
			success: true,
			deleted: deleted.length
		});
	} catch (error: any) {
		console.error('[mockpagebuilder] delete error', error);
		return json({ error: error?.message || 'Failed to delete mock page' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { brandData = {}, slides = [], theme }: BuildRequestBody = await request.json();
		const normalizedTheme = normalizeTheme(theme || brandData?.selectedTheme);
		const session = await locals.auth();
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Enrich brandData with logo information from database if missing
		const enrichedBrandData = await enrichBrandDataWithLogo(session.user.id, brandData);

		const build = await buildThemePage(normalizedTheme, enrichedBrandData, slides);
		const savedPage = await saveMockPage(session.user.id, enrichedBrandData, normalizedTheme, build);

		return json({
			success: true,
			theme: normalizedTheme,
			pageId: savedPage.id,
			...build
		});
	} catch (error: any) {
		console.error('[mockpagebuilder] build failed', error);
		return json(
			{
				success: false,
				error: error?.message || 'Failed to build mock webpage'
			},
			{ status: 500 }
		);
	}
};

function normalizeTheme(raw?: string): ThemeKey {
	if (!raw) return 'Minimalistic';
	const match = ['Minimalistic', 'Maximalistic', 'Funky', 'Futuristic'].find(
		(candidate) => candidate.toLowerCase() === String(raw).toLowerCase()
	);
	return (match as ThemeKey) || 'Minimalistic';
}

async function buildThemePage(
	theme: ThemeKey,
	brandData: any,
	slides: Array<{ name: string; html: string }>
) {
	const safeSlides = ensureSlides(slides, brandData);

	switch (theme) {
		case 'Minimalistic': {
			const result = await buildMinimalisticFromSlides({ slides: safeSlides, brandData });
			const html = await renderReactTemplate('Minimalistic', {
				title: `${result.brandConfig.brandName} – Minimalistic`,
				brandConfig: result.brandConfig,
				fontImports: result.googleFontImports
			});
			return { html, brandConfig: result.brandConfig, slidesUsed: safeSlides };
		}
		case 'Maximalistic': {
			const result = await buildMaximalisticPage({ slides: safeSlides, brandData, theme: 'Maximalistic' });
			const html = await renderReactTemplate('Maximalistic', {
				title: `${result.brand.brandName} – Maximalistic`,
				brandConfig: result.brand,
				templateContent: result.content,
				fontImports: result.fontImports
			});
			return { html, brandConfig: result.brand, slidesUsed: safeSlides };
		}
		case 'Funky': {
			const result = await buildFunkyFromSlides({ slides: safeSlides, brandData });
			const html = await renderReactTemplate('Funky', {
				title: `${result.brandConfig.brandName} – Funky`,
				brandConfig: result.brandConfig,
				fontImports: result.googleFontImports
			});
			return { html, brandConfig: result.brandConfig, slidesUsed: safeSlides };
		}
		case 'Futuristic':
		default: {
			const result = await buildFuturisticThemeConfig(brandData, safeSlides);
			const brandConfig = result.brandConfigOverrides;
			if (!brandConfig) {
				throw new Error('Futuristic builder did not return brand config');
			}
			const html = await renderReactTemplate('Futuristic', {
				title: `${brandConfig.brandName} – Futuristic`,
				brandConfig,
				fontImports: result.googleFontImports
			});
			return { html, brandConfig, slidesUsed: safeSlides };
		}
	}
}

function ensureSlides(
	slides: Array<{ name: string; html: string }> = [],
	brandData: any
): Array<{ name: string; html: string }> {
	if (slides.length) {
		return slides;
	}

	const brandName = brandData?.brand_name || brandData?.brandName || 'Brand Overview';
	const industry =
		brandData?.industry ||
		brandData?.brand_domain ||
		brandData?.brandType ||
		brandData?.selectedIndustry ||
		'Industry';
	const description =
		brandData?.short_description ||
		brandData?.shortDescription ||
		brandData?.description ||
		'A modern brand ready to launch its digital presence.';
	const values = brandData?.brandValues || brandData?.values || '';

	const html = `
		<section style="padding:64px;font-family:Inter, sans-serif;background:#f8fafc;color:#0f172a;">
			<h1 style="font-size:40px;margin-bottom:16px;">${brandName}</h1>
			<p style="font-size:18px;margin-bottom:12px;">${description}</p>
			<p style="font-size:16px;margin-bottom:8px;"><strong>Industry:</strong> ${industry}</p>
			${values ? `<p style="font-size:16px;"><strong>Values:</strong> ${values}</p>` : ''}
		</section>
	`;

	return [
		{
			name: brandName,
			html
		}
	];
}

async function saveMockPage(
	userId: string,
	brandData: any,
	theme: ThemeKey,
	build: { html: string; brandConfig?: Record<string, any>; slidesUsed: Array<{ name: string; html: string }> }
) {
	const brandGuidelinesId =
		brandData?.guidelineId ||
		brandData?.brandGuidelinesId ||
		brandData?.guideline_id ||
		null;
	const brandName = brandData?.brandName || brandData?.brand_name || 'Untitled Brand';

	const whereClause = buildMockPageWhereClause(userId, brandGuidelinesId, brandName);
	const payload = {
		userId,
		brandGuidelinesId,
		brandName,
		theme,
		htmlContent: build.html,
		brandConfig: build.brandConfig ? JSON.stringify(build.brandConfig) : null,
		slidesSnapshot: JSON.stringify(build.slidesUsed),
		updatedAt: new Date()
	};

	const existing = await db.select().from(mockWebpages).where(whereClause).limit(1);
	if (existing.length) {
		const [updated] = await db
			.update(mockWebpages)
			.set(payload)
			.where(eq(mockWebpages.id, existing[0].id))
			.returning();
		return updated;
	}

	const [inserted] = await db
		.insert(mockWebpages)
		.values({
			...payload,
			createdAt: payload.updatedAt
		})
		.returning();
	return inserted;
}

function buildMockPageWhereClause(userId: string, brandGuidelinesId?: string | null, brandName?: string | null) {
	if (brandGuidelinesId) {
		return and(eq(mockWebpages.userId, userId), eq(mockWebpages.brandGuidelinesId, brandGuidelinesId));
	}
	if (brandName) {
		return and(eq(mockWebpages.userId, userId), eq(mockWebpages.brandName, brandName));
	}
	throw new Error('brandGuidelinesId or brandName is required');
}

function formatMockPage(record: typeof mockWebpages.$inferSelect) {
	return {
		id: record.id,
		theme: record.theme,
		brandGuidelinesId: record.brandGuidelinesId,
		brandName: record.brandName,
		htmlContent: record.htmlContent,
		brandConfig: safeParse(record.brandConfig),
		slidesSnapshot: safeParse(record.slidesSnapshot),
		updatedAt: record.updatedAt
	};
}

function safeParse(value?: string | null) {
	if (!value) return null;
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

/**
 * Enrich brandData with logo information from database if logoUrl is missing
 */
async function enrichBrandDataWithLogo(userId: string, brandData: any): Promise<any> {
	// If logoUrl already exists, return as is
	if (brandData?.logoUrl || brandData?.logo_url || brandData?.logo?.primaryLogoUrl) {
		return brandData;
	}

	// Try to fetch from database using guidelineId
	const guidelineId = brandData?.guidelineId || brandData?.brandGuidelinesId || brandData?.guideline_id;
	if (guidelineId) {
		try {
			const [guideline] = await db
				.select()
				.from(brandGuidelines)
				.where(and(eq(brandGuidelines.id, guidelineId), eq(brandGuidelines.userId, userId)))
				.limit(1);

			if (guideline) {
				return extractLogoFromGuideline(guideline, brandData);
			}
		} catch (error) {
			console.warn('[mockpagebuilder] Failed to fetch guideline for logo:', error);
		}
	}

	// Try to fetch by brandName if guidelineId not available
	const brandName = brandData?.brandName || brandData?.brand_name;
	if (brandName) {
		try {
			const [guideline] = await db
				.select()
				.from(brandGuidelines)
				.where(and(eq(brandGuidelines.brandName, brandName), eq(brandGuidelines.userId, userId)))
				.orderBy(brandGuidelines.updatedAt)
				.limit(1);

			if (guideline) {
				return extractLogoFromGuideline(guideline, brandData);
			}
		} catch (error) {
			console.warn('[mockpagebuilder] Failed to fetch guideline by brandName for logo:', error);
		}
	}

	return brandData;
}

/**
 * Extract logo URL/data from brand guideline and merge into brandData
 */
function extractLogoFromGuideline(guideline: typeof brandGuidelines.$inferSelect, brandData: any): any {
	const enriched = { ...brandData };

	// Try to get logo from logoFiles (new format)
	if (guideline.logoFiles) {
		try {
			const logoFiles = JSON.parse(guideline.logoFiles);
			if (Array.isArray(logoFiles) && logoFiles.length > 0) {
				const firstLogo = logoFiles[0];
				const logoData = firstLogo?.fileData || firstLogo?.data || firstLogo?.fileUrl || firstLogo?.filePath;
				
				if (logoData) {
					enriched.logoUrl = logoData;
					enriched.logo_url = logoData;
					enriched.logoFiles = logoFiles;
					if (!enriched.logo) {
						enriched.logo = {
							primaryLogoUrl: logoData,
							primary: logoData
						};
					}
				}
			}
		} catch (error) {
			console.warn('[mockpagebuilder] Failed to parse logoFiles:', error);
		}
	}

	// Fallback to logoData (base64)
	if (!enriched.logoUrl && guideline.logoData) {
		enriched.logoUrl = guideline.logoData;
		enriched.logo_url = guideline.logoData;
		if (!enriched.logo) {
			enriched.logo = {
				primaryLogoUrl: guideline.logoData,
				primary: guideline.logoData
			};
		}
	}

	// Fallback to logoPath (legacy)
	if (!enriched.logoUrl && guideline.logoPath) {
		enriched.logoUrl = guideline.logoPath;
		enriched.logo_url = guideline.logoPath;
	}

	return enriched;
}

async function renderReactTemplate(
	themeDir: string,
	options: {
		title?: string;
		brandConfig?: Record<string, any>;
		templateContent?: Record<string, any>;
		fontImports?: string[];
	}
) {
	const buildDir = join(process.cwd(), 'react-templates', themeDir, 'build');
	const indexPath = join(buildDir, 'index.html');

	if (!existsSync(indexPath)) {
		throw new Error(
			`Build output missing for ${themeDir}. Run "cd react-templates/${themeDir} && npm run build" first.`
		);
	}

	let html = readFileSync(indexPath, 'utf-8');
	html = inlineCss(html, buildDir);
	html = inlineJs(html, buildDir);

	const fontLinks =
		options.fontImports?.length
			? options.fontImports
					.filter(Boolean)
					.map((href) => `<link rel="stylesheet" href="${href}" />`)
					.join('\n')
			: '';

	const globalsScript = `
			<script>
				${options.brandConfig ? `window.__BRAND_CONFIG__ = ${JSON.stringify(options.brandConfig)};` : ''}
				${
					options.templateContent
						? `window.__TEMPLATE_CONTENT__ = ${JSON.stringify(options.templateContent)};`
						: ''
				}
			</script>
	`;

	const injection = `${fontLinks}\n${globalsScript}`;

	if (html.includes('</head>')) {
		html = html.replace('</head>', `${injection}</head>`);
	} else {
		html = `${injection}${html}`;
	}

	const title = options.title || `${options.brandConfig?.brandName || 'Brand'} – ${themeDir}`;
	html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

	return html;
}

function inlineCss(html: string, buildDir: string) {
	return html.replace(/<link[^>]+href=\"\.\/assets\/([^\"']+\.css)\"[^>]*>/g, (match, file) => {
		const cssPath = join(buildDir, 'assets', file);
		if (existsSync(cssPath)) {
			const css = readFileSync(cssPath, 'utf-8');
			return `<style>${css}</style>`;
		}
		return match;
	});
}

function inlineJs(html: string, buildDir: string) {
	return html.replace(/<script[^>]+src=\"\.\/assets\/([^\"']+\.js)\"[^>]*><\/script>/g, (match, file) => {
		const jsPath = join(buildDir, 'assets', file);
		if (existsSync(jsPath)) {
			const js = readFileSync(jsPath, 'utf-8');
			return `<script type="module">${js}</script>`;
		}
		return match;
	});
}

