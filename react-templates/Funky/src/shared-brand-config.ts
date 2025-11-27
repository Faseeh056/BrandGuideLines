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
  contact: Record<string, any>;
}

const defaultConfig: BrandConfig = {
  brandName: "FUNKIFY",
  brandDescription: "Bold. Funky. Fearless. Express yourself with fashion that speaks your language.",
  logoUrl: "",
  colorPalette: {
    primary: "#9333ea",
    secondary: "#ec4899",
    accent: "#f59e0b",
    background: "#faf5ff",
    text: "#1f2937",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  images: {
    hero: "",
    gallery: [],
  },
  industry: "Fashion",
  stats: [
    { value: "24/7", label: "Creative Flow" },
    { value: "120+", label: "Happy Clients" },
    { value: "12", label: "Brand Touchpoints" },
  ],
  features: [
    { title: "Joyful Expressions", description: "Turn every interaction into a playful moment." },
    { title: "Bold Voice", description: "A brand story that never whispers." },
    { title: "Culture Ready", description: "Made for social, retail, and experiential drops." },
  ],
  contact: {},
};

export const getBrandConfig = (): BrandConfig => {
  if (typeof window !== "undefined" && (window as any).__BRAND_CONFIG__) {
    return (window as any).__BRAND_CONFIG__;
  }
  return defaultConfig;
};

