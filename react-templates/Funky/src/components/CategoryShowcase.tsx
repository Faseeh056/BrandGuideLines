import { motion } from "motion/react";
import { Shirt, Package, Sparkles, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { BrandConfig } from "../shared-brand-config";

interface CategoryShowcaseProps {
  brandConfig: BrandConfig;
}

export function CategoryShowcase({ brandConfig }: CategoryShowcaseProps) {
  const { colorPalette, images, features, stats } = brandConfig;
  
  // Create categories from features
  const categories = features.slice(0, 4).map((feature, index) => {
    const colors = [colorPalette.primary, colorPalette.secondary, colorPalette.accent, colorPalette.primary];
    const icons = [Shirt, Package, Sparkles, Star];
    return {
      icon: icons[index] || Shirt,
      title: feature.title,
      count: stats[index]?.value + " " + stats[index]?.label || `${(index + 1) * 25}+ Items`,
      color: colors[index],
    };
  });

  // Create gradient background from brand colors
  const sectionGradient = `linear-gradient(to bottom right, ${colorPalette.primary}dd, ${colorPalette.secondary}dd, ${colorPalette.accent}dd)`;
  const imageGradient = `linear-gradient(to right, ${colorPalette.accent}, ${colorPalette.secondary}, ${colorPalette.primary})`;

  return (
    <section className="py-20 px-6 md:px-12 text-white relative overflow-hidden" style={{ background: sectionGradient }}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className="absolute -inset-8 rounded-full blur-3xl opacity-40"
              style={{ background: imageGradient }}
            />
            <div className="relative grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="rounded-2xl overflow-hidden shadow-2xl"
              >
                <ImageWithFallback
                  src={images.gallery[0] || images.hero || "https://images.unsplash.com/photo-1763558958792-85731d9b60f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwc2hpcnQlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MzcxOTE5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                  alt={brandConfig.brandName}
                  className="w-full h-64 object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="rounded-2xl overflow-hidden shadow-2xl mt-8"
              >
                <ImageWithFallback
                  src={images.gallery[1] || images.hero || "https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZXxlbnwxfHx8fDE3NjM2MzcxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                  alt={brandConfig.brandName}
                  className="w-full h-64 object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Categories */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-5xl md:text-6xl mb-4">
                Explore Our <span style={{ color: colorPalette.accent }}>Categories</span>
              </h2>
              <p style={{ color: colorPalette.background, opacity: 0.8 }}>
                {brandConfig.brandDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 cursor-pointer group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white mb-1">{category.title}</h3>
                    <p className="text-sm" style={{ color: colorPalette.background, opacity: 0.8 }}>{category.count}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 pt-4"
            >
              {stats.slice(0, 2).map((stat, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full">
                  <span style={{ color: index === 0 ? colorPalette.accent : colorPalette.secondary }}>
                    {index === 0 ? '⭐ ' : '🎉 '}{stat.value}
                  </span> {stat.label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
