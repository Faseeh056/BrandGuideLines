import { motion } from "motion/react";
import { Play, Volume2, Maximize } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import type { BrandConfig } from "../shared-brand-config";

interface FeaturedVideoProps {
  brandConfig: BrandConfig;
}

export function FeaturedVideo({ brandConfig }: FeaturedVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { colorPalette, stats } = brandConfig;
  
  const videoGradient = `linear-gradient(to bottom right, ${colorPalette.primary}dd, ${colorPalette.secondary}dd, ${colorPalette.accent}dd)`;
  const buttonGradient = `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.secondary})`;
  const progressGradient = `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.secondary})`;
  const textGradient = `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.secondary})`;

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl mb-4" style={{ color: colorPalette.text }}>
            Behind The <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: textGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >Scenes</span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: colorPalette.text, opacity: 0.7 }}>
            {brandConfig.brandDescription}
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
            <div className="absolute inset-0" style={{ background: videoGradient }}>
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
                      className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: 'white',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = buttonGradient;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <Play
                        className="w-8 h-8 ml-1"
                        style={{ color: colorPalette.primary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'white';
                        }}
                      />
                    </motion.button>
                  </div>

                  <h3 className="mb-2">{brandConfig.brandName} Show 2024</h3>
                  <p style={{ color: colorPalette.background, opacity: 0.8 }}>Click to watch the runway experience</p>
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
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white"
                    style={{ color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colorPalette.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white"
                    style={{ color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colorPalette.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <span className="text-white text-sm">0:00 / 5:23</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colorPalette.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ background: progressGradient }}
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
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-50"
            style={{ background: `linear-gradient(to bottom right, ${colorPalette.accent}, ${colorPalette.secondary})` }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-2xl opacity-50"
            style={{ background: `linear-gradient(to bottom right, ${colorPalette.primary}, ${colorPalette.secondary})` }}
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
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center p-6 rounded-2xl"
              style={{
                background: `linear-gradient(to bottom right, ${colorPalette.background}, ${colorPalette.primary}15)`,
              }}
            >
              <div
                className="text-3xl md:text-4xl mb-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage: textGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: colorPalette.text, opacity: 0.7 }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
