<script lang="ts">
  import type { SlideData } from '$lib/types/slide-data';
  
  export let brandName: string = 'Brand Name';
  export let logoUrl: string = '';
  export let logoData: string = '';
  export let color1Hex: string = '#1E40AF'; // PRIMARY_COLOR (for title)
  export let color4Hex: string = '#93C5FD'; // SECONDARY_COLOR
  export let color1Lighter: string = '#EFF6FF';
  export let color2Lighter: string = '#DBEAFE';
  export let color3Lighter: string = '#BFDBFE';
  export let color4Lighter: string = '#93C5FD';
  export let color1Rgba10: string = 'rgba(30, 64, 175, 0.1)';
  export let color3Rgba10: string = 'rgba(96, 165, 250, 0.1)';
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
      colors: [color1Lighter, color2Lighter, '#FFFFFF', color3Lighter, color4Lighter, '#FFFFFF'],
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
      return `linear-gradient(135deg, ${color1Lighter} 0%, ${color2Lighter} 20%, #FFFFFF 50%, ${color3Lighter} 70%, ${color4Lighter} 90%, #FFFFFF 100%)`;
    }
  })();
  
  // Editable DO card content
  export let doCard1Title: string = 'Use Approved Colors';
  export let doCard1Hint: string = 'Apply only {color1Hex} and {color4Hex} per brand palette.';
  export let doCard2Title: string = 'Maintain Clear Space';
  export let doCard2Hint: string = 'Keep minimum clear space around logo (≥ 10% of logo width).';
  export let doCard3Title: string = 'Respect Minimum Size';
  export let doCard3Hint: string = 'Never display the logo smaller than the specified minimum height.';
  export let doCard4Title: string = 'Ensure Contrast';
  export let doCard4Hint: string = 'Use sufficient contrast with backgrounds to maintain readability.';
  
  // Editable guidelines
  export let guidelinesTitle: string = 'Usage Guidelines';
  export let guideline1: string = 'Use only approved color combinations and backgrounds.';
  export let guideline2: string = 'Maintain clear space around the logo on all sides.';
  export let guideline3: string = 'Scale proportionally; adhere to minimum size constraints.';
  export let guideline4: string = 'Place on clean, uncluttered backgrounds with strong contrast.';
  
  // Dynamic styles computed from props
  $: radialOverlayStyle = `radial-gradient(circle at 25% 25%, ${color1Rgba10} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${color3Rgba10} 0%, transparent 50%)`;
  $: headerBorderStyle = `4px solid ${color1Hex}`;
  $: titleColorStyle = color1Hex; // HTML uses {{PRIMARY_COLOR}} for title
  $: guidelinesTitleColorStyle = color1Hex;
  $: logoDemoGradient = `linear-gradient(135deg, #111 0%, ${color1Hex} 100%)`;
  
  $: slideData = createSlideData();
  
  // Helper function to blend two colors for gradient effect
  function blendColors(color1: string, color2: string): string {
    // Remove # if present
    const c1 = color1.replace('#', '');
    const c2 = color2.replace('#', '');
    
    // Convert to RGB
    const r1 = parseInt(c1.substring(0, 2), 16);
    const g1 = parseInt(c1.substring(2, 4), 16);
    const b1 = parseInt(c1.substring(4, 6), 16);
    const r2 = parseInt(c2.substring(0, 2), 16);
    const g2 = parseInt(c2.substring(2, 4), 16);
    const b2 = parseInt(c2.substring(4, 6), 16);
    
    // Blend (50% mix)
    const r = Math.round((r1 + r2) / 2);
    const g = Math.round((g1 + g2) / 2);
    const b = Math.round((b1 + b2) / 2);
    
    // Convert back to hex
    return ((r << 16) | (g << 8) | b).toString(16).toUpperCase().padStart(6, '0');
  }
  
  function createSlideData(): SlideData {
    // Helper: Convert pixels to inches (1280px = 10in, 720px = 5.625in)
    const pxToIn = (px: number) => (px / 1280) * 10;
    const pyToIn = (py: number) => (py / 720) * 5.625;
    
    const elements: SlideData['elements'] = [];
    
    // Slide padding: 60px left/right, 40px top
    const paddingX = pxToIn(60); // ~0.47in
    const paddingY = pyToIn(40); // ~0.28in
    const headerHeight = pyToIn(100); // Header + margin ~100px
    
    // Title (in header)
    elements.push({
      id: 'title',
      type: 'text' as const,
      position: { x: paddingX, y: paddingY, w: 10 - (paddingX * 2), h: pyToIn(42) },
      text: 'Logo Do\'s',
      fontSize: 36,
      fontFace: 'Arial',
      bold: true,
      color: color1Hex.replace('#', ''),
      align: 'left' as const,
      valign: 'top' as const,
      zIndex: 3
    });
    
    // Divider line
    elements.push({
      id: 'divider',
      type: 'shape' as const,
      position: { x: paddingX, y: paddingY + pyToIn(60), w: 10 - (paddingX * 2), h: pyToIn(4) },
      shapeType: 'rect',
      fillColor: color1Hex.replace('#', ''),
      lineColor: color1Hex.replace('#', ''),
      lineWidth: 0,
      zIndex: 3
    });
    
    // Content area starts after header
    // UI uses grid: grid-template-columns: 1.6fr 1fr (examples on left, guidelines on right)
    const contentStartY = paddingY + headerHeight;
    const contentWidth = 10 - (paddingX * 2);
    const contentHeight = 5.625 - contentStartY - paddingY;
    
    // Left column: Examples (1.6fr out of 2.6fr total = ~61.5%)
    const examplesColWidth = contentWidth * (1.6 / 2.6);
    const guidelinesColWidth = contentWidth * (1.0 / 2.6);
    const columnGap = pxToIn(32); // gap: 32px from UI
    
    // Examples grid: 2x2 cards with proper spacing to prevent overlap
    // Calculate card dimensions to fit within available space
    const cardGap = pxToIn(28); // Gap between cards
    const rowGap = pyToIn(28); // Gap between rows
    const cardWidth = (examplesColWidth - cardGap) / 2;
    // Calculate card height to fit 2 rows within available content height
    const cardHeight = (contentHeight - rowGap) / 2;
    const cardsStartX = paddingX; // Left column starts at padding
    const cardsStartY = contentStartY;
    
    // DO example cards in 2x2 grid (use exported props)
    const doExamples = [
      { title: doCard1Title, desc: 'Always use the official brand colors', hint: doCard1Hint.replace('{color1Hex}', color1Hex).replace('{color4Hex}', color4Hex) },
      { title: doCard2Title, desc: 'Keep 10% padding around the logo', hint: doCard2Hint },
      { title: doCard3Title, desc: 'Never display the logo smaller than the specified minimum height', hint: doCard3Hint },
      { title: doCard4Title, desc: 'Use sufficient contrast with backgrounds to maintain readability', hint: doCard4Hint }
    ];
    
    doExamples.forEach((example, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const cardX = cardsStartX + col * (cardWidth + cardGap);
      const cardY = cardsStartY + row * (cardHeight + rowGap);
      
      // Card background
      elements.push({
        id: `do-card-${index}`,
        type: 'shape' as const,
        position: { x: cardX, y: cardY, w: cardWidth, h: cardHeight },
        shapeType: 'rect',
        fillColor: 'FFFFFF',
        lineColor: 'E0E0E0',
        lineWidth: 1,
        zIndex: 1
      });
      
      // Card header area
      const cardPadding = pxToIn(20);
      const badgeWidth = pxToIn(60);
      const badgeHeight = pyToIn(30);
      
      // DO badge (green background like UI: #D1FAE5 with #10B981 border)
      elements.push({
        id: `do-badge-${index}`,
        type: 'shape' as const,
        position: { x: cardX + cardPadding, y: cardY + cardPadding, w: badgeWidth, h: badgeHeight },
        shapeType: 'rect',
        fillColor: 'D1FAE5', // Light green background (#D1FAE5)
        lineColor: '10B981', // Green border (#10B981)
        lineWidth: 2,
        zIndex: 2
      });
      elements.push({
        id: `do-badge-text-${index}`,
        type: 'text' as const,
        position: { x: cardX + cardPadding, y: cardY + cardPadding, w: badgeWidth, h: badgeHeight },
        text: 'DO',
        fontSize: 11,
        fontFace: 'Arial',
        bold: true,
        color: '065F46', // Dark green text (#065F46)
        align: 'center' as const,
        valign: 'middle' as const,
        zIndex: 3
      });
      
      // Card title (next to badge)
      elements.push({
        id: `do-title-${index}`,
        type: 'text' as const,
        position: { x: cardX + cardPadding + badgeWidth + pxToIn(10), y: cardY + cardPadding, w: cardWidth - cardPadding * 2 - badgeWidth - pxToIn(10), h: badgeHeight },
        text: example.title,
        fontSize: 14,
        fontFace: 'Arial',
        bold: true,
        color: '333333',
        align: 'left' as const,
        valign: 'middle' as const,
        zIndex: 2
      });
      
      // Logo demo area (centered in card, below header)
      // Calculate available space: card height - padding - badge - gap - hint space
      const availableHeight = cardHeight - (cardPadding * 2) - badgeHeight - pyToIn(12) - pyToIn(35); // Reserve 35px for hint
      // Match UI: .logo-demo has height: 140px (or 100px for card 3), but respect available space
      let logoAreaHeight = Math.min(pyToIn(140), availableHeight); // Default height (140px) but not more than available
      if (index === 2) {
        // Third card: smaller height (100px as per UI style="height: 100px;")
        logoAreaHeight = Math.min(pyToIn(100), availableHeight);
      }
      // Logo demo area spans full card width (card padding already accounted for in cardX)
      const logoAreaWidth = cardWidth - (cardPadding * 2); // Full card width minus padding
      const logoAreaY = cardY + cardPadding + badgeHeight + pyToIn(12); // 12px gap from badge
      const logoAreaX = cardX + cardPadding; // Start from card's inner edge
      
      // Add padding inside logo area to prevent image from stretching to edges
      const logoInnerPadding = pxToIn(8);
      const logoImageWidth = logoAreaWidth - (logoInnerPadding * 2);
      const logoImageHeight = logoAreaHeight - (logoInnerPadding * 2);
      const logoImageX = logoAreaX + logoInnerPadding;
      const logoImageY = logoAreaY + logoInnerPadding;
      
      // Logo demo background (different for each example)
      if (index === 0) {
        // First card: Light gray background (#f8f9fa)
        elements.push({
          id: `do-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: 'F8F9FA',
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
      } else if (index === 1) {
        // Second card: Light gray with dashed border (clear space indicator)
        // Background
        elements.push({
          id: `do-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: 'F8F9FA',
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
        // Clear space indicator (dashed border - UI: inset 8px, 3px dashed rgba(0,0,0,0.3))
        // Since PPTX doesn't support dashed borders well, use a visible border rectangle
        const clearSpaceMargin = pxToIn(8);
        // Add border rectangle to show clear space area - this appears behind the logo
        elements.push({
          id: `do-clear-space-${index}`,
          type: 'shape' as const,
          position: { 
            x: logoAreaX + clearSpaceMargin, 
            y: logoAreaY + clearSpaceMargin, 
            w: logoAreaWidth - (clearSpaceMargin * 2), 
            h: logoAreaHeight - (clearSpaceMargin * 2) 
          },
          shapeType: 'rect',
          fillColor: 'F8F9FA', // Match background (transparent effect)
          lineColor: '999999', // Gray border (rgba(0,0,0,0.3) approximated)
          lineWidth: 2, // 2-3px border
          zIndex: 1 // Behind logo image (zIndex 3)
        });
      } else if (index === 3) {
        // Fourth card: Gradient background
        // UI: linear-gradient(135deg, #111 0%, primaryColor 100%)
        // This creates a dark to primary color gradient (diagonal)
        // Base: dark color (#111)
        elements.push({
          id: `do-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: '111111', // Dark start (#111)
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
        // Gradient: primary color covering most of the area (diagonal from top-left)
        // For 135deg, gradient goes from top-left to bottom-right
        elements.push({
          id: `do-logo-bg-gradient-${index}`,
          type: 'shape' as const,
          position: { 
            x: logoAreaX + (logoAreaWidth * 0.3), 
            y: logoAreaY + (logoAreaHeight * 0.3), 
            w: logoAreaWidth * 0.7, 
            h: logoAreaHeight * 0.7 
          },
          shapeType: 'rect',
          fillColor: color1Hex.replace('#', ''),
          lineColor: '00000000',
          lineWidth: 0,
          zIndex: 1
        });
      } else {
        // Third card: Light gray background
        elements.push({
          id: `do-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: 'F8F9FA',
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
      }
      
      // Logo image or text (on top of background, centered in area with padding)
      // Images should maintain aspect ratio and not stretch
      if (logoData || logoUrl) {
        // Image with inner padding to prevent stretching to edges
        // Use square aspect ratio constraint to prevent distortion
        const logoSize = Math.min(logoImageWidth, logoImageHeight);
        const logoCenteredX = logoImageX + (logoImageWidth - logoSize) / 2;
        const logoCenteredY = logoImageY + (logoImageHeight - logoSize) / 2;
        
        elements.push({
          id: `do-logo-${index}`,
          type: 'image' as const,
          position: { 
            x: logoCenteredX, 
            y: logoCenteredY, 
            w: logoSize, 
            h: logoSize
          },
          imageData: logoData || undefined,
          imageSrc: logoUrl || undefined,
          zIndex: 3
        });
      } else {
        // Fallback text (centered)
        elements.push({
          id: `do-logo-text-${index}`,
          type: 'text' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          text: brandName,
          fontSize: 16,
          fontFace: 'Arial',
          bold: true,
          color: index === 3 ? 'FFFFFF' : color1Hex.replace('#', ''), // White text on gradient background
          align: 'center' as const,
          valign: 'middle' as const,
          zIndex: 3
        });
      }
      
      // Hint text (below logo with proper spacing to avoid overlap)
      // Calculate hint position to ensure it fits within card bounds and doesn't overlap
      const hintY = logoAreaY + logoAreaHeight + pyToIn(10);
      const hintMaxHeight = cardY + cardHeight - hintY - pyToIn(10); // Leave 10px margin at bottom
      const hintHeight = Math.min(pyToIn(25), hintMaxHeight); // Fixed height but respect card bounds
      
      // Only add hint if there's enough space (at least 15px)
      if (hintHeight > pyToIn(15)) {
        elements.push({
          id: `do-hint-${index}`,
          type: 'text' as const,
          position: { 
            x: cardX + cardPadding, 
            y: hintY, 
            w: cardWidth - cardPadding * 2, 
            h: hintHeight
          },
          text: example.hint,
          fontSize: 9,
          fontFace: 'Arial',
          italic: true,
          color: '999999',
          align: 'left' as const,
          valign: 'top' as const,
          zIndex: 2
        });
      }
    });
    
    // Right column: Guidelines section
    const guidelinesX = cardsStartX + examplesColWidth + columnGap;
    const guidelinesY = contentStartY;
    const guidelinesHeight = contentHeight;
    
    // Guidelines section background (white card)
    elements.push({
      id: 'guidelines-section-bg',
      type: 'shape' as const,
      position: { x: guidelinesX, y: guidelinesY, w: guidelinesColWidth, h: guidelinesHeight },
      shapeType: 'rect',
      fillColor: 'FFFFFF',
      lineColor: 'E0E0E0',
      lineWidth: 1,
      zIndex: 1
    });
    
    // Guidelines section title
    const guidelinesPadding = pxToIn(24);
    elements.push({
      id: 'guidelines-title',
      type: 'text' as const,
      position: { x: guidelinesX + guidelinesPadding, y: guidelinesY + guidelinesPadding, w: guidelinesColWidth - (guidelinesPadding * 2), h: pyToIn(18) },
      text: 'Usage Guidelines',
      fontSize: 16,
      fontFace: 'Arial',
      bold: true,
      color: color1Hex.replace('#', ''),
      align: 'left' as const,
      valign: 'top' as const,
      zIndex: 2
    });
    
    const guidelineItems = [
      'Use only approved color combinations and backgrounds.',
      'Maintain clear space around the logo on all sides.',
      'Scale proportionally; adhere to minimum size constraints.',
      'Place on clean, uncluttered backgrounds with strong contrast.'
    ];
    
    guidelineItems.forEach((item, index) => {
      elements.push({
        id: `guideline-${index}`,
        type: 'text' as const,
        position: { 
          x: guidelinesX + guidelinesPadding + pxToIn(26), // Padding for checkmark
          y: guidelinesY + guidelinesPadding + pyToIn(30) + (index * pyToIn(22)), 
          w: guidelinesColWidth - (guidelinesPadding * 2) - pxToIn(26), 
          h: pyToIn(16) 
        },
        text: item,
        fontSize: 12,
        fontFace: 'Arial',
        color: '555555',
        align: 'left' as const,
        valign: 'top' as const,
        zIndex: 2
      });
      
      // Add checkmark (✓)
      elements.push({
        id: `guideline-check-${index}`,
        type: 'text' as const,
        position: { 
          x: guidelinesX + guidelinesPadding, 
          y: guidelinesY + guidelinesPadding + pyToIn(30) + (index * pyToIn(22)), 
          w: pxToIn(20), 
          h: pyToIn(16) 
        },
        text: '✓',
        fontSize: 14,
        fontFace: 'Arial',
        bold: true,
        color: '10B981', // Green checkmark
        align: 'left' as const,
        valign: 'top' as const,
        zIndex: 2
      });
    });
    
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
        color1Lighter,
        color2Lighter,
        'FFFFFF',
        color3Lighter,
        color4Lighter,
        'FFFFFF'
      ].filter(c => c != null && typeof c === 'string');
      
      bgColors = fallbackColors.length > 0
        ? fallbackColors.map(c => (c || '').replace('#', ''))
        : ['FFFFFF', 'F0F0F0', 'FFFFFF', 'E0E0E0', 'D0D0D0', 'FFFFFF'];
    }
    
    return {
      id: 'logo-dos',
      type: 'logo',
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
      elements
    };
  }
  
  // Always call createSlideData() to get the latest values (including edited content)
  export function getSlideData(): SlideData {
    return createSlideData();
  }
</script>

<div class="logo-dos-slide" style="background: {backgroundStyle};">
  <div class="radial-overlay" style="background: {radialOverlayStyle};"></div>
  
  <div class="slide">
    <div class="header" style="border-bottom: {headerBorderStyle};">
      <div class="title" style="color: {titleColorStyle};">Logo Do's</div>
    </div>
    
    <div class="content">
      <div class="examples">
        <div class="example-card">
          <div class="card-header">
            <div class="badge-do">DO</div>
            {#if isEditable}
              <input type="text" bind:value={doCard1Title} class="card-title-input" />
            {:else}
              <div class="card-title">{doCard1Title}</div>
            {/if}
          </div>
          <div class="logo-demo" class:editable={isEditable}>
            {#if isEditable}
              <label class="logo-upload-label">
                {#if logoData}
                  <img src={logoData} alt="{brandName} Logo" />
                {:else if logoUrl}
                  <img src={logoUrl} alt="{brandName} Logo" />
                {:else}
                  <div class="logo-upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <span class="upload-text">Upload</span>
                  </div>
                {/if}
                <input 
                  type="file" 
                  accept="image/*"
                  onchange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        logoData = event.target?.result as string;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  class="logo-upload-input"
                />
              </label>
            {:else}
              {#if logoData}
                <img src={logoData} alt="{brandName} Logo" />
              {:else if logoUrl}
                <img src={logoUrl} alt="{brandName} Logo" />
              {:else}
                <div class="logo-placeholder">{brandName}</div>
              {/if}
            {/if}
          </div>
          {#if isEditable}
            <textarea bind:value={doCard1Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{doCard1Hint.replace('{color1Hex}', color1Hex).replace('{color4Hex}', color4Hex)}</div>
          {/if}
        </div>
        
        <div class="example-card">
          <div class="card-header">
            <div class="badge-do">DO</div>
            {#if isEditable}
              <input type="text" bind:value={doCard2Title} class="card-title-input" />
            {:else}
              <div class="card-title">{doCard2Title}</div>
            {/if}
          </div>
          <div class="logo-demo" style="position: relative;">
            <div class="clear-space-indicator"></div>
            {#if logoData}
              <img src={logoData} alt="{brandName} Logo" />
            {:else if logoUrl}
              <img src={logoUrl} alt="{brandName} Logo" />
            {:else}
              <div class="logo-placeholder">{brandName}</div>
            {/if}
          </div>
          {#if isEditable}
            <textarea bind:value={doCard2Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{doCard2Hint}</div>
          {/if}
        </div>
        
        <div class="example-card">
          <div class="card-header">
            <div class="badge-do">DO</div>
            {#if isEditable}
              <input type="text" bind:value={doCard3Title} class="card-title-input" />
            {:else}
              <div class="card-title">{doCard3Title}</div>
            {/if}
          </div>
          <div class="logo-demo" style="height: 100px;">
            {#if logoData}
              <img src={logoData} alt="{brandName} Logo" />
            {:else if logoUrl}
              <img src={logoUrl} alt="{brandName} Logo" />
            {:else}
              <div class="logo-placeholder">{brandName}</div>
            {/if}
          </div>
          {#if isEditable}
            <textarea bind:value={doCard3Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{doCard3Hint}</div>
          {/if}
        </div>
        
        <div class="example-card">
          <div class="card-header">
            <div class="badge-do">DO</div>
            {#if isEditable}
              <input type="text" bind:value={doCard4Title} class="card-title-input" />
            {:else}
              <div class="card-title">{doCard4Title}</div>
            {/if}
          </div>
          <div class="logo-demo" style="background: {logoDemoGradient};">
            {#if logoData}
              <img src={logoData} alt="{brandName} Logo" />
            {:else if logoUrl}
              <img src={logoUrl} alt="{brandName} Logo" />
            {:else}
              <div class="logo-placeholder">{brandName}</div>
            {/if}
          </div>
          {#if isEditable}
            <textarea bind:value={doCard4Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{doCard4Hint}</div>
          {/if}
        </div>
      </div>
      
      <div class="guidelines">
        {#if isEditable}
          <input type="text" bind:value={guidelinesTitle} class="guidelines-title-input" style="color: {guidelinesTitleColorStyle};" />
        {:else}
          <div class="guidelines-title" style="color: {guidelinesTitleColorStyle};">{guidelinesTitle}</div>
        {/if}
        {#if isEditable}
          <input type="text" bind:value={guideline1} class="guideline-item-input" />
          <input type="text" bind:value={guideline2} class="guideline-item-input" />
          <input type="text" bind:value={guideline3} class="guideline-item-input" />
          <input type="text" bind:value={guideline4} class="guideline-item-input" />
        {:else}
          <div class="guideline-item">{guideline1}</div>
          <div class="guideline-item">{guideline2}</div>
          <div class="guideline-item">{guideline3}</div>
          <div class="guideline-item">{guideline4}</div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .logo-dos-slide {
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
  
  .header {
    padding-bottom: 15px;
    margin-bottom: 30px;
  }
  
  .title {
    font-size: 42px;
    font-weight: bold;
  }
  
  .content {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 32px;
    height: calc(100% - 100px);
  }
  
  .examples {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .example-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .badge-do {
    background: #D1FAE5;
    color: #065F46;
    border: 2px solid #10B981;
    font-weight: bold;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  
  .logo-demo {
    height: 140px;
    border-radius: 10px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    position: relative;
    border: 1px solid #e5e7eb;
  }
  
  .logo-demo img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .logo-demo.editable {
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .logo-demo.editable:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }
  
  .logo-upload-label {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
  }
  
  .logo-upload-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .logo-upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #666;
  }
  
  .upload-icon {
    font-size: 32px;
  }
  
  .upload-text {
    font-size: 12px;
    font-weight: 500;
  }
  
  .logo-placeholder {
    font-size: 24px;
    font-weight: bold;
    color: #666;
  }
  
  .clear-space-indicator {
    position: absolute;
    inset: 8px;
    border: 3px dashed rgba(0,0,0,0.3);
    border-radius: 8px;
    pointer-events: none;
  }
  
  .hint {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
  }
  
  .guidelines {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  
  .guidelines-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .guideline-item {
    font-size: 14px;
    color: #555;
    line-height: 1.7;
    padding-left: 26px;
    position: relative;
    margin-bottom: 10px;
  }
  
  .guideline-item::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #10B981;
    font-weight: bold;
  }
  
  .card-title-input {
    width: 100%;
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
    padding: 4px;
    background: white;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  
  .hint-input {
    width: 100%;
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
    padding: 4px;
    background: white;
    font-size: 12px;
    color: #666;
    resize: vertical;
    min-height: 40px;
  }
  
  .guidelines-title-input {
    width: 100%;
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
    padding: 8px;
    background: white;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .guideline-item-input {
    width: 100%;
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
    padding: 6px;
    background: white;
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
    padding-left: 26px;
  }
</style>

