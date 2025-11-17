<script lang="ts">
  import type { SlideData } from '$lib/types/slide-data';
  
  export let primaryFont: string = 'Arial';
  export let secondaryFont: string = 'Arial';
  export let primaryWeights: string = 'Regular, Bold';
  export let secondaryWeights: string = 'Regular, Medium';
  export let color1Hex: string = '#1E40AF'; // PRIMARY_COLOR (for title)
  export let color4Lighter: string = '#93C5FD';
  export let color5Lighter: string = '#60A5FA';
  export let color6Lighter: string = '#3B82F6';
  export let color4Rgba8: string = 'rgba(147, 197, 253, 0.08)';
  export let color5Rgba8: string = 'rgba(96, 165, 250, 0.08)';
  export let color6Rgba8: string = 'rgba(59, 130, 246, 0.08)';
  export let isEditable: boolean = false;
  
  // Editable hierarchy content
  export let hierarchyH1: string = 'H1: 32pt - Main titles';
  export let hierarchyH2: string = 'H2: 24pt - Section headers';
  export let hierarchyH3: string = 'H3: 20pt - Subsection headers';
  export let hierarchyBody: string = 'Body: 16pt - Main content';
  
  // Editable background
  export let background: {
    type: 'color' | 'gradient';
    color?: string;
    gradient?: {
      colors: string[];
      direction: number;
    };
  } = {
    type: 'gradient',
    gradient: {
      colors: [color4Lighter, color5Lighter, '#FFFFFF', color6Lighter, '#FFFFFF'],
      direction: 135
    }
  };
  
  // Background style
  $: backgroundStyle = (() => {
    if (background && background.type === 'color' && background.color) {
      return background.color;
    } else if (background && background.type === 'gradient' && background.gradient && background.gradient.colors && background.gradient.colors.length > 0) {
      const colors = background.gradient.colors;
      const stops = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(', ');
      return `linear-gradient(${background.gradient.direction || 135}deg, ${stops})`;
    } else {
      // Fallback to default gradient
      return `linear-gradient(135deg, ${color4Lighter} 0%, ${color5Lighter} 30%, #FFFFFF 50%, ${color6Lighter} 70%, #FFFFFF 100%)`;
    }
  })();
  
  // Dynamic styles computed from props
  $: radialOverlayStyle = `linear-gradient(90deg, transparent 0%, ${color4Rgba8} 20%, transparent 40%, ${color5Rgba8} 60%, transparent 80%, ${color6Rgba8} 100%)`;
  $: titleColorStyle = color1Hex; // HTML uses {{PRIMARY_COLOR}} for title
  
  // Function to load Google Font dynamically (works for any font name)
  function loadGoogleFont(fontName: string) {
    if (typeof document === 'undefined' || !fontName) return;
    
    // Check if font is already loaded
    const fontId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(fontId)) return;
    
    // Try to load as Google Font (most common fonts are available)
    // If it's not a Google Font, the browser will fall back to system fonts
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
    link.onerror = () => {
      // If Google Font doesn't exist, silently fail - browser will use fallback
      console.log(`Font "${fontName}" not found in Google Fonts, using system fallback`);
    };
    document.head.appendChild(link);
  }
  
  // Load fonts when component mounts or fonts change
  $: if (primaryFont) {
    loadGoogleFont(primaryFont);
  }
  
  $: if (secondaryFont) {
    loadGoogleFont(secondaryFont);
  }
  
  // Format font family string for CSS
  $: primaryFontFamily = `"${primaryFont}", ${getFontFallback(primaryFont)}`;
  $: secondaryFontFamily = `"${secondaryFont}", ${getFontFallback(secondaryFont)}`;
  
  function getFontFallback(fontName: string): string {
    const lowerName = fontName.toLowerCase();
    if (lowerName.includes('serif') || lowerName.includes('display') || lowerName.includes('baskerville') || lowerName.includes('crimson') || lowerName.includes('merriweather')) {
      return 'serif';
    }
    return 'sans-serif';
  }
  
  $: slideData = createSlideData();
  
  function createSlideData(): SlideData {
    // Use the current background prop (which may have been edited)
    let bgColors: string[] = [];
    let bgDirection = 135;
    
    if (background && background.type === 'gradient' && background.gradient && background.gradient.colors) {
      bgColors = background.gradient.colors
        .filter(c => c != null && typeof c === 'string')
        .map(c => (c || '').replace('#', ''))
        .filter(c => c.length > 0);
      bgDirection = background.gradient.direction || 135;
    } else if (background && background.type === 'color' && background.color) {
      const color = (background.color || '').replace('#', '');
      if (color) bgColors = [color];
    }
    
    // Fallback to default if no valid colors found
    if (bgColors.length === 0) {
      const fallbackColors = [
        color4Lighter,
        color5Lighter,
        'FFFFFF',
        color6Lighter,
        'FFFFFF'
      ].filter(c => c != null && typeof c === 'string');
      
      bgColors = fallbackColors.length > 0
        ? fallbackColors.map(c => (c || '').replace('#', ''))
        : ['FFFFFF', 'F0F0F0', 'FFFFFF', 'E0E0E0', 'FFFFFF'];
    }
    
    return {
      id: 'typography',
      type: 'typography',
      layout: {
        width: 10,
        height: 5.625,
        background: bgColors.length === 1 ? {
          type: 'color',
          color: bgColors[0]
        } : {
          type: 'gradient',
          gradient: {
            colors: bgColors,
            direction: bgDirection
          }
        }
      },
      elements: [
        // Title
        {
          id: 'title',
          type: 'text' as const,
          position: { x: 0.47, y: 0.28, w: 9.06, h: 0.5 },
          text: 'TYPEFACE',
          fontSize: 36,
          fontFace: 'Arial',
          bold: true,
          color: color1Hex.replace('#', ''),
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        // Divider
        {
          id: 'divider',
          type: 'shape' as const,
          position: { x: 0.47, y: 0.78, w: 9.06, h: 0.02 },
          shapeType: 'rect',
          fillColor: '8B4513',
          zIndex: 2
        },
        // Primary font card background
        {
          id: 'primary-card-bg',
          type: 'shape' as const,
          position: { x: 0.47, y: 1.11, w: 4.38, h: 1.39 },
          shapeType: 'rect',
          fillColor: 'F8F8F8',
          lineColor: 'E0E0E0',
          lineWidth: 1,
          zIndex: 1
        },
        // Primary font label
        {
          id: 'primary-label',
          type: 'text' as const,
          position: { x: 0.57, y: 1.21, w: 4.18, h: 0.14 },
          text: 'PRIMARY FONT',
          fontSize: 12,
          fontFace: 'Arial',
          bold: true,
          color: '666666',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        // Primary font name
        {
          id: 'primary-name',
          type: 'text' as const,
          position: { x: 0.57, y: 1.35, w: 4.18, h: 0.39 },
          text: primaryFont,
          fontSize: 24,
          fontFace: primaryFont,
          bold: true,
          color: '2563EB',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        // Secondary font card background
        {
          id: 'secondary-card-bg',
          type: 'shape' as const,
          position: { x: 5.15, y: 1.11, w: 4.38, h: 1.39 },
          shapeType: 'rect',
          fillColor: 'F8F8F8',
          lineColor: 'E0E0E0',
          lineWidth: 1,
          zIndex: 1
        },
        // Secondary font label
        {
          id: 'secondary-label',
          type: 'text' as const,
          position: { x: 5.25, y: 1.21, w: 4.18, h: 0.14 },
          text: 'SECONDARY FONT',
          fontSize: 12,
          fontFace: 'Arial',
          bold: true,
          color: '666666',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        // Secondary font name
        {
          id: 'secondary-name',
          type: 'text' as const,
          position: { x: 5.25, y: 1.35, w: 4.18, h: 0.39 },
          text: secondaryFont,
          fontSize: 24,
          fontFace: secondaryFont,
          bold: true,
          color: '2563EB',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        // Hierarchy card background
        {
          id: 'hierarchy-card-bg',
          type: 'shape' as const,
          position: { x: 0.47, y: 2.7, w: 9.06, h: 1.39 },
          shapeType: 'rect',
          fillColor: 'F8F8F8',
          lineColor: 'E0E0E0',
          lineWidth: 1,
          zIndex: 1
        },
        // Hierarchy title
        {
          id: 'hierarchy-title',
          type: 'text' as const,
          position: { x: 0.57, y: 2.8, w: 8.86, h: 0.14 },
          text: 'TYPOGRAPHY HIERARCHY',
          fontSize: 12,
          fontFace: 'Arial',
          bold: true,
          color: '666666',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        // Font sample texts
        {
          id: 'primary-sample',
          type: 'text' as const,
          position: { x: 0.57, y: 1.74, w: 4.18, h: 0.4 },
          text: 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz\n0123456789',
          fontSize: 14,
          fontFace: primaryFont,
          color: '2C2C2C',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        {
          id: 'secondary-sample',
          type: 'text' as const,
          position: { x: 5.25, y: 1.74, w: 4.18, h: 0.4 },
          text: 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz\n0123456789',
          fontSize: 14,
          fontFace: secondaryFont,
          color: '2C2C2C',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        // Hierarchy items
        {
          id: 'hierarchy-h1',
          type: 'text' as const,
          position: { x: 0.57, y: 3.04, w: 8.86, h: 0.25 },
          text: hierarchyH1,
          fontSize: 13,
          fontFace: 'Arial',
          color: '2C2C2C',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        {
          id: 'hierarchy-h2',
          type: 'text' as const,
          position: { x: 0.57, y: 3.29, w: 8.86, h: 0.25 },
          text: hierarchyH2,
          fontSize: 13,
          fontFace: 'Arial',
          color: '2C2C2C',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        {
          id: 'hierarchy-h3',
          type: 'text' as const,
          position: { x: 0.57, y: 3.54, w: 8.86, h: 0.25 },
          text: hierarchyH3,
          fontSize: 13,
          fontFace: 'Arial',
          color: '2C2C2C',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        },
        {
          id: 'hierarchy-body',
          type: 'text' as const,
          position: { x: 0.57, y: 3.79, w: 8.86, h: 0.25 },
          text: hierarchyBody,
          fontSize: 13,
          fontFace: 'Arial',
          color: '2C2C2C',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        }
      ]
    };
  }
  
  // Always call createSlideData() to get the latest values (including edited content)
  export function getSlideData(): SlideData {
    return createSlideData();
  }
</script>

<div class="typography-slide" style="background: {backgroundStyle};">
  <div class="radial-overlay" style="background: {radialOverlayStyle};"></div>
  
  <div class="slide">
    <div class="title" style="color: {titleColorStyle};">TYPEFACE</div>
    <div class="divider"></div>
    
    <div class="font-row">
      <div class="font-card">
        <div class="font-label">PRIMARY FONT</div>
        {#if isEditable}
          <div class="font-editing-group">
            <input 
              type="text" 
              bind:value={primaryFont} 
              class="font-name-input" 
              placeholder="Enter font name (e.g., Roboto, Inter, Arial)"
            />
            <input type="text" bind:value={primaryWeights} class="font-weights-input" placeholder="Regular, Bold" />
          </div>
        {:else}
          <div class="font-name" style="font-family: {primaryFontFamily};">{primaryFont}</div>
        {/if}
        <div class="font-sample" style="font-family: {primaryFontFamily};">
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz<br>
          0123456789
        </div>
        <div class="font-sample-text" style="font-family: {primaryFontFamily};">
          The quick brown fox jumps over the lazy dog
        </div>
        <div class="font-weights">
          {#each primaryWeights.split(', ') as weight}
            <span>{weight}</span>
          {/each}
        </div>
      </div>
      
      <div class="font-card">
        <div class="font-label">SECONDARY FONT</div>
        {#if isEditable}
          <div class="font-editing-group">
            <input 
              type="text" 
              bind:value={secondaryFont} 
              class="font-name-input" 
              placeholder="Enter font name (e.g., Roboto, Inter, Arial)"
            />
            <input type="text" bind:value={secondaryWeights} class="font-weights-input" placeholder="Regular, Medium" />
          </div>
        {:else}
          <div class="font-name" style="font-family: {secondaryFontFamily};">{secondaryFont}</div>
        {/if}
        <div class="font-sample" style="font-family: {secondaryFontFamily};">
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz<br>
          0123456789
        </div>
        <div class="font-sample-text" style="font-family: {secondaryFontFamily};">
          The quick brown fox jumps over the lazy dog
        </div>
        <div class="font-weights">
          {#each secondaryWeights.split(', ') as weight}
            <span>{weight}</span>
          {/each}
        </div>
      </div>
    </div>
    
    <div class="hierarchy-card">
      <div class="hierarchy-title">TYPOGRAPHY HIERARCHY</div>
      {#if isEditable}
        <input type="text" bind:value={hierarchyH1} class="hierarchy-input" />
        <input type="text" bind:value={hierarchyH2} class="hierarchy-input" />
        <input type="text" bind:value={hierarchyH3} class="hierarchy-input" />
        <input type="text" bind:value={hierarchyBody} class="hierarchy-input" />
      {:else}
        <div class="hierarchy-item">{hierarchyH1}</div>
        <div class="hierarchy-item">{hierarchyH2}</div>
        <div class="hierarchy-item">{hierarchyH3}</div>
        <div class="hierarchy-item">{hierarchyBody}</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .typography-slide {
    width: 1280px;
    height: 720px;
    position: relative;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
  }
  
  .radial-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
  }
  
  .slide {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    padding: 40px 60px;
  }
  
  .title {
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .divider {
    width: 100%;
    height: 3px;
    background: #8B4513;
    margin-bottom: 25px;
  }
  
  .font-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .font-card {
    flex: 1;
    background: #F8F8F8;
    padding: 25px;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
  }
  
  .font-label {
    font-size: 14px;
    color: #666;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .font-name,
  .font-name-input {
    font-size: 32px;
    font-weight: bold;
    color: #2C2C2C;
    margin-bottom: 5px;
  }
  
  .font-editing-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .font-name-input {
    width: 100%;
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
    padding: 8px;
    background: white;
    font-size: 16px;
    font-weight: bold;
  }
  
  .font-weights-input {
    width: 100%;
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
    padding: 6px;
    background: white;
    font-size: 14px;
  }
  
  .font-sample {
    font-size: 16px;
    color: #2C2C2C;
    line-height: 1.4;
    margin-bottom: 8px;
  }
  
  .font-sample-text {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
    font-style: italic;
    margin-bottom: 10px;
  }
  
  .font-weights {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  
  .font-weights span {
    background: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #2C2C2C;
  }
  
  .hierarchy-card {
    background: #F8F8F8;
    padding: 25px;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
  }
  
  .hierarchy-title {
    font-size: 14px;
    color: #666;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .hierarchy-item {
    margin-bottom: 10px;
    font-size: 13px;
    color: #2C2C2C;
  }
  
  .hierarchy-input {
    width: 100%;
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
    padding: 6px;
    background: white;
    font-size: 13px;
    margin-bottom: 10px;
    color: #2C2C2C;
  }
</style>

