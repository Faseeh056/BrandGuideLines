import { HeroSection } from "./components/HeroSection";
import { CollectionGrid } from "./components/CollectionGrid";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { FeaturedVideo } from "./components/FeaturedVideo";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { getBrandConfig } from "./shared-brand-config";
import { useEffect } from "react";

export default function App() {
  const brandConfig = getBrandConfig();

  // Inject brand config CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const { colorPalette } = brandConfig;
    
    // Set brand-specific variables
    root.style.setProperty("--brand-primary", colorPalette.primary);
    root.style.setProperty("--brand-secondary", colorPalette.secondary);
    root.style.setProperty("--brand-accent", colorPalette.accent);
    root.style.setProperty("--brand-background", colorPalette.background);
    root.style.setProperty("--brand-text", colorPalette.text);
    
    // Map to UI component variables
    root.style.setProperty("--primary", colorPalette.primary);
    root.style.setProperty("--primary-foreground", colorPalette.background);
    root.style.setProperty("--secondary", colorPalette.secondary);
    root.style.setProperty("--secondary-foreground", colorPalette.background);
    root.style.setProperty("--accent", colorPalette.accent);
    root.style.setProperty("--accent-foreground", colorPalette.background);
    root.style.setProperty("--background", colorPalette.background);
    root.style.setProperty("--foreground", colorPalette.text);
    root.style.setProperty("--text", colorPalette.text);
    
    // Set font families
    if (brandConfig.fonts.heading) {
      root.style.setProperty("--font-heading", brandConfig.fonts.heading);
      document.body.style.fontFamily = brandConfig.fonts.heading;
    }
    if (brandConfig.fonts.body) {
      root.style.setProperty("--font-body", brandConfig.fonts.body);
    }
  }, [brandConfig]);

  // Create gradient background from brand colors
  const backgroundGradient = `linear-gradient(to bottom right, ${brandConfig.colorPalette.background}, ${brandConfig.colorPalette.primary}15, ${brandConfig.colorPalette.secondary}15)`;

  return (
    <div className="min-h-screen" style={{ background: backgroundGradient }}>
      <HeroSection brandConfig={brandConfig} />
      <CollectionGrid brandConfig={brandConfig} />
      <CategoryShowcase brandConfig={brandConfig} />
      <FeaturedVideo brandConfig={brandConfig} />
      <Newsletter brandConfig={brandConfig} />
      <Footer brandConfig={brandConfig} />
    </div>
  );
}
