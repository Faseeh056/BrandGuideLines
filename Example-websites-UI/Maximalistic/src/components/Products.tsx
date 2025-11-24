import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart, Flame } from "lucide-react";

const products = [
  {
    name: "Supreme Burger Deluxe",
    description: "Juicy patty with premium toppings",
    price: "$18.99",
    image: "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBnb3VybWV0JTIwZm9vZHxlbnwxfHx8fDE3NjM2MTk1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "🔥 BESTSELLER",
    color: "orange",
    rating: 4.9
  },
  {
    name: "Artisan Pasta Bowl",
    description: "Handmade pasta with secret sauce",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1722938687754-d77c159da3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjBmb29kfGVufDF8fHx8MTc2MzYzMDk4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "⭐ NEW",
    color: "pink",
    rating: 4.8
  },
  {
    name: "Heavenly Dessert",
    description: "Sweet paradise in every bite",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1761296152332-88ada22be48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MzY3NDYzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "🍰 POPULAR",
    color: "yellow",
    rating: 5.0
  },
  {
    name: "Margherita Supreme",
    description: "Classic Italian perfection",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZvb2QlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MzY3NDE4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "👑 PREMIUM",
    color: "rose",
    rating: 4.9
  },
  {
    name: "Fresh Garden Bowl",
    description: "Nutrient-packed healthy goodness",
    price: "$14.99",
    image: "https://images.unsplash.com/photo-1651352650142-385087834d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGhlYWx0aHklMjBmb29kfGVufDF8fHx8MTc2MzU5ODUwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "🥗 HEALTHY",
    color: "green",
    rating: 4.7
  },
  {
    name: "Chef's Special Platter",
    description: "A taste of everything amazing",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1526401363794-c96708fb8089?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjM3MTE1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "🌟 SIGNATURE",
    color: "purple",
    rating: 5.0
  }
];

const colorClasses = {
  orange: "from-orange-500 to-orange-700",
  pink: "from-pink-500 to-pink-700",
  yellow: "from-yellow-500 to-yellow-700",
  rose: "from-rose-500 to-rose-700",
  green: "from-green-500 to-green-700",
  purple: "from-purple-500 to-purple-700"
};

export function Products() {
  return (
    <div className="relative py-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-rose-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-20 w-96 h-96 bg-orange-300 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full opacity-10 blur-3xl" />
      
      {/* Floating elements */}
      <div className="absolute top-40 right-40 animate-bounce">
        <Flame className="w-16 h-16 text-orange-400 opacity-30" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block">
            <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 text-lg shadow-xl">
              ⚡ Our Menu Highlights
            </Badge>
          </div>
          
          <h2 className="text-7xl">
            <span className="text-orange-600">SIGNATURE</span>
            <span className="block text-pink-600">CREATIONS ✨</span>
          </h2>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            🎯 Handpicked favorites that will make your taste buds dance with joy!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-8 border-transparent hover:border-orange-200"
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-20">
                <Badge className={`bg-gradient-to-r ${colorClasses[product.color as keyof typeof colorClasses]} text-white px-4 py-2 shadow-xl`}>
                  {product.badge}
                </Badge>
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>

                <h3 className="text-2xl text-gray-900">{product.name}</h3>
                
                <p className="text-gray-600">{product.description}</p>

                <div className="flex items-center justify-between pt-4 border-t-2 border-orange-100">
                  <div className="text-3xl text-orange-600">{product.price}</div>
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 shadow-lg">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-200 to-transparent rounded-tl-full opacity-20" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="lg" className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 text-white px-12 py-6 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-transform">
            View Full Menu 📋
          </Button>
        </div>
      </div>
    </div>
  );
}
