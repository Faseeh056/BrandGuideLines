import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle2 } from "lucide-react";
import { BrandConfig } from "../shared-brand-config";

interface AboutProps {
  brandConfig: BrandConfig;
}

export function About({ brandConfig }: AboutProps) {
  return (
    <section className="px-6 py-20 md:py-24" style={{ backgroundColor: brandConfig.colorPalette.background }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <ImageWithFallback
              src={brandConfig.images.gallery[0] || "https://images.unsplash.com/photo-1721146378270-1b93839f7ae7?w=1080"}
              alt={`About ${brandConfig.brandName}`}
              className="relative rounded-2xl shadow-xl"
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 
              className="mb-6 text-4xl font-bold"
              style={{ color: brandConfig.colorPalette.text }}
            >
              Why Choose {brandConfig.brandName}
            </h2>
            <p 
              className="mb-8 text-lg"
              style={{ color: brandConfig.colorPalette.text, opacity: 0.8 }}
            >
              {brandConfig.brandDescription}
            </p>
            
            <div className="space-y-4">
              {[
                "Premium quality and service",
                "Expert team and support",
                "Trusted by thousands",
                "Innovative solutions",
                "Customer satisfaction guaranteed",
                "Professional consultation",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div 
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: brandConfig.colorPalette.primary }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span style={{ color: brandConfig.colorPalette.text, opacity: 0.9 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
