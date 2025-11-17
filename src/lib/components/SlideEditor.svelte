<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import interact from 'interactjs';
  import { createEventDispatcher } from 'svelte';
  
  export let isEditable: boolean = false;
  export let slideElement: HTMLElement | null = null;
  
  const dispatch = createEventDispatcher();
  
  let selectedElement: HTMLElement | null = null;
  let interactInstance: any = null;
  
  onMount(() => {
    if (isEditable && slideElement) {
      initializeEditing();
    }
  });
  
  onDestroy(() => {
    cleanup();
  });
  
  $: if (isEditable && slideElement) {
    initializeEditing();
  } else {
    cleanup();
  }
  
  function initializeEditing() {
    if (!slideElement) return;
    
    cleanup();
    
    // Make all editable elements draggable and resizable
    const editableElements = slideElement.querySelectorAll('[data-editable]');
    
    editableElements.forEach((element: any) => {
      if (!element.dataset.interactInitialized) {
        element.dataset.interactInitialized = 'true';
        
        // Make draggable
        interact(element)
          .draggable({
            inertia: false,
            autoScroll: false,
            listeners: {
              start(event) {
                element.classList.add('dragging');
                selectElement(element);
              },
              move(event) {
                const target = event.target;
                const x = (parseFloat(target.dataset.x) || 0) + event.dx;
                const y = (parseFloat(target.dataset.y) || 0) + event.dy;
                
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.dataset.x = x.toString();
                target.dataset.y = y.toString();
              },
              end(event) {
                event.target.classList.remove('dragging');
                dispatch('elementMoved', {
                  element: event.target,
                  x: parseFloat(event.target.dataset.x) || 0,
                  y: parseFloat(event.target.dataset.y) || 0
                });
              }
            }
          })
          .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
              move(event) {
                const target = event.target;
                let x = (parseFloat(target.dataset.x) || 0);
                let y = (parseFloat(target.dataset.y) || 0);
                
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';
                
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.dataset.x = x.toString();
                target.dataset.y = y.toString();
              },
              end(event) {
                dispatch('elementResized', {
                  element: event.target,
                  width: event.rect.width,
                  height: event.rect.height,
                  x: parseFloat(event.target.dataset.x) || 0,
                  y: parseFloat(event.target.dataset.y) || 0
                });
              }
            },
            modifiers: [
              interact.modifiers.restrictSize({
                min: { width: 50, height: 30 }
              })
            ]
          })
          .on('click', (event) => {
            selectElement(event.target);
          });
      }
    });
    
    // Click outside to deselect
    document.addEventListener('click', handleDocumentClick);
  }
  
  function selectElement(element: HTMLElement) {
    // Remove previous selection
    if (selectedElement) {
      selectedElement.classList.remove('selected');
    }
    
    selectedElement = element;
    element.classList.add('selected');
    
    dispatch('elementSelected', { element });
  }
  
  function handleDocumentClick(event: MouseEvent) {
    if (!slideElement) return;
    
    const target = event.target as HTMLElement;
    if (!slideElement.contains(target) || !target.closest('[data-editable]')) {
      if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
        dispatch('elementDeselected');
      }
    }
  }
  
  function cleanup() {
    if (interactInstance) {
      interactInstance.unset();
      interactInstance = null;
    }
    
    document.removeEventListener('click', handleDocumentClick);
    
    if (slideElement) {
      const editableElements = slideElement.querySelectorAll('[data-editable]');
      editableElements.forEach((element: any) => {
        delete element.dataset.interactInitialized;
        element.classList.remove('selected', 'dragging');
        element.style.transform = '';
        delete element.dataset.x;
        delete element.dataset.y;
      });
    }
    
    selectedElement = null;
  }
</script>

<style>
  :global([data-editable]) {
    position: relative;
    cursor: move;
    transition: box-shadow 0.2s;
  }
  
  :global([data-editable]:hover) {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  :global([data-editable].selected) {
    box-shadow: 0 0 0 2px #3B82F6;
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
  
  :global([data-editable].dragging) {
    opacity: 0.8;
    z-index: 1000;
  }
  
  :global([data-editable] .resize-handle) {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #3B82F6;
    border: 2px solid white;
    border-radius: 50%;
    cursor: se-resize;
    bottom: -6px;
    right: -6px;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 1001;
  }
  
  :global([data-editable].selected .resize-handle) {
    opacity: 1;
  }
  
  :global([data-editable] .resize-handle:hover) {
    background: #2563EB;
    transform: scale(1.2);
  }
</style>

