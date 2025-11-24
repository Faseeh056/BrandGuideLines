import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const collections = [
  {
    id: 1,
    title: "Premium Suits",
    description: "Executive Power",
    image: "https://images.unsplash.com/photo-1697319501786-8f5dc64326ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmFzaGlvbiUyMHN1aXR8ZW58MXx8fHwxNzYzNzEwNjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Traditional Elegance",
    description: "Shalwar Kameez",
    image: "https://images.unsplash.com/photo-1663082076137-486bc3ff6fd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MzcxOTE5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: 3,
    title: "Street Style",
    description: "Urban Collection",
    image: "https://images.unsplash.com/photo-1573136810265-a584af43f98f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHN0cmVldHdlYXIlMjBmYXNoaW9ufGVufDF8fHx8MTc2MzcxOTE5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "from-orange-500 to-yellow-600",
  },
];

export function CollectionGrid() {
  return (
    <section className="py-20 px-6 md:px-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-gray-900 mb-4">
            Featured <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Collections</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated styles for every occasion. From boardrooms to celebrations, we've got you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer"
            >
              <div className="aspect-[3/4] relative">
                <ImageWithFallback
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <p className="text-sm mb-2 opacity-90">{collection.description}</p>
                    <h3 className="mb-4">{collection.title}</h3>
                    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${collection.color} rounded-full text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300`}>
                      Shop Now →
                    </div>
                  </motion.div>
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${collection.color} rounded-full blur-xl opacity-60`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
