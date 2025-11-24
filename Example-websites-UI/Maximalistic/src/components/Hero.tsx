import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Sparkles, Star, Award, Heart } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-rose-600 to-pink-600 min-h-screen">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300 rounded-full opacity-30 blur-2xl" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 rotate-12">
          <Star className="w-16 h-16 text-yellow-300 fill-yellow-300" />
        </div>
        <div className="absolute top-40 right-32 -rotate-12">
          <Sparkles className="w-20 h-20 text-pink-300 fill-pink-300" />
        </div>
        <div className="absolute bottom-32 left-40 rotate-45">
          <Award className="w-14 h-14 text-orange-300 fill-orange-300" />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <Heart className="w-12 h-12 text-rose-300 fill-rose-300" />
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-block px-6 py-2 bg-yellow-400 text-orange-900 rounded-full rotate-2 shadow-lg">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Premium Quality Since 2020
              </span>
            </div>
            
            <h1 className="text-7xl lg:text-8xl text-white space-y-2">
              <div className="relative inline-block">
                <span className="relative z-10">FLAVOR</span>
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-yellow-400 -rotate-1" />
              </div>
              <div className="text-yellow-300">EXPLOSION</div>
              <div className="text-pink-200">IN EVERY</div>
              <div className="relative inline-block">
                <span className="relative z-10">BITE!</span>
                <div className="absolute top-1/2 -left-2 w-full h-4 bg-pink-400 rotate-2" />
              </div>
            </h1>

            <p className="text-xl text-white/90 max-w-lg">
              🌟 Handcrafted with passion, served with love. Experience the ultimate
              food journey that will tantalize your taste buds and leave you craving for more!
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-orange-900 shadow-xl text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-transform">
                Order Now 🍴
              </Button>
              <Button size="lg" variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white border-2 backdrop-blur-sm text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-transform">
                View Menu 📖
              </Button>
            </div>

            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-4xl text-yellow-300">500+</div>
                <div className="text-white/80">Happy Customers</div>
              </div>
              <div className="w-px bg-white/30" />
              <div className="text-center">
                <div className="text-4xl text-yellow-300">50+</div>
                <div className="text-white/80">Signature Dishes</div>
              </div>
              <div className="w-px bg-white/30" />
              <div className="text-center">
                <div className="text-4xl text-yellow-300">4.9★</div>
                <div className="text-white/80">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Images - Maximalist Collage */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Main large image */}
            <div className="absolute top-0 right-0 w-80 h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform z-10 border-8 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1663072302693-d92701c4ef42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MzcxMTU4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Gourmet food"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Second image */}
            <div className="absolute top-24 left-0 w-64 h-72 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform z-20 border-8 border-yellow-400">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1722938687754-d77c159da3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjBmb29kfGVufDF8fHx8MTc2MzYzMDk4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Pasta dish"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Third image */}
            <div className="absolute bottom-0 right-20 w-72 h-64 rounded-3xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 transition-transform z-15 border-8 border-pink-400">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBnb3VybWV0JTIwZm9vZHxlbnwxfHx8fDE3NjM2MTk1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Gourmet burger"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative badges */}
            <div className="absolute -top-4 left-10 bg-yellow-400 text-orange-900 rounded-full px-6 py-3 shadow-xl transform -rotate-12 z-30">
              <span>✨ NEW!</span>
            </div>
            <div className="absolute bottom-10 left-10 bg-pink-500 text-white rounded-full px-6 py-3 shadow-xl transform rotate-12 z-30">
              <span>🔥 HOT!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FFF7ED"/>
        </svg>
      </div>
    </div>
  );
}
