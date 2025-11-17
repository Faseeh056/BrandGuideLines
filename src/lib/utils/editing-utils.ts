/**
 * Editing utilities for drag, drop, and resize functionality
 */

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  elementX: number;
  elementY: number;
}

export interface ResizeState {
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  resizeHandle: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;
}

/**
 * Initialize drag functionality for an element
 */
export function initDrag(
  element: HTMLElement,
  onDrag: (x: number, y: number) => void,
  onDragEnd?: () => void
): () => void {
  let dragState: DragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    elementX: 0,
    elementY: 0
  };

  function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return; // Only left mouse button
    e.preventDefault();
    e.stopPropagation();
    
    dragState.isDragging = true;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    
    const rect = element.getBoundingClientRect();
    dragState.elementX = rect.left;
    dragState.elementY = rect.top;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    element.style.cursor = 'grabbing';
    element.style.userSelect = 'none';
  }

  function handleMouseMove(e: MouseEvent) {
    if (!dragState.isDragging) return;
    
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    
    const newX = dragState.elementX + deltaX;
    const newY = dragState.elementY + deltaY;
    
    onDrag(newX, newY);
  }

  function handleMouseUp() {
    dragState.isDragging = false;
    element.style.cursor = 'grab';
    element.style.userSelect = '';
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (onDragEnd) onDragEnd();
  }

  element.style.cursor = 'grab';
  element.addEventListener('mousedown', handleMouseDown);

  // Cleanup function
  return () => {
    element.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}

/**
 * Initialize resize functionality for an element
 */
export function initResize(
  element: HTMLElement,
  onResize: (width: number, height: number) => void,
  onResizeEnd?: () => void
): () => void {
  let resizeState: ResizeState = {
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    resizeHandle: null
  };

  // Create resize handles
  const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const;
  const handleElements: HTMLElement[] = [];

  handles.forEach(handle => {
    const handleEl = document.createElement('div');
    handleEl.className = `resize-handle resize-handle-${handle}`;
    handleEl.dataset.handle = handle;
    element.appendChild(handleEl);
    handleElements.push(handleEl);

    handleEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resizeState.isResizing = true;
      resizeState.startX = e.clientX;
      resizeState.startY = e.clientY;
      resizeState.resizeHandle = handle;
      
      const rect = element.getBoundingClientRect();
      resizeState.startWidth = rect.width;
      resizeState.startHeight = rect.height;
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  });

  function handleMouseMove(e: MouseEvent) {
    if (!resizeState.isResizing || !resizeState.resizeHandle) return;
    
    const deltaX = e.clientX - resizeState.startX;
    const deltaY = e.clientY - resizeState.startY;
    
    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;
    
    const handle = resizeState.resizeHandle;
    
    if (handle.includes('e')) newWidth += deltaX;
    if (handle.includes('w')) newWidth -= deltaX;
    if (handle.includes('s')) newHeight += deltaY;
    if (handle.includes('n')) newHeight -= deltaY;
    
    // Minimum size constraints
    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);
    
    onResize(newWidth, newHeight);
  }

  function handleMouseUp() {
    resizeState.isResizing = false;
    resizeState.resizeHandle = null;
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (onResizeEnd) onResizeEnd();
  }

  // Cleanup function
  return () => {
    handleElements.forEach(handle => handle.remove());
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}

/**
 * Add editing overlay to an element when in edit mode
 */
export function addEditingOverlay(
  element: HTMLElement,
  isEditable: boolean
): () => void {
  if (!isEditable) return () => {};
  
  const overlay = document.createElement('div');
  overlay.className = 'editing-overlay';
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px dashed #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    pointer-events: none;
    z-index: 1000;
    border-radius: 4px;
  `;
  
  const parent = element.parentElement;
  if (parent && parent.style.position !== 'absolute' && parent.style.position !== 'relative') {
    parent.style.position = 'relative';
  }
  
  element.style.position = 'relative';
  element.appendChild(overlay);
  
  return () => {
    overlay.remove();
  };
}

