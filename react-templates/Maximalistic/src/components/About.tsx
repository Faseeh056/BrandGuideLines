import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChefHat, Leaf, Clock, Heart } from "lucide-react";
import { Badge } from "./ui/badge";

export function About() {
  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Collage */}
          <div className="relative h-[600px]">
            <div className="absolute top-0 left-0 w-72 h-80 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 border-8 border-orange-400">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1717838206417-c4fe2b9fb043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYzNjUyMjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Chef cooking"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-32 right-0 w-80 h-72 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 border-8 border-pink-400 z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGluZ3JlZGllbnRzJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NjM2NjIzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fresh ingredients"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 left-16 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl transform rotate-6 border-8 border-yellow-400 z-20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1690913964149-ba89c36cbbc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBlbmpveWluZyUyMGZvb2R8ZW58MXx8fHwxNzYzNzExNTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="People enjoying food"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute top-10 right-10 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-full p-6 shadow-2xl transform rotate-12 z-30">
              <ChefHat className="w-12 h-12" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-orange-500 text-white px-4 py-2 text-sm">🌟 Award Winning</Badge>
              <Badge className="bg-pink-500 text-white px-4 py-2 text-sm">💯 100% Fresh</Badge>
              <Badge className="bg-yellow-500 text-white px-4 py-2 text-sm">🏆 Top Rated</Badge>
            </div>

            <div>
              <h2 className="text-6xl text-orange-900 mb-4">
                OUR STORY OF
                <span className="block text-pink-600">DELICIOUS</span>
                <span className="block text-orange-600">EXCELLENCE!</span>
              </h2>
            </div>

            <div className="space-y-4 text-lg text-gray-700">
              <p className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-l-8 border-orange-500 shadow-lg">
                🎨 Born from a passion for creating extraordinary food experiences, 
                we blend traditional recipes with modern culinary innovation. Every dish 
                tells a story, crafted with love and served with pride!
              </p>
              
              <p className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-l-8 border-pink-500 shadow-lg">
                🌈 Our commitment to using only the freshest, locally-sourced ingredients 
                ensures that every bite is bursting with authentic flavors and nutritional goodness.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform">
                <ChefHat className="w-12 h-12 mb-3" />
                <h3 className="text-2xl mb-2">Master Chefs</h3>
                <p className="text-white/90">Award-winning culinary experts</p>
              </div>

              <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform">
                <Leaf className="w-12 h-12 mb-3" />
                <h3 className="text-2xl mb-2">Fresh Daily</h3>
                <p className="text-white/90">Farm to table goodness</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform">
                <Clock className="w-12 h-12 mb-3" />
                <h3 className="text-2xl mb-2">Quick Service</h3>
                <p className="text-white/90">Fast & efficient delivery</p>
              </div>

              <div className="bg-gradient-to-br from-rose-400 to-rose-600 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform">
                <Heart className="w-12 h-12 mb-3" />
                <h3 className="text-2xl mb-2">Made with Love</h3>
                <p className="text-white/90">Every dish is special</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
