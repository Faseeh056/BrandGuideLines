<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Palette } from 'lucide-svelte';
  
  export let currentBackground: {
    type: 'color' | 'gradient';
    color?: string;
    gradient?: {
      colors: string[];
      direction: number;
    };
  } = { type: 'color', color: '#FFFFFF' };
  
  const dispatch = createEventDispatcher();
  
  let showEditor = false;
  let backgroundType: 'color' | 'gradient' = currentBackground.type || 'color';
  let colorValue = currentBackground.color || '#FFFFFF';
  let gradientColors = currentBackground.gradient?.colors || ['#FFFFFF', '#F0F0F0'];
  let gradientDirection = currentBackground.gradient?.direction || 135;
  
  // Preview style (for showing preview before applying)
  $: previewStyle = (() => {
    if (backgroundType === 'color') {
      return colorValue;
    } else {
      const colors = gradientColors;
      const stops = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(', ');
      return `linear-gradient(${gradientDirection}deg, ${stops})`;
    }
  })();
  
  function applyBackground() {
    if (backgroundType === 'color') {
      dispatch('update', {
        type: 'color',
        color: colorValue
      });
    } else {
      dispatch('update', {
        type: 'gradient',
        gradient: {
          colors: gradientColors,
          direction: gradientDirection
        }
      });
    }
  }
  
  function addGradientColor() {
    gradientColors = [...gradientColors, '#FFFFFF'];
  }
  
  function removeGradientColor(index: number) {
    if (gradientColors.length > 1) {
      gradientColors = gradientColors.filter((_, i) => i !== index);
    }
  }
</script>

<div class="background-editor">
  <button class="btn-toggle" onclick={() => showEditor = !showEditor}>
    <Palette class="h-4 w-4" />
    <span>{showEditor ? 'Hide Background Editor' : 'Edit Background'}</span>
  </button>
  
  {#if showEditor}
    <div class="editor-panel">
      <!-- Preview -->
      <div class="editor-section">
        <label>Preview</label>
        <div class="preview-box" style="background: {previewStyle};"></div>
      </div>
      
      <div class="editor-section">
        <label>Background Type</label>
        <select bind:value={backgroundType}>
          <option value="color">Solid Color</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>
      
      {#if backgroundType === 'color'}
        <div class="editor-section">
          <label>Color</label>
          <div class="color-input-group">
            <input type="color" bind:value={colorValue} />
            <input type="text" bind:value={colorValue} />
          </div>
        </div>
      {:else}
        <div class="editor-section">
          <label>Gradient Colors</label>
          {#each gradientColors as color, index}
            <div class="gradient-color-item">
              <input type="color" bind:value={gradientColors[index]} />
              <input type="text" bind:value={gradientColors[index]} />
              {#if gradientColors.length > 1}
                <button onclick={() => removeGradientColor(index)}>×</button>
              {/if}
            </div>
          {/each}
          <button class="btn-add" onclick={addGradientColor}>+ Add Color</button>
        </div>
        
        <div class="editor-section">
          <label>Direction: {gradientDirection}°</label>
          <input type="range" bind:value={gradientDirection} min="0" max="360" />
        </div>
      {/if}
      
      <!-- Apply Button -->
      <div class="editor-section">
        <button class="btn-apply" onclick={applyBackground}>
          ✓ Apply Background
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .background-editor {
    position: relative;
  }
  
  .btn-toggle {
    padding: 0.55rem 1.1rem;
    background: #f59e0b;
    color: #111827;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.25);
    transition: all 0.2s;
  }
  
  .btn-toggle:hover {
    background: #fbbf24;
    transform: translateY(-1px);
  }
  
  .editor-panel {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    min-width: 300px;
    margin-top: 0.5rem;
  }
  
  .editor-section {
    margin-bottom: 1rem;
  }
  
  .editor-section label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  .editor-section select,
  .editor-section input[type="text"],
  .editor-section input[type="range"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
  }
  
  .color-input-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .color-input-group input[type="color"] {
    width: 60px;
    height: 40px;
    border: 1px solid rgba(15, 23, 42, 0.15);
    border-radius: 10px;
    cursor: pointer;
    box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.15);
  }
  
  .color-input-group input[type="text"] {
    flex: 1;
  }
  
  .gradient-color-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .gradient-color-item input[type="color"] {
    width: 50px;
    height: 35px;
    border: 1px solid rgba(15, 23, 42, 0.15);
    border-radius: 10px;
    cursor: pointer;
    box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.15);
  }
  
  .gradient-color-item input[type="text"] {
    flex: 1;
  }
  
  .gradient-color-item button {
    width: 30px;
    height: 30px;
    border: none;
    background: #ef4444;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
  }
  
  .gradient-color-item button:hover {
    background: #dc2626;
  }
  
  .btn-add {
    width: 100%;
    padding: 0.5rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
  }
  
  .btn-add:hover {
    background: #059669;
  }
  
  .preview-box {
    width: 100%;
    height: 60px;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    margin-top: 0.5rem;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .btn-apply {
    width: 100%;
    padding: 0.75rem;
    background: #3B82F6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.5rem;
    transition: all 0.2s;
  }
  
  .btn-apply:hover {
    background: #2563EB;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }
  
  .btn-apply:active {
    transform: translateY(0);
  }
</style>

