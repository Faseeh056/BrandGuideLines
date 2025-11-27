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
  brandName: "NEXUS",
  brandDescription: "The Future of Technology",
  logoUrl: "",
  colorPalette: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0f172a",
    text: "#ffffff",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  images: {
    hero: "",
    gallery: [],
  },
  industry: "Technology",
  stats: [
    { value: "99.9%", label: "Uptime" },
    { value: "10M+", label: "Users" },
    { value: "500+", label: "Countries" },
  ],
  features: [
    { title: "Lightning Fast", description: "Experience blazing speed with cutting-edge infrastructure" },
    { title: "Ultra Secure", description: "Military-grade encryption keeps your data safe" },
    { title: "AI-Powered", description: "Advanced machine learning adapts to your needs" },
    { title: "Next-Gen UX", description: "Intuitive interfaces for seamless interaction" },
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

