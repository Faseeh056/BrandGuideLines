import { Sofa, Armchair, Table2, Lamp, Bed, ShoppingBag } from "lucide-react";

const categories = [
  {
    icon: Sofa,
    title: "Sofas",
    description: "Premium sectionals and couches in monochrome elegance.",
    color: "from-neutral-800 to-neutral-900",
  },
  {
    icon: Armchair,
    title: "Chairs",
    description: "Iconic seating designs that blend form and function.",
    color: "from-neutral-700 to-neutral-900",
  },
  {
    icon: Table2,
    title: "Tables",
    description: "Dining and coffee tables with clean, minimalist lines.",
    color: "from-neutral-800 to-neutral-900",
  },
  {
    icon: Bed,
    title: "Beds",
    description: "Sleek bedroom furniture for restful sanctuaries.",
    color: "from-neutral-700 to-neutral-900",
  },
  {
    icon: Lamp,
    title: "Lighting",
    description: "Statement pieces that illuminate with sophistication.",
    color: "from-neutral-800 to-neutral-900",
  },
  {
    icon: ShoppingBag,
    title: "Accessories",
    description: "Curated decor items to complete your minimal space.",
    color: "from-neutral-700 to-neutral-900",
  },
];

export function Services() {
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-neutral-900">Shop by Category</h2>
          <p className="mx-auto max-w-2xl text-neutral-600">
            Every piece designed to enhance your space with minimal aesthetics
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${category.color} p-3`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-neutral-900">{category.title}</h3>
              <p className="text-neutral-600">{category.description}</p>
              
              {/* Hover effect gradient */}
              <div className={`absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-r ${category.color} opacity-0 blur-3xl transition-opacity group-hover:opacity-10`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
