import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Food Blogger",
    image: "https://images.unsplash.com/photo-1575433287483-8ec588f72417?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM3MTE1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "Absolutely mind-blowing! Every dish is a work of art. The flavors are incredibly bold and the presentation is stunning. I keep coming back for more!",
    rating: 5,
    color: "orange"
  },
  {
    name: "Michael Chen",
    role: "Restaurant Critic",
    image: "https://images.unsplash.com/photo-1690913964149-ba89c36cbbc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBlbmpveWluZyUyMGZvb2R8ZW58MXx8fHwxNzYzNzExNTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "In my 20 years of reviewing restaurants, this place stands out. The quality is unmatched, and the passion in every dish is evident. A true gem!",
    rating: 5,
    color: "pink"
  },
  {
    name: "Emma Rodriguez",
    role: "Regular Customer",
    image: "https://images.unsplash.com/photo-1657593088889-5105c637f2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzYzNjQ3MjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "This is my happy place! The atmosphere, the food, the service - everything is perfect. I've tried almost everything on the menu and loved it all!",
    rating: 5,
    color: "yellow"
  }
];

const colorClasses = {
  orange: {
    bg: "from-orange-400 to-orange-600",
    border: "border-orange-400"
  },
  pink: {
    bg: "from-pink-400 to-pink-600",
    border: "border-pink-400"
  },
  yellow: {
    bg: "from-yellow-400 to-yellow-600",
    border: "border-yellow-400"
  }
};

export function Testimonials() {
  return (
    <div className="relative py-24 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-300 rounded-full opacity-20 blur-3xl animate-pulse" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full shadow-xl transform -rotate-2">
            <span className="text-lg">💖 Customer Love Stories</span>
          </div>
          
          <h2 className="text-7xl">
            <span className="text-pink-600">WHAT OUR</span>
            <span className="block text-orange-600">FANS SAY! 🎉</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`relative p-8 bg-white rounded-3xl shadow-2xl border-8 ${
                colorClasses[testimonial.color as keyof typeof colorClasses].border
              } transform hover:scale-105 hover:-rotate-1 transition-all duration-300`}
            >
              {/* Quote icon */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-xl border-4 border-orange-200">
                <Quote className="w-8 h-8 text-orange-500" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-${testimonial.color}-200`}>
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>

              {/* Decorative corner */}
              <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${
                colorClasses[testimonial.color as keyof typeof colorClasses].bg
              } rounded-tl-full opacity-10`} />
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-3xl text-white text-center shadow-2xl transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">500+</div>
            <div className="text-white/90">Happy Customers</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-8 rounded-3xl text-white text-center shadow-2xl transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">4.9⭐</div>
            <div className="text-white/90">Average Rating</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 rounded-3xl text-white text-center shadow-2xl transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">1000+</div>
            <div className="text-white/90">Reviews</div>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-8 rounded-3xl text-white text-center shadow-2xl transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">98%</div>
            <div className="text-white/90">Would Recommend</div>
          </div>
        </div>
      </div>
    </div>
  );
}
