import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BrandConfig } from "../shared-brand-config";

interface HeroProps {
  brandConfig: BrandConfig;
}

export function Hero({ brandConfig }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div 
              className="mb-6 inline-block rounded-full border px-4 py-1.5"
              style={{ 
                borderColor: brandConfig.colorPalette.accent,
                color: brandConfig.colorPalette.text 
              }}
            >
              {brandConfig.industry} Excellence
            </div>
            
            <h1 
              className="mb-6 text-5xl md:text-6xl font-bold"
              style={{ 
                color: brandConfig.colorPalette.text,
                fontFamily: brandConfig.fonts.heading 
              }}
            >
              {brandConfig.brandName}
            </h1>
            
            <p 
              className="mb-8 max-w-xl text-lg"
              style={{ color: brandConfig.colorPalette.text, opacity: 0.8 }}
            >
              {brandConfig.brandDescription}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                className="text-white"
                style={{ backgroundColor: brandConfig.colorPalette.primary }}
              >
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                style={{ 
                  borderColor: brandConfig.colorPalette.accent,
                  color: brandConfig.colorPalette.text 
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: brandConfig.colorPalette.accent }}>
              {brandConfig.stats.map((stat, idx) => (
                <div key={idx}>
                  <div 
                    className="mb-1 text-2xl font-bold"
                    style={{ color: brandConfig.colorPalette.text }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src={brandConfig.images.hero || "https://images.unsplash.com/photo-1708758487256-8a3a73565dc2?w=1080"}
              alt={`${brandConfig.brandName} hero`}
              className="relative rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
