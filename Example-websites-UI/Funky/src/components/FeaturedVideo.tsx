import { motion } from "motion/react";
import { Play, Volume2, Maximize } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function FeaturedVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl text-gray-900 mb-4">
            Behind The <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Scenes</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch our latest fashion show and see how we bring funky fashion to life
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto group"
        >
          {/* Video Container - Using a placeholder image since we can't embed actual videos */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
              <div className="w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <motion.div
                  className="text-center text-white"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative inline-block mb-6">
                    {/* Pulsing Rings */}
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full opacity-30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full opacity-20"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    
                    {/* Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300"
                    >
                      <Play className="w-8 h-8 text-purple-600 group-hover:text-white ml-1" />
                    </motion.button>
                  </div>

                  <h3 className="mb-2">Fashion Show 2024</h3>
                  <p className="text-purple-200">Click to watch the runway experience</p>
                </motion.div>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="ghost" className="text-white hover:text-purple-400">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:text-purple-400">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <span className="text-white text-sm">0:00 / 5:23</span>
                </div>
                <Button size="sm" variant="ghost" className="text-white hover:text-purple-400">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: isPlaying ? "100%" : "0%" }}
                  transition={{ duration: 5, repeat: isPlaying ? Infinity : 0 }}
                />
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50"
          />
        </motion.div>

        {/* Stats Below Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { label: "Collections", value: "25+" },
            { label: "Designers", value: "50+" },
            { label: "Countries", value: "15+" },
            { label: "Shows/Year", value: "100+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl"
            >
              <div className="text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
