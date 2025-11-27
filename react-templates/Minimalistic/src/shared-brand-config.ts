export interface BrandConfig {
  brandName: string;
  brandDescription: string;
  logoUrl: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  images: {
    hero: string;
    gallery: string[];
  };
  industry: string;
  stats: Array<{ value: string; label: string }>;
  features: Array<{ title: string; description: string }>;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

// Default config (will be overridden by window.__BRAND_CONFIG__)
const defaultConfig: BrandConfig = {
  brandName: "MONO",
  brandDescription: "Pure Design, Timeless Comfort",
  logoUrl: "",
  colorPalette: {
    primary: "#0a0a0a",
    secondary: "#171717",
    accent: "#404040",
    background: "#ffffff",
    text: "#0a0a0a",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  images: {
    hero: "",
    gallery: [],
  },
  industry: "Furniture",
  stats: [
    { value: "500+", label: "Products" },
    { value: "50k+", label: "Happy Homes" },
    { value: "Free", label: "Delivery" },
  ],
  features: [
    { title: "Quality Design", description: "Each piece crafted with care" },
    { title: "Sustainable", description: "Eco-friendly materials" },
    { title: "Timeless", description: "Classic aesthetics that last" },
  ],
  contact: {},
};

// Get config from window or use default
export const getBrandConfig = (): BrandConfig => {
  if (typeof window !== "undefined" && (window as any).__BRAND_CONFIG__) {
    return (window as any).__BRAND_CONFIG__;
  }
  return defaultConfig;
};

