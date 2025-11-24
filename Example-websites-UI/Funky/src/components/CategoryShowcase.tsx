import { motion } from "motion/react";
import { Shirt, Package, Sparkles, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const categories = [
  {
    icon: Shirt,
    title: "Designer Shirts",
    count: "150+ Styles",
    color: "bg-purple-500",
  },
  {
    icon: Package,
    title: "Complete Collections",
    count: "50+ Sets",
    color: "bg-pink-500",
  },
  {
    icon: Sparkles,
    title: "Limited Edition",
    count: "25+ Pieces",
    color: "bg-yellow-500",
  },
  {
    icon: Star,
    title: "Best Sellers",
    count: "100+ Items",
    color: "bg-orange-500",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white relative overflow-hidden">
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
            <div className="absolute -inset-8 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-full blur-3xl opacity-40" />
            <div className="relative grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="rounded-2xl overflow-hidden shadow-2xl"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1763558958792-85731d9b60f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwc2hpcnQlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MzcxOTE5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Shirt Collection"
                  className="w-full h-64 object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="rounded-2xl overflow-hidden shadow-2xl mt-8"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZXxlbnwxfHx8fDE3NjM2MzcxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Fashion Store"
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
                Explore Our <span className="text-yellow-400">Categories</span>
              </h2>
              <p className="text-purple-200">
                From casual to formal, traditional to modern - find your perfect style match.
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
                    <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white mb-1">{category.title}</h3>
                    <p className="text-purple-200 text-sm">{category.count}</p>
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
              <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full">
                <span className="text-yellow-400">⭐ 4.9</span> Rating
              </div>
              <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full">
                <span className="text-pink-400">🎉 10K+</span> Happy Customers
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
