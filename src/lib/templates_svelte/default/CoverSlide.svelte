<script lang="ts">
  import type { SlideData } from '$lib/types/slide-data';
  
  export let brandName: string = 'Brand Name';
  export let tagline: string = 'Brand Guidelines';
  export let date: string = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  export let color1Hex: string = '#1E40AF'; // PRIMARY_COLOR
  export let color2Hex: string = '#3B82F6'; // COLOR_2_HEX
  export let color3Hex: string = '#60A5FA'; // COLOR_3_HEX
  export let color4Hex: string = '#93C5FD'; // SECONDARY_COLOR
  export let logoData: string = ''; // base64 image data
  export let isEditable: boolean = false;
  
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
      colors: [color1Hex, color2Hex, color3Hex, color4Hex],
      direction: 135
    }
  };
  
  // Background style (reactive to background prop changes)
  // HTML template: linear-gradient(135deg, {{PRIMARY_COLOR}} 0%, {{COLOR_2_HEX}} 30%, {{COLOR_3_HEX}} 60%, {{SECONDARY_COLOR}} 100%)
  $: backgroundStyle = (() => {
    if (background && background.type === 'color' && background.color) {
      return background.color;
    } else if (background && background.type === 'gradient' && background.gradient && background.gradient.colors && background.gradient.colors.length > 0) {
      const colors = background.gradient.colors;
      const stops = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(', ');
      return `linear-gradient(${background.gradient.direction || 135}deg, ${stops})`;
    } else {
      // Fallback to default gradient matching HTML template
      return `linear-gradient(135deg, ${color1Hex} 0%, ${color2Hex} 30%, ${color3Hex} 60%, ${color4Hex} 100%)`;
    }
  })();
  
  // Editable state
  $: slideData = createSlideData();
  
  function createSlideData(): SlideData {
    // Use the current background prop (which may have been edited)
    let bgColors: string[] = [];
    let bgDirection = 135;
    
    if (background && background.type === 'gradient' && background.gradient && background.gradient.colors) {
      // Filter out undefined/null values and ensure all colors are strings
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
        color1Hex,
        color2Hex,
        color3Hex,
        color4Hex
      ].filter(c => c != null && typeof c === 'string');
      
      bgColors = fallbackColors.length > 0
        ? fallbackColors.map(c => (c || '').replace('#', ''))
        : ['000000', '333333', '666666', '999999']; // Ultimate fallback
    }
    
    return {
      id: 'cover-slide',
      type: 'cover',
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
        // Brand name
        {
          id: 'brand-name',
          type: 'text' as const,
          position: { x: 0.5, y: 2.0, w: 9, h: 1.5 },
          text: brandName.toUpperCase(),
          fontSize: 64,
          fontFace: 'Arial',
          bold: true,
          color: 'FFFFFF',
          align: 'center' as const,
          valign: 'middle' as const,
          zIndex: 2
        },
        // Tagline
        {
          id: 'tagline',
          type: 'text' as const,
          position: { x: 0.5, y: 3.6, w: 9, h: 0.6 },
          text: tagline,
          fontSize: 32,
          fontFace: 'Arial',
          color: 'FFFFFF',
          align: 'center' as const,
          valign: 'middle' as const,
          zIndex: 2
        },
        // Date
        {
          id: 'date',
          type: 'text' as const,
          position: { x: 0.5, y: 4.6, w: 9, h: 0.4 },
          text: date,
          fontSize: 16,
          fontFace: 'Arial',
          color: 'FFFFFF',
          align: 'center' as const,
          valign: 'middle' as const,
          zIndex: 2
        }
      ]
    };
  }
  
  // Export function to get slide data for PPTX conversion
  // Always call createSlideData() to get the latest values (including edited content)
  export function getSlideData(): SlideData {
    return createSlideData();
  }
</script>

<div class="cover-slide" style="background: {backgroundStyle};">
  <div class="radial-overlay"></div>
  
  <div class="slide-content">
    {#if isEditable}
      <input
        type="text"
        bind:value={brandName}
        class="brand-name-input"
        placeholder="Brand Name"
      />
    {:else}
      <div class="brand-name">{brandName}</div>
    {/if}
    
    {#if isEditable}
      <input
        type="text"
        bind:value={tagline}
        class="subtitle-input"
        placeholder="Tagline"
      />
    {:else}
      <div class="subtitle">{tagline}</div>
    {/if}
    
    {#if isEditable}
      <input
        type="text"
        bind:value={date}
        class="date-input"
        placeholder="Date"
      />
    {:else}
      <div class="date">{date}</div>
    {/if}
  </div>
</div>

<style>
  .cover-slide {
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
    background: 
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
  
  .slide-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px;
  }
  
  .brand-name,
  .brand-name-input {
    font-size: 72px;
    font-weight: bold;
    color: #FFFFFF;
    margin-bottom: 20px;
    text-transform: uppercase;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    max-width: 1000px;
  }
  
  .brand-name-input {
    border: 2px dashed rgba(255,255,255,0.5);
    border-radius: 4px;
    padding: 10px;
    background: rgba(0,0,0,0.2);
  }
  
  .subtitle,
  .subtitle-input {
    font-size: 36px;
    color: #FFFFFF;
    margin-bottom: 40px;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    max-width: 800px;
  }
  
  .subtitle-input {
    border: 2px dashed rgba(255,255,255,0.5);
    border-radius: 4px;
    padding: 8px;
    background: rgba(0,0,0,0.2);
  }
  
  .date,
  .date-input {
    font-size: 18px;
    color: rgba(255,255,255,0.9);
    margin-top: 60px;
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
  }
  
  .date-input {
    border: 2px dashed rgba(255,255,255,0.5);
    border-radius: 4px;
    padding: 6px;
    background: rgba(0,0,0,0.2);
  }
</style>

