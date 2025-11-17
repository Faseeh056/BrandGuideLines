/**
 * SlideData type definition for Svelte slides
 * Used for PPTX export and database storage
 */

export type SlideElement = 
  | TextElement
  | ImageElement
  | ShapeElement
  | ColorSwatchElement;

export interface TextElement {
  id: string;
  type: 'text';
  position: { x: number; y: number; w: number; h: number };
  text: string;
  fontSize?: number;
  fontFace?: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  zIndex?: number;
}

export interface ImageElement {
  id: string;
  type: 'image';
  position: { x: number; y: number; w: number; h: number };
  imageData?: string; // Base64 image data
  imageSrc?: string; // Image URL
  zIndex?: number;
}

export interface ShapeElement {
  id: string;
  type: 'shape';
  position: { x: number; y: number; w: number; h: number };
  shapeType: 'rect' | 'circle' | 'ellipse';
  fillColor?: string;
  lineColor?: string;
  lineWidth?: number;
  zIndex?: number;
}

export interface ColorSwatchElement {
  id: string;
  type: 'color-swatch';
  position: { x: number; y: number; w: number; h: number };
  colorSwatch: {
    hex: string;
    name: string;
    usage: string;
  };
  zIndex?: number;
}

export interface SlideData {
  id: string;
  type: 'cover' | 'content' | 'color' | 'color-palette' | 'typography' | 'iconography' | 'photography' | 'applications' | 'closing' | 'thank-you' | 'logo-guidelines' | 'logo-dos' | 'logo-donts' | 'brand-introduction' | 'brand-positioning';
  layout: {
    width: number;
    height: number;
    background: {
      type: 'color' | 'gradient';
      color?: string;
      gradient?: {
        colors: string[];
        direction: number;
      };
    };
  };
  elements: SlideElement[];
}

