import { Sofa, Armchair, Table2, Lamp, Bed, ShoppingBag } from "lucide-react";
import { BrandConfig } from "../shared-brand-config";

interface ServicesProps {
  brandConfig: BrandConfig;
}

export function Services({ brandConfig }: ServicesProps) {
  const categories = brandConfig.features.length >= 3 ? 
    brandConfig.features.slice(0, 6).map((feature, idx) => ({
      icon: [Sofa, Armchair, Table2, Lamp, Bed, ShoppingBag][idx % 6],
      title: feature.title,
      description: feature.description,
      color: "from-neutral-800 to-neutral-900",
    })) :
    [
      {
        icon: Sofa,
        title: "Service 1",
        description: "High quality service and products",
        color: "from-neutral-800 to-neutral-900",
      },
      {
        icon: Armchair,
        title: "Service 2",
        description: "Expert support and consultation",
        color: "from-neutral-700 to-neutral-900",
      },
      {
        icon: Table2,
        title: "Service 3",
        description: "Premium quality guaranteed",
        color: "from-neutral-800 to-neutral-900",
      },
    ];

  return (
    <section className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 
            className="mb-4 text-4xl font-bold"
            style={{ color: brandConfig.colorPalette.text }}
          >
            Our Services
          </h2>
          <p 
            className="mx-auto max-w-2xl"
            style={{ color: brandConfig.colorPalette.text, opacity: 0.8 }}
          >
            Discover what makes us unique
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border bg-white p-8 transition-all hover:shadow-xl"
              style={{ borderColor: brandConfig.colorPalette.accent }}
            >
              <div 
                className="mb-4 inline-flex rounded-xl p-3"
                style={{ backgroundColor: brandConfig.colorPalette.primary }}
              >
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 
                className="mb-3 text-xl font-semibold"
                style={{ color: brandConfig.colorPalette.text }}
              >
                {category.title}
              </h3>
              <p style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                {category.description}
              </p>
              
              {/* Hover effect gradient */}
              <div 
                className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-10"
                style={{ backgroundColor: brandConfig.colorPalette.primary }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
