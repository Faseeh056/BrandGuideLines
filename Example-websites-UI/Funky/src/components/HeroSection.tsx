import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-60"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-60"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <span className="tracking-wider text-purple-900">FUNKIFY</span>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
            Men
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
            Women
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
            Collections
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
            About
          </a>
        </div>
        <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
          Shop Now
        </Button>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
          >
            New Collection 2024
          </motion.div>
          <h1 className="text-6xl md:text-8xl text-gray-900 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              BOLD.
            </span>
            <br />
            <span className="text-gray-800">FUNKY.</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              FEARLESS.
            </span>
          </h1>
          <p className="text-gray-600 max-w-md">
            Discover fashion that speaks your language. From traditional elegance to modern streetwear,
            express yourself with our funky collection.
          </p>
          <div className="flex gap-4">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Explore Collection <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline">
              Watch Video
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="relative z-10"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-3xl blur-2xl opacity-50" />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1685432531593-1afc8a152e5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBydW53YXl8ZW58MXx8fHwxNzYzNzEzNjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Fashion Model"
              className="relative rounded-3xl shadow-2xl w-full h-[600px] object-cover"
            />
          </motion.div>

          {/* Floating Tags */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-10 -left-6 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-purple-200"
          >
            <span className="text-purple-600">✨ Trending</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-20 -right-6 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-pink-200"
          >
            <span className="text-pink-600">🔥 Hot Sale</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
