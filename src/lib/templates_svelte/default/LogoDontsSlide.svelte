<script lang="ts">
  import type { SlideData } from '$lib/types/slide-data';
  
  export let brandName: string = 'Brand Name';
  export let logoUrl: string = '';
  export let logoData: string = '';
  export let color1Hex: string = '#1E40AF'; // PRIMARY_COLOR (for title)
  export let color2Lighter: string = '#DBEAFE';
  export let color3Lighter: string = '#BFDBFE';
  export let color4Lighter: string = '#93C5FD';
  export let color5Lighter: string = '#60A5FA';
  export let color2Rgba12: string = 'rgba(59, 130, 246, 0.12)';
  export let color4Rgba12: string = 'rgba(147, 197, 253, 0.12)';
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
      colors: [color2Lighter, color3Lighter, '#FFFFFF', color4Lighter, color5Lighter, '#FFFFFF'],
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
      return `linear-gradient(135deg, ${color2Lighter} 0%, ${color3Lighter} 15%, #FFFFFF 45%, ${color4Lighter} 65%, ${color5Lighter} 85%, #FFFFFF 100%)`;
    }
  })();
  
  // Editable DON'T card content
  export let dontCard1Title: string = 'Do Not Stretch or Distort';
  export let dontCard1Hint: string = 'Always maintain original proportions; avoid non-uniform scaling.';
  export let dontCard2Title: string = 'Do Not Change Colors';
  export let dontCard2Hint: string = 'Never use unapproved colors outside the brand palette.';
  export let dontCard3Title: string = 'Do Not Add Effects';
  export let dontCard3Hint: string = 'Avoid shadows, glows, outlines, or other decorative effects.';
  export let dontCard4Title: string = 'Do Not Place on Busy Backgrounds';
  export let dontCard4Hint: string = 'Avoid low-contrast or cluttered backgrounds that reduce legibility.';
  
  // Editable guidelines
  export let guidelinesTitle: string = 'Usage Restrictions';
  export let guideline1: string = 'Do not stretch, rotate, skew, or alter proportions.';
  export let guideline2: string = 'Do not modify colors beyond approved brand palette.';
  export let guideline3: string = 'Do not add outlines, shadows, or visual effects.';
  export let guideline4: string = 'Do not place over complex imagery or low-contrast backgrounds.';
  
  // Dynamic styles computed from props
  $: headerBorderStyle = `4px solid ${color1Hex}`;
  $: titleColorStyle = color1Hex; // HTML uses {{PRIMARY_COLOR}} for title
  $: guidelinesTitleColorStyle = color1Hex;
  $: radialOverlayStyle = `radial-gradient(ellipse at top left, ${color2Rgba12} 0%, transparent 55%), radial-gradient(ellipse at bottom right, ${color4Rgba12} 0%, transparent 55%)`;
  
  $: slideData = createSlideData();
  
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
      text: 'Logo Don\'ts',
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
    
    // DON'T example cards in 2x2 grid
    const dontExamples = [
      { title: 'Do Not Stretch or Distort', hint: 'Always maintain original proportions; avoid non-uniform scaling.' },
      { title: 'Do Not Change Colors', hint: 'Never use unapproved colors outside the brand palette.' },
      { title: 'Do Not Add Effects', hint: 'Avoid shadows, glows, outlines, or other decorative effects.' },
      { title: 'Do Not Place on Busy Backgrounds', hint: 'Avoid low-contrast or cluttered backgrounds that reduce legibility.' }
    ];
    
    dontExamples.forEach((example, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const cardX = cardsStartX + col * (cardWidth + cardGap);
      const cardY = cardsStartY + row * (cardHeight + rowGap);
      
      // Card background
      elements.push({
        id: `dont-card-${index}`,
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
      const badgeWidth = pxToIn(80);
      const badgeHeight = pyToIn(30);
      
      // DON'T badge (red background like UI: #FEE2E2 with #EF4444 border)
      elements.push({
        id: `dont-badge-${index}`,
        type: 'shape' as const,
        position: { x: cardX + cardPadding, y: cardY + cardPadding, w: badgeWidth, h: badgeHeight },
        shapeType: 'rect',
        fillColor: 'FEE2E2', // Light red background (#FEE2E2)
        lineColor: 'EF4444', // Red border (#EF4444)
        lineWidth: 2,
        zIndex: 2
      });
      elements.push({
        id: `dont-badge-text-${index}`,
        type: 'text' as const,
        position: { x: cardX + cardPadding, y: cardY + cardPadding, w: badgeWidth, h: badgeHeight },
        text: 'DON\'T',
        fontSize: 10,
        fontFace: 'Arial',
        bold: true,
        color: '991B1B', // Dark red text (#991B1B)
        align: 'center' as const,
        valign: 'middle' as const,
        zIndex: 3
      });
      
      // Card title (next to badge)
      elements.push({
        id: `dont-title-${index}`,
        type: 'text' as const,
        position: { x: cardX + cardPadding + badgeWidth + pxToIn(10), y: cardY + cardPadding, w: cardWidth - cardPadding * 2 - badgeWidth - pxToIn(10), h: badgeHeight },
        text: example.title,
        fontSize: 13,
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
      // Match UI: .logo-demo has height: 140px, but respect available space
      const logoAreaHeight = Math.min(pyToIn(140), availableHeight); // 140px height but not more than available
      // Logo area should take full card width (card has padding: 20px)
      // In UI, logo-demo is full width of card (no explicit width, so 100%)
      const logoAreaWidth = cardWidth - (cardPadding * 2); // Full card width minus card padding
      const logoAreaY = cardY + cardPadding + badgeHeight + pyToIn(12); // 12px margin-bottom from UI
      const logoAreaX = cardX + cardPadding; // Start from card padding (full width)
      
      // Logo demo background (different for each example)
      if (index === 0) {
        // First card: Light gray background (stretched logo)
        elements.push({
          id: `dont-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: 'F8F9FA',
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
      } else if (index === 1) {
        // Second card: Wrong colors gradient (#A855F7 to #F97316)
        elements.push({
          id: `dont-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: 'A855F7', // Purple
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
        // Gradient overlay (orange)
        elements.push({
          id: `dont-logo-bg-gradient-${index}`,
          type: 'shape' as const,
          position: { 
            x: logoAreaX, 
            y: logoAreaY + (logoAreaHeight * 0.5), 
            w: logoAreaWidth, 
            h: logoAreaHeight * 0.5 
          },
          shapeType: 'rect',
          fillColor: 'F97316', // Orange
          lineColor: '00000000',
          lineWidth: 0,
          zIndex: 1
        });
      } else if (index === 2) {
        // Third card: Light gray background (effects - can't replicate in PPTX)
        elements.push({
          id: `dont-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: 'F8F9FA',
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
      } else if (index === 3) {
        // Fourth card: Busy pattern background (repeating-linear-gradient 45deg)
        // UI: repeating-linear-gradient(45deg, #222 10px, #555 10px, #555 20px)
        // Simplified: use a textured dark background with subtle pattern
        elements.push({
          id: `dont-logo-bg-${index}`,
          type: 'shape' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          shapeType: 'rect',
          fillColor: '333333', // Dark gray base (darker than #222 for visibility)
          lineColor: 'E5E7EB',
          lineWidth: 1,
          zIndex: 1
        });
        // Add a few diagonal stripes to create pattern effect (simplified)
        // Create 3-4 diagonal stripes instead of many to avoid performance issues
        const stripeWidth = pxToIn(12);
        for (let i = 0; i < 4; i++) {
          const offset = i * stripeWidth * 2;
          const stripeX = logoAreaX - pxToIn(15) + (offset * 0.7);
          const stripeY = logoAreaY - pxToIn(15) + (offset * 0.7);
          if (stripeX < logoAreaX + logoAreaWidth + pxToIn(30)) {
            elements.push({
              id: `dont-pattern-stripe-${index}-${i}`,
              type: 'shape' as const,
              position: { 
                x: Math.max(logoAreaX - pxToIn(5), stripeX), 
                y: Math.max(logoAreaY - pxToIn(5), stripeY), 
                w: stripeWidth, 
                h: (logoAreaWidth + logoAreaHeight) * 1.2 
              },
              shapeType: 'rect',
              fillColor: '555555', // Lighter gray (#555) for stripes
              lineColor: '00000000',
              lineWidth: 0,
              zIndex: 1
            });
          }
        }
      }
      
      // Logo image or text (on top of background with padding to prevent stretching)
      // Add padding inside logo area to prevent image from stretching to edges
      const logoInnerPadding = pxToIn(8);
      const logoImageWidth = logoAreaWidth - (logoInnerPadding * 2);
      const logoImageHeight = logoAreaHeight - (logoInnerPadding * 2);
      const logoImageX = logoAreaX + logoInnerPadding;
      const logoImageY = logoAreaY + logoInnerPadding;
      
      if (logoData || logoUrl) {
        let logoW = logoImageWidth;
        let logoX = logoImageX;
        let logoH = logoImageHeight;
        let logoY = logoImageY;
        
        if (index === 0) {
          // First card: Stretched logo (scaleX 1.25) - widen by 25% but keep height same
          // This simulates horizontal stretching while maintaining vertical aspect
          logoW = logoImageWidth * 1.25;
          logoX = logoImageX - ((logoW - logoImageWidth) / 2);
          // Ensure it stays within card bounds
          const maxX = cardX + cardWidth - cardPadding;
          if (logoX + logoW > maxX) {
            logoW = maxX - logoX;
          }
          if (logoX < cardX + cardPadding) {
            logoX = cardX + cardPadding;
            logoW = Math.min(logoImageWidth * 1.25, maxX - logoX);
          }
        } else {
          // For other cards, use square aspect ratio to prevent stretching
          const logoSize = Math.min(logoImageWidth, logoImageHeight);
          logoW = logoSize;
          logoH = logoSize;
          logoX = logoImageX + (logoImageWidth - logoSize) / 2;
          logoY = logoImageY + (logoImageHeight - logoSize) / 2;
        }
        
        // Image with proper sizing to prevent stretching
        elements.push({
          id: `dont-logo-${index}`,
          type: 'image' as const,
          position: { 
            x: logoX, 
            y: logoY, 
            w: logoW, 
            h: logoH
          },
          imageData: logoData || undefined,
          imageSrc: logoUrl || undefined,
          zIndex: 2
        });
      } else {
        // Fallback text (centered)
        elements.push({
          id: `dont-logo-text-${index}`,
          type: 'text' as const,
          position: { x: logoAreaX, y: logoAreaY, w: logoAreaWidth, h: logoAreaHeight },
          text: brandName,
          fontSize: 16,
          fontFace: 'Arial',
          bold: true,
          color: index === 1 || index === 3 ? 'FFFFFF' : '999999', // White text on dark backgrounds
          align: 'center' as const,
          valign: 'middle' as const,
          zIndex: 2
        });
      }
      
      // Strike-through line (red line through logo area)
      // Positioned like UI: left: 12px, right: 12px, top: 50%, rotated -8deg
      const strikeThickness = pyToIn(4);
      const strikeMargin = pxToIn(12);
      const strikeY = logoAreaY + (logoAreaHeight / 2) - (strikeThickness / 2);
      // Create a wider strike to account for rotation effect
      const strikeW = logoAreaWidth - (strikeMargin * 2);
      const strikeX = logoAreaX + strikeMargin;
      
      elements.push({
        id: `dont-strike-${index}`,
        type: 'shape' as const,
        position: { 
          x: strikeX, 
          y: strikeY, 
          w: strikeW, 
          h: strikeThickness 
        },
        shapeType: 'rect',
        fillColor: 'EF4444', // Red strike-through (#EF4444)
        lineColor: '00000000',
        lineWidth: 0,
        zIndex: 4 // Above logo and background
      });
      
      // Add a second strike line slightly offset to simulate the rotated/diagonal effect
      // Since PPTX doesn't support rotation well, we add a slightly offset line
      elements.push({
        id: `dont-strike-2-${index}`,
        type: 'shape' as const,
        position: { 
          x: strikeX + pxToIn(2), 
          y: strikeY + pyToIn(1), 
          w: strikeW - pxToIn(4), 
          h: strikeThickness 
        },
        shapeType: 'rect',
        fillColor: 'DC2626', // Slightly darker red for depth
        lineColor: '00000000',
        lineWidth: 0,
        zIndex: 4
      });
      
      // Hint text (below logo with proper spacing to avoid overlap)
      // Calculate hint position to ensure it fits within card bounds and doesn't overlap
      const hintY = logoAreaY + logoAreaHeight + pyToIn(10);
      const hintMaxHeight = cardY + cardHeight - hintY - pyToIn(10); // Leave 10px margin at bottom
      const hintHeight = Math.min(pyToIn(25), hintMaxHeight); // Fixed height but respect card bounds
      
      // Only add hint if there's enough space (at least 15px)
      if (hintHeight > pyToIn(15)) {
        elements.push({
          id: `dont-hint-${index}`,
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
      text: guidelinesTitle,
      fontSize: 16,
      fontFace: 'Arial',
      bold: true,
      color: color1Hex.replace('#', ''),
      align: 'left' as const,
      valign: 'top' as const,
      zIndex: 2
    });
    
    // Use exported props
    const guidelineItems = [guideline1, guideline2, guideline3, guideline4];
    
    guidelineItems.forEach((item, index) => {
      elements.push({
        id: `guideline-${index}`,
        type: 'text' as const,
        position: { 
          x: guidelinesX + guidelinesPadding + pxToIn(26), // Padding for X mark
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
      
      // Add X mark (✗)
      elements.push({
        id: `guideline-x-${index}`,
        type: 'text' as const,
        position: { 
          x: guidelinesX + guidelinesPadding, 
          y: guidelinesY + guidelinesPadding + pyToIn(30) + (index * pyToIn(22)), 
          w: pxToIn(20), 
          h: pyToIn(16) 
        },
        text: '✗',
        fontSize: 14,
        fontFace: 'Arial',
        bold: true,
        color: 'EF4444', // Red X mark
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
        color2Lighter,
        color3Lighter,
        'FFFFFF',
        color4Lighter,
        color5Lighter,
        'FFFFFF'
      ].filter(c => c != null && typeof c === 'string');
      
      bgColors = fallbackColors.length > 0
        ? fallbackColors.map(c => (c || '').replace('#', ''))
        : ['FFFFFF', 'F0F0F0', 'FFFFFF', 'E0E0E0', 'D0D0D0', 'FFFFFF'];
    }
    
    return {
      id: 'logo-donts',
      type: 'logo-donts',
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

<div class="logo-donts-slide" style="background: {backgroundStyle};">
  <div class="radial-overlay" style="background: {radialOverlayStyle};"></div>
  
  <div class="slide">
    <div class="header" style="border-bottom: {headerBorderStyle};">
      <div class="title" style="color: {titleColorStyle};">Logo Don'ts</div>
    </div>
    
    <div class="content">
      <div class="examples">
        <div class="example-card">
          <div class="card-header">
            <div class="badge-dont">DON'T</div>
            {#if isEditable}
              <input type="text" bind:value={dontCard1Title} class="card-title-input" />
            {:else}
              <div class="card-title">{dontCard1Title}</div>
            {/if}
          </div>
          <div class="logo-demo" style="transform: scaleX(1.25);" class:editable={isEditable}>
            <div class="strike"></div>
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
            <textarea bind:value={dontCard1Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{dontCard1Hint}</div>
          {/if}
        </div>
        
        <div class="example-card">
          <div class="card-header">
            <div class="badge-dont">DON'T</div>
            {#if isEditable}
              <input type="text" bind:value={dontCard2Title} class="card-title-input" />
            {:else}
              <div class="card-title">{dontCard2Title}</div>
            {/if}
          </div>
          <div class="logo-demo" style="background: linear-gradient(135deg, #A855F7 0%, #F97316 100%);" class:editable={isEditable}>
            <div class="strike"></div>
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
            <textarea bind:value={dontCard2Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{dontCard2Hint}</div>
          {/if}
        </div>
        
        <div class="example-card">
          <div class="card-header">
            <div class="badge-dont">DON'T</div>
            {#if isEditable}
              <input type="text" bind:value={dontCard3Title} class="card-title-input" />
            {:else}
              <div class="card-title">{dontCard3Title}</div>
            {/if}
          </div>
          <div class="logo-demo" style="filter: drop-shadow(6px 6px 0 #000) blur(1px);" class:editable={isEditable}>
            <div class="strike"></div>
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
            <textarea bind:value={dontCard3Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{dontCard3Hint}</div>
          {/if}
        </div>
        
        <div class="example-card">
          <div class="card-header">
            <div class="badge-dont">DON'T</div>
            {#if isEditable}
              <input type="text" bind:value={dontCard4Title} class="card-title-input" />
            {:else}
              <div class="card-title">{dontCard4Title}</div>
            {/if}
          </div>
          <div class="logo-demo" style="background: repeating-linear-gradient(45deg, #222, #222 10px, #555 10px, #555 20px);" class:editable={isEditable}>
            <div class="strike"></div>
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
            <textarea bind:value={dontCard4Hint} class="hint-input"></textarea>
          {:else}
            <div class="hint">{dontCard4Hint}</div>
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
  .logo-donts-slide {
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
  
  .badge-dont {
    background: #FEE2E2;
    color: #991B1B;
    border: 2px solid #EF4444;
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
  
  .strike {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 50%;
    height: 4px;
    background: #EF4444;
    transform: rotate(-8deg);
    box-shadow: 0 0 0 2px rgba(255,255,255,0.5) inset;
    z-index: 3;
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
    content: '✗';
    position: absolute;
    left: 0;
    color: #EF4444;
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

