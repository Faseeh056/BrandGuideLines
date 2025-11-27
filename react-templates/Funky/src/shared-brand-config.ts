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
  brandName: "GROOVE",
  brandDescription: "Fun, Fresh, and Funky",
  logoUrl: "",
  colorPalette: {
    primary: "#fcd34d",
    secondary: "#37b7c3",
    accent: "#ef4444",
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
  industry: "Entertainment",
  stats: [
    { value: "50k+", label: "Happy Vibes" },
    { value: "200+", label: "Events" },
    { value: "24/7", label: "Fun" },
  ],
  features: [
    { title: "Unique Style", description: "Stand out from the crowd" },
    { title: "Creative Energy", description: "Bring excitement to life" },
    { title: "Always Fresh", description: "New ideas every day" },
  ],
  contact: {},
};

export const getBrandConfig = (): BrandConfig => {
  if (typeof window !== "undefined" && (window as any).__BRAND_CONFIG__) {
    return (window as any).__BRAND_CONFIG__;
  }
  return defaultConfig;
};

