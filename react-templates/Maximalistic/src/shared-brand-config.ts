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

// Default config
const defaultConfig: BrandConfig = {
  brandName: "VIBRANT",
  brandDescription: "Bold Design, Maximum Impact",
  logoUrl: "",
  colorPalette: {
    primary: "#f97316",
    secondary: "#ec4899",
    accent: "#fde047",
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
  industry: "Creative",
  stats: [
    { value: "1000+", label: "Projects" },
    { value: "100k+", label: "Customers" },
    { value: "24/7", label: "Support" },
  ],
  features: [
    { title: "Bold Design", description: "Stand out with vibrant aesthetics" },
    { title: "Full Service", description: "Complete creative solutions" },
    { title: "Fast Delivery", description: "Quick turnaround times" },
  ],
  contact: {},
};

export const getBrandConfig = (): BrandConfig => {
  if (typeof window !== "undefined" && (window as any).__BRAND_CONFIG__) {
    return (window as any).__BRAND_CONFIG__;
  }
  return defaultConfig;
};

