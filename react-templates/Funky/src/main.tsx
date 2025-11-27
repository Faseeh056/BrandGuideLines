import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Inject brand config from window if available
if (typeof window !== "undefined" && (window as any).__BRAND_CONFIG__) {
  const brandConfig = (window as any).__BRAND_CONFIG__;
  // Apply font imports if available
  if (brandConfig.googleFontImports && Array.isArray(brandConfig.googleFontImports)) {
    brandConfig.googleFontImports.forEach((fontUrl: string) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);