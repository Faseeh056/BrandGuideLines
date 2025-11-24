import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Instagram, Heart, MessageCircle } from "lucide-react";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1663072302693-d92701c4ef42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MzcxMTU4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    likes: 1234,
    comments: 89
  },
  {
    url: "https://images.unsplash.com/photo-1722938687754-d77c159da3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjBmb29kfGVufDF8fHx8MTc2MzYzMDk4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    likes: 987,
    comments: 65
  },
  {
    url: "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBnb3VybWV0JTIwZm9vZHxlbnwxfHx8fDE3NjM2MTk1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    likes: 2100,
    comments: 145
  },
  {
    url: "https://images.unsplash.com/photo-1761296152332-88ada22be48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MzY3NDYzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    likes: 1756,
    comments: 92
  },
  {
    url: "https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZvb2QlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MzY3NDE4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    likes: 1543,
    comments: 78
  },
  {
    url: "https://images.unsplash.com/photo-1651352650142-385087834d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGhlYWx0aHklMjBmb29kfGVufDF8fHx8MTc2MzU5ODUwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    likes: 891,
    comments: 54
  }
];

export function Gallery() {
  return (
    <div className="relative py-24 bg-gradient-to-br from-rose-100 via-pink-100 to-orange-100 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-pink-400 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-400 rounded-full opacity-20 blur-3xl" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white rounded-full shadow-2xl transform rotate-2">
            <Instagram className="w-8 h-8" />
            <span className="text-xl">Follow Our Delicious Journey!</span>
          </div>
          
          <h2 className="text-7xl">
            <span className="text-rose-600">INSTAGRAM</span>
            <span className="block text-orange-600">FEED 📸</span>
          </h2>
          
          <p className="text-xl text-gray-700">
            Tag us @foodbrand for a chance to be featured! 🌟
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 border-4 border-white"
            >
              <ImageWithFallback
                src={image.url}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                <div className="flex gap-6 text-white">
                  <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6 fill-white" />
                    <span>{image.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    <span>{image.comments}</span>
                  </div>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all"
          >
            <Instagram className="w-7 h-7" />
            Follow @foodbrand on Instagram
          </a>
        </div>

        {/* Video section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-8 rounded-3xl shadow-2xl">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                <div className="text-center text-white space-y-4">
                  <div className="text-6xl">🎬</div>
                  <div className="text-2xl">Behind the Scenes</div>
                  <div className="text-gray-400">Watch our culinary magic happen!</div>
                  <div className="pt-4">
                    <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full hover:from-orange-600 hover:to-pink-600 transition-colors shadow-xl">
                      ▶ Play Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
