import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { getBrandConfig } from "./shared-brand-config";
import { useEffect } from "react";

export default function App() {
  const brandConfig = getBrandConfig();

  useEffect(() => {
    // Apply brand colors to CSS variables
    document.documentElement.style.setProperty('--brand-primary', brandConfig.colorPalette.primary);
    document.documentElement.style.setProperty('--brand-secondary', brandConfig.colorPalette.secondary);
    document.documentElement.style.setProperty('--brand-accent', brandConfig.colorPalette.accent);
    document.documentElement.style.setProperty('--brand-bg', brandConfig.colorPalette.background);
    document.documentElement.style.setProperty('--brand-text', brandConfig.colorPalette.text);
    document.documentElement.style.setProperty('--font-heading', brandConfig.fonts.heading);
    document.documentElement.style.setProperty('--font-body', brandConfig.fonts.body);
  }, [brandConfig]);

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: brandConfig.colorPalette.background,
        fontFamily: brandConfig.fonts.body 
      }}
    >
      <Navbar brandConfig={brandConfig} />
      <Hero brandConfig={brandConfig} />
      <Services brandConfig={brandConfig} />
      <About brandConfig={brandConfig} />
      <Footer brandConfig={brandConfig} />
    </div>
  );
}