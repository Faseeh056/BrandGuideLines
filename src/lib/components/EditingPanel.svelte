<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import BackgroundEditor from './BackgroundEditor.svelte';
  
  export let isOpen = false;
  export let slideType: string = '';
  export let editableData: any = {};
  
  const dispatch = createEventDispatcher();
  
  // Color picker state
  let showColorPicker = false;
  let colorPickerTarget: string | null = null;
  let tempColor = '#000000';
  
  // Image upload state
  let imageUploadTarget: string | null = null;
  
  // Note: Fonts are AI-generated from brandData, not hardcoded
  
  function openColorPicker(target: string, currentColor: string) {
    colorPickerTarget = target;
    tempColor = currentColor || '#000000';
    showColorPicker = true;
  }
  
  function applyColor() {
    if (colorPickerTarget) {
      dispatch('update', {
        type: 'color',
        target: colorPickerTarget,
        value: tempColor
      });
    }
    showColorPicker = false;
    colorPickerTarget = null;
  }
  
  function cancelColorPicker() {
    showColorPicker = false;
    colorPickerTarget = null;
  }
  
  function handleImageUpload(event: Event, target: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      dispatch('update', {
        type: 'image',
        target: target,
        value: result
      });
    };
    reader.readAsDataURL(file);
  }
  
  function updateText(target: string, value: string) {
    dispatch('update', {
      type: 'text',
      target: target,
      value: value
    });
  }
  
  function updateFont(target: string, value: string) {
    dispatch('update', {
      type: 'font',
      target: target,
      value: value
    });
  }
  
  function updateNumber(target: string, value: number) {
    dispatch('update', {
      type: 'number',
      target: target,
      value: value
    });
  }
</script>

{#if isOpen}
  <div class="editing-panel">
    <div class="panel-header">
      <h3>Edit {slideType}</h3>
      <button class="close-btn" onclick={() => dispatch('close')}>×</button>
    </div>
    
    <div class="panel-content">
      <!-- Background Editor for all slides -->
      <div class="edit-section">
        <h4>Background</h4>
        <BackgroundEditor 
          currentBackground={editableData.background || { type: 'gradient', gradient: { colors: ['#FFFFFF'], direction: 135 } }}
          on:update={(e) => {
            // Convert the update event to the correct format
            const detail = e.detail;
            if (detail.type === 'color') {
              dispatch('update', { 
                type: 'background', 
                value: { type: 'color', color: detail.color } 
              });
            } else if (detail.type === 'gradient') {
              dispatch('update', { 
                type: 'background', 
                value: { 
                  type: 'gradient', 
                  gradient: detail.gradient 
                } 
              });
            }
          }}
        />
      </div>
      
      {#if slideType === 'Cover Slide'}
        <!-- Cover Slide Editing -->
        <div class="edit-section">
          <label>Brand Name</label>
          <input 
            type="text" 
            value={editableData.brandName || ''}
            oninput={(e) => updateText('brandName', e.currentTarget.value)}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Tagline</label>
          <input 
            type="text" 
            value={editableData.tagline || ''}
            oninput={(e) => updateText('tagline', e.currentTarget.value)}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Primary Color</label>
          <div class="color-input-group">
            <input 
              type="text" 
              value={editableData.primaryColor || '#1E40AF'}
              oninput={(e) => updateText('primaryColor', e.currentTarget.value)}
              class="edit-input color-text"
            />
            <button 
              class="color-picker-btn"
              style="background: {editableData.primaryColor || '#1E40AF'}"
              onclick={() => openColorPicker('primaryColor', editableData.primaryColor)}
            ></button>
          </div>
        </div>
        
        <div class="edit-section">
          <label>Secondary Color</label>
          <div class="color-input-group">
            <input 
              type="text" 
              value={editableData.secondaryColor || '#93C5FD'}
              oninput={(e) => updateText('secondaryColor', e.currentTarget.value)}
              class="edit-input color-text"
            />
            <button 
              class="color-picker-btn"
              style="background: {editableData.secondaryColor || '#93C5FD'}"
              onclick={() => openColorPicker('secondaryColor', editableData.secondaryColor)}
            ></button>
          </div>
        </div>
        
        <div class="edit-section">
          <label>Logo</label>
          <input 
            type="file" 
            accept="image/*"
            onchange={(e) => handleImageUpload(e, 'logoData')}
            class="file-input"
          />
          {#if editableData.logoData}
            <img src={editableData.logoData} alt="Logo preview" class="image-preview" />
          {/if}
        </div>
      
      {:else if slideType === 'Color Palette'}
        <!-- Color Palette Editing -->
        {#each editableData.colors || [] as color, index}
          <div class="edit-section">
            <label>Color {index + 1}</label>
            <div class="color-input-group">
              <input 
                type="text" 
                value={color.name || ''}
                oninput={(e) => dispatch('update', { type: 'color-name', index, value: e.currentTarget.value })}
                placeholder="Color name"
                class="edit-input"
              />
              <input 
                type="text" 
                value={color.hex || ''}
                oninput={(e) => dispatch('update', { type: 'color-hex', index, value: e.currentTarget.value })}
                placeholder="#000000"
                class="edit-input color-text"
              />
              <button 
                class="color-picker-btn"
                style="background: {color.hex || '#000000'}"
                onclick={() => openColorPicker(`color-${index}`, color.hex)}
              ></button>
            </div>
            <input 
              type="text" 
              value={color.usage || ''}
              oninput={(e) => dispatch('update', { type: 'color-usage', index, value: e.currentTarget.value })}
              placeholder="Usage description"
              class="edit-input"
            />
            <button 
              class="btn-danger"
              onclick={() => dispatch('update', { type: 'remove-color', index })}
            >Remove</button>
          </div>
        {/each}
        <button 
          class="btn-add"
          onclick={() => dispatch('update', { type: 'add-color' })}
        >+ Add Color</button>
      
      {:else if slideType === 'Typography'}
        <!-- Typography Editing -->
        <div class="edit-section">
          <label>Primary Font</label>
          <input 
            type="text" 
            value={editableData.primaryFont || 'Arial'}
            oninput={(e) => updateFont('primaryFont', e.currentTarget.value)}
            placeholder="Enter font name (AI-generated or custom)"
            class="edit-input"
          />
          <p class="edit-hint">Font names are AI-generated based on your brand. You can edit them here.</p>
        </div>
        
        <div class="edit-section">
          <label>Primary Font Weights</label>
          <input 
            type="text" 
            value={editableData.primaryWeights || 'Regular, Bold'}
            oninput={(e) => updateText('primaryWeights', e.currentTarget.value)}
            placeholder="Regular, Bold, Light"
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Secondary Font</label>
          <input 
            type="text" 
            value={editableData.secondaryFont || 'Arial'}
            oninput={(e) => updateFont('secondaryFont', e.currentTarget.value)}
            placeholder="Enter font name (AI-generated or custom)"
            class="edit-input"
          />
          <p class="edit-hint">Font names are AI-generated based on your brand. You can edit them here.</p>
        </div>
        
        <div class="edit-section">
          <label>Secondary Font Weights</label>
          <input 
            type="text" 
            value={editableData.secondaryWeights || 'Regular, Medium'}
            oninput={(e) => updateText('secondaryWeights', e.currentTarget.value)}
            placeholder="Regular, Medium"
            class="edit-input"
          />
        </div>
      
      {:else if slideType === 'Brand Positioning'}
        <!-- Brand Positioning Editing -->
        <div class="edit-section">
          <label>Mission</label>
          <textarea 
            value={editableData.mission || ''}
            oninput={(e) => updateText('mission', e.currentTarget.value)}
            class="edit-textarea"
            rows="3"
          ></textarea>
        </div>
        
        <div class="edit-section">
          <label>Vision</label>
          <textarea 
            value={editableData.vision || ''}
            oninput={(e) => updateText('vision', e.currentTarget.value)}
            class="edit-textarea"
            rows="3"
          ></textarea>
        </div>
        
        <div class="edit-section">
          <label>Values</label>
          <textarea 
            value={editableData.values || ''}
            oninput={(e) => updateText('values', e.currentTarget.value)}
            class="edit-textarea"
            rows="3"
          ></textarea>
        </div>
        
        <div class="edit-section">
          <label>Personality</label>
          <textarea 
            value={editableData.personality || ''}
            oninput={(e) => updateText('personality', e.currentTarget.value)}
            class="edit-textarea"
            rows="3"
          ></textarea>
        </div>
      
      {:else if slideType === 'Iconography'}
        <!-- Iconography Editing -->
        {#each editableData.icons || [] as icon, index}
          <div class="edit-section">
            <label>Icon {index + 1}</label>
            <input 
              type="text" 
              value={icon.symbol || ''}
              oninput={(e) => dispatch('update', { type: 'icon-symbol', index, value: e.currentTarget.value })}
              placeholder="Symbol/Emoji"
              class="edit-input"
            />
            <input 
              type="text" 
              value={icon.name || ''}
              oninput={(e) => dispatch('update', { type: 'icon-name', index, value: e.currentTarget.value })}
              placeholder="Icon name"
              class="edit-input"
            />
            <button 
              class="btn-danger"
              onclick={() => dispatch('update', { type: 'remove-icon', index })}
            >Remove</button>
          </div>
        {/each}
        <button 
          class="btn-add"
          onclick={() => dispatch('update', { type: 'add-icon' })}
        >+ Add Icon</button>
      
      {:else if slideType === 'Applications'}
        <!-- Applications Editing -->
        {#each editableData.applications || [] as app, index}
          <div class="edit-section">
            <label>Application {index + 1}</label>
            <input 
              type="text" 
              value={app.icon || ''}
              oninput={(e) => dispatch('update', { type: 'app-icon', index, value: e.currentTarget.value })}
              placeholder="Icon/Emoji"
              class="edit-input"
            />
            <input 
              type="text" 
              value={app.name || ''}
              oninput={(e) => dispatch('update', { type: 'app-name', index, value: e.currentTarget.value })}
              placeholder="Application name"
              class="edit-input"
            />
            <textarea 
              value={app.description || ''}
              oninput={(e) => dispatch('update', { type: 'app-description', index, value: e.currentTarget.value })}
              placeholder="Description"
              class="edit-textarea"
              rows="2"
            ></textarea>
            <button 
              class="btn-danger"
              onclick={() => dispatch('update', { type: 'remove-app', index })}
            >Remove</button>
          </div>
        {/each}
        <button 
          class="btn-add"
          onclick={() => dispatch('update', { type: 'add-app' })}
        >+ Add Application</button>
      
      {:else if slideType === 'Logo Guidelines' || slideType === 'Logo Do\'s' || slideType === 'Logo Don\'ts'}
        <!-- Logo Slides Editing -->
        <div class="edit-section">
          <label>Brand Name</label>
          <input 
            type="text" 
            value={editableData.brandName || ''}
            oninput={(e) => updateText('brandName', e.currentTarget.value)}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Logo</label>
          <input 
            type="file" 
            accept="image/*"
            onchange={(e) => handleImageUpload(e, 'logoData')}
            class="file-input"
          />
          {#if editableData.logoData}
            <img src={editableData.logoData} alt="Logo preview" class="image-preview" />
          {/if}
        </div>
        
        <div class="edit-section">
          <label>Primary Color</label>
          <div class="color-input-group">
            <input 
              type="text" 
              value={editableData.primaryColor || '#1E40AF'}
              oninput={(e) => updateText('primaryColor', e.currentTarget.value)}
              class="edit-input color-text"
            />
            <button 
              class="color-picker-btn"
              style="background: {editableData.primaryColor || '#1E40AF'}"
              onclick={() => openColorPicker('primaryColor', editableData.primaryColor)}
            ></button>
          </div>
        </div>
      
      {:else if slideType === 'Brand Introduction'}
        <!-- Brand Introduction Editing -->
        <div class="edit-section">
          <label>Positioning Statement</label>
          <textarea 
            value={editableData.positioningStatement || ''}
            oninput={(e) => updateText('positioningStatement', e.currentTarget.value)}
            class="edit-textarea"
            rows="5"
          ></textarea>
        </div>
        
        <div class="edit-section">
          <label>Primary Color</label>
          <div class="color-input-group">
            <input 
              type="text" 
              value={editableData.primaryColor || '#1E40AF'}
              oninput={(e) => updateText('primaryColor', e.currentTarget.value)}
              class="edit-input color-text"
            />
            <button 
              class="color-picker-btn"
              style="background: {editableData.primaryColor || '#1E40AF'}"
              onclick={() => openColorPicker('primaryColor', editableData.primaryColor)}
            ></button>
          </div>
        </div>
      
      {:else if slideType === 'Thank You'}
        <!-- Thank You Slide Editing -->
        <div class="edit-section">
          <label>Thank You Text</label>
          <input 
            type="text" 
            value={editableData.thankYouText || 'Thank You'}
            oninput={(e) => dispatch('update', { type: 'thank-you-text', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Subtitle</label>
          <input 
            type="text" 
            value={editableData.subtitleText || 'Let\'s Create Something Amazing Together'}
            oninput={(e) => dispatch('update', { type: 'subtitle-text', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Website</label>
          <input 
            type="text" 
            value={editableData.website || ''}
            oninput={(e) => updateText('website', e.currentTarget.value)}
            class="edit-input"
            placeholder="your-website.com"
          />
        </div>
        
        <div class="edit-section">
          <label>Email</label>
          <input 
            type="email" 
            value={editableData.email || ''}
            oninput={(e) => updateText('email', e.currentTarget.value)}
            class="edit-input"
            placeholder="contact@example.com"
          />
        </div>
        
        <div class="edit-section">
          <label>Phone</label>
          <input 
            type="text" 
            value={editableData.phone || ''}
            oninput={(e) => updateText('phone', e.currentTarget.value)}
            class="edit-input"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      
      {:else if slideType === 'Typography'}
        <!-- Typography Editing -->
        <div class="edit-section">
          <label>Primary Font</label>
          <input 
            type="text" 
            value={editableData.primaryFont || 'Arial'}
            oninput={(e) => updateFont('primaryFont', e.currentTarget.value)}
            placeholder="Enter font name (AI-generated or custom)"
            class="edit-input"
          />
          <p class="edit-hint">Font names are AI-generated based on your brand. You can edit them here.</p>
        </div>
        
        <div class="edit-section">
          <label>Primary Font Weights</label>
          <input 
            type="text" 
            value={editableData.primaryWeights || 'Regular, Bold'}
            oninput={(e) => updateText('primaryWeights', e.currentTarget.value)}
            placeholder="Regular, Bold, Light"
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Secondary Font</label>
          <input 
            type="text" 
            value={editableData.secondaryFont || 'Arial'}
            oninput={(e) => updateFont('secondaryFont', e.currentTarget.value)}
            placeholder="Enter font name (AI-generated or custom)"
            class="edit-input"
          />
          <p class="edit-hint">Font names are AI-generated based on your brand. You can edit them here.</p>
        </div>
        
        <div class="edit-section">
          <label>Secondary Font Weights</label>
          <input 
            type="text" 
            value={editableData.secondaryWeights || 'Regular, Medium'}
            oninput={(e) => updateText('secondaryWeights', e.currentTarget.value)}
            placeholder="Regular, Medium"
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Hierarchy H1</label>
          <input 
            type="text" 
            value={editableData.hierarchyH1 || 'H1: 32pt - Main titles'}
            oninput={(e) => dispatch('update', { type: 'hierarchy-h1', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Hierarchy H2</label>
          <input 
            type="text" 
            value={editableData.hierarchyH2 || 'H2: 24pt - Section headers'}
            oninput={(e) => dispatch('update', { type: 'hierarchy-h2', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Hierarchy H3</label>
          <input 
            type="text" 
            value={editableData.hierarchyH3 || 'H3: 20pt - Subsection headers'}
            oninput={(e) => dispatch('update', { type: 'hierarchy-h3', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Hierarchy Body</label>
          <input 
            type="text" 
            value={editableData.hierarchyBody || 'Body: 16pt - Main content'}
            oninput={(e) => dispatch('update', { type: 'hierarchy-body', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
      
      {:else if slideType === 'Photography'}
        <!-- Photography Slide Editing -->
        <div class="edit-section">
          <label>Photo 1</label>
          <div class="edit-row">
            <input 
              type="text" 
              value={editableData.photoEmoji1 || '📷'}
              oninput={(e) => dispatch('update', { type: 'photo-emoji', index: 0, value: e.currentTarget.value })}
              class="edit-input emoji-input"
              placeholder="Emoji"
            />
            <input 
              type="text" 
              value={editableData.photoLabel1 || 'Authentic Moments'}
              oninput={(e) => dispatch('update', { type: 'photo-label', index: 0, value: e.currentTarget.value })}
              class="edit-input"
              placeholder="Label"
            />
          </div>
        </div>
        
        <div class="edit-section">
          <label>Photo 2</label>
          <div class="edit-row">
            <input 
              type="text" 
              value={editableData.photoEmoji2 || '🌟'}
              oninput={(e) => dispatch('update', { type: 'photo-emoji', index: 1, value: e.currentTarget.value })}
              class="edit-input emoji-input"
              placeholder="Emoji"
            />
            <input 
              type="text" 
              value={editableData.photoLabel2 || 'Natural Lighting'}
              oninput={(e) => dispatch('update', { type: 'photo-label', index: 1, value: e.currentTarget.value })}
              class="edit-input"
              placeholder="Label"
            />
          </div>
        </div>
        
        <div class="edit-section">
          <label>Photo 3</label>
          <div class="edit-row">
            <input 
              type="text" 
              value={editableData.photoEmoji3 || '🎨'}
              oninput={(e) => dispatch('update', { type: 'photo-emoji', index: 2, value: e.currentTarget.value })}
              class="edit-input emoji-input"
              placeholder="Emoji"
            />
            <input 
              type="text" 
              value={editableData.photoLabel3 || 'Vibrant Colors'}
              oninput={(e) => dispatch('update', { type: 'photo-label', index: 2, value: e.currentTarget.value })}
              class="edit-input"
              placeholder="Label"
            />
          </div>
        </div>
        
        <div class="edit-section">
          <label>Photo 4</label>
          <div class="edit-row">
            <input 
              type="text" 
              value={editableData.photoEmoji4 || '👥'}
              oninput={(e) => dispatch('update', { type: 'photo-emoji', index: 3, value: e.currentTarget.value })}
              class="edit-input emoji-input"
              placeholder="Emoji"
            />
            <input 
              type="text" 
              value={editableData.photoLabel4 || 'People-Focused'}
              oninput={(e) => dispatch('update', { type: 'photo-label', index: 3, value: e.currentTarget.value })}
              class="edit-input"
              placeholder="Label"
            />
          </div>
        </div>
        
        <div class="edit-section">
          <label>Guideline Title 1</label>
          <input 
            type="text" 
            value={editableData.guidelineTitle1 || 'Style Guidelines'}
            oninput={(e) => dispatch('update', { type: 'guideline-title-1', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Guideline Items</label>
          {#each editableData.guidelineItems || [] as item, index}
            <input 
              type="text" 
              value={item}
              oninput={(e) => dispatch('update', { type: 'guideline-item', index, value: e.currentTarget.value })}
              class="edit-input"
              style="margin-bottom: 8px;"
            />
          {/each}
          <button 
            class="btn-add"
            onclick={() => dispatch('update', { type: 'add-guideline-item' })}
          >+ Add Item</button>
        </div>
        
        <div class="edit-section">
          <label>Guideline Title 2</label>
          <input 
            type="text" 
            value={editableData.guidelineTitle2 || 'Do\'s & Don\'ts'}
            oninput={(e) => dispatch('update', { type: 'guideline-title-2', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Do Text</label>
          <input 
            type="text" 
            value={editableData.doText || 'Use natural lighting & authentic scenes'}
            oninput={(e) => dispatch('update', { type: 'do-text', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
        
        <div class="edit-section">
          <label>Don't Text</label>
          <input 
            type="text" 
            value={editableData.dontText || 'Avoid staged poses & heavy filters'}
            oninput={(e) => dispatch('update', { type: 'dont-text', value: e.currentTarget.value })}
            class="edit-input"
          />
        </div>
      
      {:else}
        <!-- Generic editing for other slides -->
        <div class="edit-section">
          <p class="edit-hint">Use the inline editing controls on the slide to edit content.</p>
        </div>
      {/if}
    </div>
    
    <!-- Color Picker Modal -->
    {#if showColorPicker}
      <div class="color-picker-modal" onclick={cancelColorPicker}>
        <div class="color-picker-content" onclick={(e) => e.stopPropagation()}>
          <div class="color-picker-header">
            <h4>Pick Color</h4>
            <button class="close-btn" onclick={cancelColorPicker}>×</button>
          </div>
          <div class="color-picker-body">
            <input 
              type="color" 
              bind:value={tempColor}
              class="color-input"
            />
            <input 
              type="text" 
              bind:value={tempColor}
              class="color-hex-input"
              placeholder="#000000"
            />
          </div>
          <div class="color-picker-footer">
            <button class="btn-cancel" onclick={cancelColorPicker}>Cancel</button>
            <button class="btn-apply" onclick={applyColor}>Apply</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .editing-panel {
    position: absolute;
    right: 0;
    top: 0;
    width: 360px;
    height: 100%;
    background: white;
    box-shadow: -12px 0 30px rgba(15, 23, 42, 0.12);
    z-index: 5;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    border-left: 1px solid rgba(15, 23, 42, 0.08);
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  
  .panel-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
  
  .close-btn:hover {
    background: #e5e7eb;
  }
  
  .panel-content {
    padding: 1.5rem;
    flex: 1;
  }
  
  .edit-section {
    margin-bottom: 1.5rem;
  }
  
  .edit-section label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 0.9rem;
  }
  
  .edit-input,
  .edit-textarea,
  .edit-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: inherit;
  }
  
  .edit-input:focus,
  .edit-textarea:focus,
  .edit-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .edit-textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .color-input-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .color-text {
    flex: 1;
  }
  
  .color-picker-btn {
    width: 44px;
    height: 44px;
    border: 2px solid rgba(245, 158, 11, 0.6);
    border-radius: 12px;
    cursor: pointer;
    padding: 0;
    background: white;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
    transition: transform 0.2s, border-color 0.2s;
  }
  
  .color-picker-btn:hover {
    border-color: #fbbf24;
    transform: translateY(-1px) scale(1.03);
  }
  
  .file-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
  }
  
  .image-preview {
    margin-top: 0.5rem;
    max-width: 100%;
    max-height: 150px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
  }
  
  .btn-add,
  .btn-danger {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-add {
    background: #10b981;
    color: white;
    width: 100%;
  }
  
  .btn-add:hover {
    background: #059669;
  }
  
  .btn-danger {
    background: #ef4444;
    color: white;
    margin-top: 0.5rem;
  }
  
  .btn-danger:hover {
    background: #dc2626;
  }
  
  .edit-hint {
    color: #6b7280;
    font-size: 0.85rem;
    font-style: italic;
  }
  
  .edit-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .emoji-input {
    width: 80px;
    text-align: center;
    font-size: 1.2rem;
  }
  
  .color-picker-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .color-picker-content {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    min-width: 300px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
  
  .color-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .color-picker-header h4 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  .color-picker-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .color-input {
    width: 100%;
    height: 60px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .color-hex-input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    text-align: center;
    font-family: monospace;
  }
  
  .color-picker-footer {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
  
  .btn-cancel,
  .btn-apply {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .btn-cancel {
    background: #f3f4f6;
    color: #374151;
  }
  
  .btn-cancel:hover {
    background: #e5e7eb;
  }
  
  .btn-apply {
    background: #3b82f6;
    color: white;
  }
  
  .btn-apply:hover {
    background: #2563eb;
  }
</style>

