<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import anime from 'animejs/lib/anime.es.js';

  type ThemeKey = 'minimalistic' | 'maximalistic' | 'funky' | 'futuristic';
  type HtmlSlide = { name: string; html: string };

  const THEME_PRIORITY: ThemeKey[] = ['futuristic', 'maximalistic', 'funky', 'minimalistic'];
  const THEME_KEYWORDS: Record<ThemeKey, string[]> = {
    futuristic: ['futuristic', 'future', 'tech', 'ai', 'cyber', 'neon', 'digital'],
    maximalistic: ['maximal', 'luxury', 'bold', 'premium', 'editorial', 'gourmet'],
    funky: ['funky', 'playful', 'retro', 'vibrant', 'youth', 'street', 'creative'],
    minimalistic: ['minimal', 'minimalist', 'clean', 'calm', 'modern', 'serene', 'soft']
  };

  const THEME_PRESETS: Record<ThemeKey, { bg: string; surface: string; accent: string; accentSoft: string; text: string; gradient: string }>
    = {
      minimalistic: {
        bg: '#f8fafc',
        surface: '#ffffff',
        accent: '#0f172a',
        accentSoft: '#cbd5f5',
        text: '#1f2937',
        gradient: 'linear-gradient(135deg, #eef2ff, #f8fafc)'
      },
      maximalistic: {
        bg: '#170f1e',
        surface: '#231526',
        accent: '#ff7d92',
        accentSoft: '#ffd3dd',
        text: '#fef3f9',
        gradient: 'linear-gradient(135deg, #ff7a18, #af002d 85%)'
      },
      funky: {
        bg: '#0c1224',
        surface: '#121a33',
        accent: '#ffd447',
        accentSoft: '#ff9b9b',
        text: '#f8fbff',
        gradient: 'linear-gradient(120deg, #ff9b9b, #ffd447)'
      },
      futuristic: {
        bg: '#020617',
        surface: '#050b26',
        accent: '#5cf4ff',
        accentSoft: '#7c3aed',
        text: '#e0f2fe',
        gradient: 'linear-gradient(130deg, #5cf4ff, #7c3aed)'
      }
    };

  const FALLBACK_GALLERIES: Record<ThemeKey, string[]> = {
    minimalistic: [
      'https://images.unsplash.com/photo-1708758487256-8a3a73565dc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1721146378270-1b93839f7ae7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80'
    ],
    maximalistic: [
      'https://images.unsplash.com/photo-1663072302693-d92701c4ef42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1722938687754-d77c159da3c8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?auto=format&fit=crop&w=1200&q=80'
    ],
    funky: [
      'https://images.unsplash.com/photo-1685432531593-1afc8a152e5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1663082076137-486bc3ff6fd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573136810265-a584af43f98f?auto=format&fit=crop&w=1200&q=80'
    ],
    futuristic: [
      'https://images.unsplash.com/photo-1613500429601-62a596776da7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1644088379091-d574269d422f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=1200&q=80'
    ]
  };

  const UNSPLASH_KEY = (import.meta as any).env?.VITE_UNSPLASH_ACCESS_KEY || (import.meta as any).env?.PUBLIC_UNSPLASH_ACCESS_KEY || '';
  const PEXELS_KEY = (import.meta as any).env?.VITE_PEXELS_API_KEY || (import.meta as any).env?.PUBLIC_PEXELS_API_KEY || '';

  let brandData: any = null;
  let slides: HtmlSlide[] = [];
  let loading = true;
  let error: string | null = null;
  let vibes: string[] = [];
  let theme: ThemeKey = 'minimalistic';
  let palette: string[] = [];
  let heroImage: string | null = null;
  let galleryImages: string[] = [];
  let primaryFont = 'Inter';
  let secondaryFont = 'Manrope';
  let heroCopy = { title: 'Bring your brand to life', subtitle: 'This mock experience shows how your guidelines translate to a live web presence.', cta: 'Launch brand-ready site' };
  let featureList: { title: string; description: string }[] = [];
  let cubeRef: HTMLDivElement | null = null;

  onMount(() => {
    if (!browser) return;
    (async () => {
      try {
        await hydrate();
      } catch (err: any) {
        console.error('Mock web page hydrate error:', err);
        error = err?.message || 'Failed to build mock preview';
      } finally {
        loading = false;
      }
    })();
  });

  async function hydrate() {
    const raw = sessionStorage.getItem('preview_brand_data');
    if (!raw) {
      error = 'No brand data available. Please return to the presentation view.';
      return;
    }

    brandData = JSON.parse(raw);
    await ensureGuidelineMetadata();
    await ensureSlides();

    vibes = extractVibes();
    theme = resolveTheme(vibes);
    palette = extractPalette();
    const { headline, body } = extractTypography();
    primaryFont = headline;
    secondaryFont = body;
    heroCopy = buildHeroCopy();
    featureList = deriveFeatureList();

    await loadThemeImagery();

    if (theme === 'futuristic') {
      queueMicrotask(() => initFuturisticAnimation());
    }
  }

  async function ensureGuidelineMetadata() {
    let guidelineId = brandData?.id || brandData?.guidelineId;
    if (guidelineId) {
      sessionStorage.setItem('current_guideline_id', guidelineId);
      return;
    }

    try {
      const response = await fetch(`/api/brand-guidelines/by-name?brandName=${encodeURIComponent(brandData?.brandName || '')}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.guideline) {
          guidelineId = result.guideline.id;
          sessionStorage.setItem('current_guideline_id', guidelineId);
        }
      }
    } catch (err) {
      console.warn('Guideline lookup failed:', err);
    }
  }

  async function ensureSlides() {
    const slidesStep = brandData?.stepHistory?.find((s: any) => s.step === 'generated-slides');
    if (slidesStep?.content) {
      try {
        slides = JSON.parse(slidesStep.content) as HtmlSlide[];
      } catch (err) {
        console.warn('Slide parse failed, refetching…', err);
        slides = [];
      }
    }

    if (slides.length) return;

    try {
      const res = await fetch('/api/preview-slides-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandData.brand_name || brandData.brandName,
          brandDomain: brandData.brand_domain || brandData.brandDomain,
          contact: brandData.contact,
          stepHistory: brandData.stepHistory,
          logoFiles: brandData.logoFiles,
          logoUrl: brandData.logoUrl,
          logo: brandData.logo
        })
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      if (data.success && data.slides) {
        slides = data.slides as HtmlSlide[];
        if (slidesStep) {
          slidesStep.content = JSON.stringify(slides);
          sessionStorage.setItem('preview_brand_data', JSON.stringify(brandData));
        }
      }
    } catch (err) {
      console.error('Slide fetch failed:', err);
    }
  }

  function extractVibes(): string[] {
    const collected: string[] = [];
    const pushValue = (value: unknown) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach(pushValue);
      } else if (typeof value === 'string') {
        value.split(/[,&]/).forEach((token) => collected.push(token.trim().toLowerCase()));
      }
    };

    pushValue(brandData?.selectedMood);
    pushValue(brandData?.brandValues);
    pushValue(brandData?.vibes);
    pushValue(brandData?.toneOfVoice);

    return Array.from(new Set(collected.filter(Boolean)));
  }

  function resolveTheme(vibeList: string[]): ThemeKey {
    for (const key of THEME_PRIORITY) {
      if (vibeList.some((vibe) => THEME_KEYWORDS[key].some((kw) => vibe.includes(kw)))) {
        return key;
      }
    }
    return 'minimalistic';
  }

  function extractPalette(): string[] {
    const pools: string[][] = [];
    if (Array.isArray(brandData?.colorPalette)) {
      pools.push(brandData.colorPalette);
    }
    if (Array.isArray(brandData?.brandColors)) {
      pools.push(brandData.brandColors);
    }
    if (brandData?.palette?.colors) {
      pools.push(Object.values(brandData.palette.colors));
    }

    const merged = Array.from(new Set(pools.flat().filter((color) => typeof color === 'string')));
    if (merged.length >= 3) return merged.slice(0, 5);

    const preset = THEME_PRESETS[theme];
    return [preset.accent, preset.accentSoft, preset.text, '#ffffff'];
  }

  function extractTypography() {
    const typography = brandData?.typography || brandData?.brandTypography;
    const headline = typography?.headings?.font || typography?.headlineFont || 'Space Grotesk';
    const body = typography?.body?.font || typography?.bodyFont || 'Inter';
    return { headline, body };
  }

  function buildHeroCopy() {
    const tagline = brandData?.tagline || brandData?.brandTagline;
    const mission = brandData?.missionStatement || brandData?.mission;
    const audience = brandData?.selectedAudience || brandData?.audiencePersona;
    return {
      title: tagline || `Experience ${resolveBrandName()} online`,
      subtitle: mission || 'An expressive hero section that mirrors your guidelines in motion.',
      cta: audience ? `Engage ${Array.isArray(audience) ? audience[0] : audience} today` : 'Preview live experience'
    };
  }

  function deriveFeatureList() {
    const differentiators = brandData?.valueProps || brandData?.keyDifferentiators || [];
    if (Array.isArray(differentiators) && differentiators.length) {
      return differentiators.slice(0, 3).map((item: string, idx: number) => ({
        title: item.split(':')[0] || `Benefit ${idx + 1}`,
        description: item.split(':').slice(1).join(':').trim() || 'Detailed storyline directly from your guideline copy.'
      }));
    }

    return [
      { title: 'Brand-consistent hero', description: 'Color, typography, and messaging mirror the presentation deck.' },
      { title: 'Guideline-driven modules', description: 'Components assemble dynamically using your approved content blocks.' },
      { title: 'Imagery matched to vibe', description: 'Unsplash/Pexels photography aligns with the selected mood.' }
    ];
  }

  async function loadThemeImagery() {
    const query = vibes[0] || theme;
    heroImage = await fetchPreferredImage(`${query} brand hero`);

    const galleryPromises = [0, 1, 2].map((idx) => fetchPreferredImage(`${query} lifestyle ${idx}`));
    const results = await Promise.all(galleryPromises);
    galleryImages = results.filter(Boolean) as string[];

    if (!galleryImages.length) {
      galleryImages = FALLBACK_GALLERIES[theme];
    }
  }

  async function fetchPreferredImage(query: string): Promise<string | null> {
    const unsplash = await fetchUnsplashImage(query);
    if (unsplash) return unsplash;
    const pexels = await fetchPexelsImage(query);
    if (pexels) return pexels;
    return null;
  }

  async function fetchUnsplashImage(query: string): Promise<string | null> {
    if (!UNSPLASH_KEY) return null;
    try {
      const res = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
      });
      if (!res.ok) throw new Error('Unsplash request failed');
      const data = await res.json();
      return data.urls?.regular || null;
    } catch (err) {
      console.warn('Unsplash fetch failed:', err);
      return null;
    }
  }

  async function fetchPexelsImage(query: string): Promise<string | null> {
    if (!PEXELS_KEY) return null;
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?per_page=1&orientation=landscape&query=${encodeURIComponent(query)}`, {
        headers: { Authorization: PEXELS_KEY }
      });
      if (!res.ok) throw new Error('Pexels request failed');
      const data = await res.json();
      return data.photos?.[0]?.src?.large || null;
    } catch (err) {
      console.warn('Pexels fetch failed:', err);
      return null;
    }
  }

  function initFuturisticAnimation() {
    if (!cubeRef) return;
    anime({
      targets: cubeRef,
      rotateY: ['0deg', '360deg'],
      rotateX: ['0deg', '360deg'],
      scale: [0.95, 1.05],
      duration: 6000,
      easing: 'easeInOutSine',
      loop: true
    });
  }

  function resolveBrandName() {
    return brandData?.brand_name || brandData?.brandName || 'Your Brand';
  }

  function navigateBack() {
    goto('/dashboard/preview-html');
  }
</script>

{#if loading}
  <div class="mock-shell loading-state">
    <div class="loader">
      <div class="spinner"></div>
      <p>Generating mock experience…</p>
    </div>
  </div>
{:else if error}
  <div class="mock-shell error-state">
    <div class="error-card">
      <div class="emoji">⚠️</div>
      <h2>Unable to render mock web page</h2>
      <p>{error}</p>
      <button class="primary" on:click={navigateBack}>← Back to presentation</button>
    </div>
  </div>
{:else}
  {#if brandData}
    <div class={`mock-shell theme-${theme}`} style={`--bg:${THEME_PRESETS[theme].bg}; --surface:${THEME_PRESETS[theme].surface}; --accent:${THEME_PRESETS[theme].accent}; --accent-soft:${THEME_PRESETS[theme].accentSoft}; --text:${THEME_PRESETS[theme].text}; --gradient:${THEME_PRESETS[theme].gradient}; --font-headline:${primaryFont}; --font-body:${secondaryFont};`}>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">{resolveBrandName()} · Guided by your presentation</p>
          <h1 style={`font-family:${primaryFont}, 'Space Grotesk', sans-serif`}>{heroCopy.title}</h1>
          <p style={`font-family:${secondaryFont}, 'Inter', sans-serif`}>{heroCopy.subtitle}</p>
          <div class="hero-actions">
            <button class="primary">{heroCopy.cta}</button>
            <button class="secondary" on:click={navigateBack}>← Back to presentation</button>
          </div>
          {#if vibes.length}
            <div class="vibe-chips">
              {#each vibes.slice(0, 6) as vibe}
                <span class="chip">{vibe}</span>
              {/each}
            </div>
          {/if}
        </div>
        <div class="hero-visual">
          {#if heroImage}
            <img src={heroImage} alt="Thematic hero" loading="lazy" />
          {:else}
            <div class="hero-placeholder">Imagery loads automatically using Unsplash/Pexels.</div>
          {/if}
          {#if theme === 'futuristic'}
            <div class="cube-wrapper">
              <div class="futuristic-cube" bind:this={cubeRef}></div>
            </div>
          {/if}
        </div>
      </section>

      <section class="palette">
        <div class="section-heading">
          <h2>Color system</h2>
          <p>Derived from the presentation palette</p>
        </div>
        <div class="swatches">
          {#each palette.slice(0, 5) as color}
            <div class="swatch" style={`--swatch:${color}`}>
              <span>{color}</span>
            </div>
          {/each}
        </div>
      </section>

      <section class="feature-grid">
        {#each featureList as feature}
          <article class="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        {/each}
      </section>

      <section class="gallery">
        <div class="section-heading">
          <h2>Imagery direction</h2>
          <p>Matched to the selected vibe</p>
        </div>
        <div class="gallery-grid">
          {#each galleryImages.slice(0, 3) as image}
            <figure>
              <img src={image} alt="Gallery" loading="lazy" />
            </figure>
          {/each}
        </div>
      </section>

      <section class="typography">
        <div>
          <p class="eyebrow">Typography</p>
          <h2 style={`font-family:${primaryFont}, 'Space Grotesk', sans-serif`}>{primaryFont}</h2>
          <p style={`font-family:${secondaryFont}, 'Inter', sans-serif`}>
            {secondaryFont} keeps paragraphs, descriptions, and UI patterns readable and on-brand.
          </p>
        </div>
        <div class="cta-card">
          <h3>Ready to ship this experience?</h3>
          <p>Use the export controls in presentation view to deliver editable assets.</p>
          <button class="primary" on:click={navigateBack}>Open presentation ↗</button>
        </div>
      </section>
    </div>
  {/if}
{/if}

<style>
  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .mock-shell {
    min-height: 100vh;
    padding: clamp(1.5rem, 5vw, 3rem);
    background: var(--bg, #f5f5f5);
    color: var(--text, #111);
  }

  .mock-shell.loading-state,
  .mock-shell.error-state {
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at top, #1f2937, #0f172a 70%);
    color: #fff;
  }

  .loader {
    text-align: center;
  }

  .loader .spinner {
    width: 48px;
    height: 48px;
    border: 5px solid rgba(255, 255, 255, 0.2);
    border-top-color: #fff;
    border-radius: 50%;
    margin: 0 auto 1rem;
    animation: spin 1.2s linear infinite;
  }

  .error-card {
    background: rgba(0, 0, 0, 0.4);
    padding: 2rem;
    border-radius: 1.5rem;
    text-align: center;
    max-width: 420px;
  }

  .error-card h2 {
    margin-bottom: 0.5rem;
  }

  .error-card p {
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .error-card .emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .error-card .primary {
    background: #fff;
    color: #111;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    cursor: pointer;
  }

  .hero {
    display: grid;
    gap: clamp(1rem, 4vw, 3rem);
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    background: var(--surface);
    border-radius: 28px;
    padding: clamp(1.5rem, 4vw, 3rem);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.35);
  }

  .hero h1 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    line-height: 1.1;
    margin-bottom: 1rem;
  }

  .hero p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.85);
  }

  .hero-copy .eyebrow {
    font-size: 0.85rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .hero-actions .primary {
    background: var(--gradient);
    border: none;
    color: #fff;
    padding: 0.85rem 1.8rem;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
  }

  .hero-actions .secondary {
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: transparent;
    color: #fff;
    padding: 0.85rem 1.8rem;
    border-radius: 999px;
    cursor: pointer;
  }

  .vibe-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .chip {
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.85rem;
    text-transform: capitalize;
  }

  .hero-visual {
    position: relative;
  }

  .hero-visual img,
  .hero-placeholder {
    width: 100%;
    border-radius: 24px;
    height: 360px;
    object-fit: cover;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .hero-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
    padding: 1rem;
    text-align: center;
  }

  .cube-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .futuristic-cube {
    width: 140px;
    height: 140px;
    border-radius: 24px;
    background: var(--gradient);
    filter: drop-shadow(0 20px 40px rgba(92, 244, 255, 0.35));
    mix-blend-mode: screen;
  }

  .section-heading {
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    margin: 0;
  }

  .palette,
  .feature-grid,
  .gallery,
  .typography {
    margin-top: 3rem;
  }

  .palette,
  .gallery,
  .typography {
    background: var(--surface);
    padding: clamp(1.25rem, 3vw, 2rem);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .swatch {
    border-radius: 18px;
    padding: 1.25rem;
    background: var(--swatch, #444);
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .gallery-grid figure {
    margin: 0;
  }

  .gallery-grid img {
    width: 100%;
    border-radius: 18px;
    height: 240px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .typography {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    align-items: center;
  }

  .cta-card {
    background: var(--gradient);
    padding: 1.5rem;
    border-radius: 20px;
    color: #fff;
  }

  .cta-card .primary {
    margin-top: 1rem;
    border: none;
    background: rgba(0, 0, 0, 0.25);
    padding: 0.85rem 1.5rem;
    border-radius: 999px;
    color: #fff;
    cursor: pointer;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .futuristic-cube {
      animation: none !important;
    }
  }
</style>
