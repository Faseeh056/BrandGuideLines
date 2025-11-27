import { motion } from "motion/react";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { FeatureCard } from "./components/FeatureCard";
import { FuturisticCube } from "./components/FuturisticCube";
import { Button } from "./components/ui/button";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { getBrandConfig } from "./shared-brand-config";
import { useEffect } from "react";
import { 
  Zap, 
  Shield, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Play,
  ChevronDown
} from "lucide-react";

export default function App() {
  const brandConfig = getBrandConfig();

  useEffect(() => {
    // Apply brand colors to CSS variables
    document.documentElement.style.setProperty('--brand-primary', brandConfig.colorPalette.primary);
    document.documentElement.style.setProperty('--brand-secondary', brandConfig.colorPalette.secondary);
    document.documentElement.style.setProperty('--brand-accent', brandConfig.colorPalette.accent);
    document.documentElement.style.setProperty('--brand-bg', brandConfig.colorPalette.background);
    document.documentElement.style.setProperty('--brand-text', brandConfig.colorPalette.text);
  }, [brandConfig]);

  const features = brandConfig.features.length >= 4 ? 
    brandConfig.features.map((feature, idx) => ({
      icon: [Zap, Shield, Cpu, Sparkles][idx % 4],
      title: feature.title,
      description: feature.description
    })) :
    [
      {
        icon: Zap,
        title: "Lightning Fast",
        description: "Experience blazing speed with cutting-edge infrastructure"
      },
      {
        icon: Shield,
        title: "Ultra Secure",
        description: "Military-grade encryption keeps your data safe"
      },
      {
        icon: Cpu,
        title: "AI-Powered",
        description: "Advanced machine learning adapts to your needs"
      },
      {
        icon: Sparkles,
        title: "Next-Gen UX",
        description: "Intuitive interfaces for seamless interaction"
      }
    ];

  return (
    <div 
      className="min-h-screen text-white overflow-hidden" 
      style={{ 
        backgroundColor: brandConfig.colorPalette.background,
        color: brandConfig.colorPalette.text,
        fontFamily: brandConfig.fonts.body
      }}
    >
      <AnimatedBackground />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 container mx-auto px-6 py-6"
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            {brandConfig.logoUrl ? (
              <img 
                src={brandConfig.logoUrl} 
                alt={brandConfig.brandName} 
                className="h-10 w-auto"
              />
            ) : (
              <motion.div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${brandConfig.colorPalette.primary} 0%, ${brandConfig.colorPalette.secondary} 100%)`
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="w-6 h-6" />
              </motion.div>
            )}
            <span className="text-xl" style={{ color: brandConfig.colorPalette.text }}>
              {brandConfig.brandName}
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#technology" className="text-slate-300 hover:text-white transition-colors">Technology</a>
            <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
            <Button 
              className="text-white"
              style={{
                background: `linear-gradient(135deg, ${brandConfig.colorPalette.primary} 0%, ${brandConfig.colorPalette.secondary} 100%)`
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6"
            >
              <span style={{ color: brandConfig.colorPalette.primary }}>🚀 {brandConfig.industry}</span>
            </motion.div>
            
            <h1 
              className="text-5xl md:text-7xl mb-6 font-bold"
              style={{ 
                fontFamily: brandConfig.fonts.heading,
                color: brandConfig.colorPalette.text 
              }}
            >
              {brandConfig.brandName}
            </h1>
            
            <p className="text-xl mb-8" style={{ color: brandConfig.colorPalette.text, opacity: 0.8 }}>
              {brandConfig.brandDescription}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="gap-2 text-white"
                style={{
                  background: `linear-gradient(135deg, ${brandConfig.colorPalette.primary} 0%, ${brandConfig.colorPalette.secondary} 100%)`
                }}
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2"
                style={{ borderColor: brandConfig.colorPalette.primary }}
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {brandConfig.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                >
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: brandConfig.colorPalette.primary }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: brandConfig.colorPalette.text, opacity: 0.6 }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rotating Cube on Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FuturisticCube />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-blue-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Powerful Features</h2>
          <p className="text-xl text-slate-400">Built for tomorrow, available today</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="relative container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1613500429601-62a596776da7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY2lyY3VpdCUyMGJvYXJkfGVufDF8fHx8MTc2MzYzMjUwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Circuit Board Technology"
              className="relative rounded-2xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-6">Cutting-Edge Technology</h2>
            <p className="text-xl text-slate-300 mb-6">
              Our proprietary quantum neural networks process data at unprecedented speeds, 
              delivering insights in microseconds.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                { label: "Processing Speed", value: 98 },
                { label: "Accuracy Rate", value: 99 },
                { label: "Efficiency", value: 96 },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">{stat.label}</span>
                    <span className="text-blue-400">{stat.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Explore Technology
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="relative container mx-auto px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/20 p-12 md:p-16">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl mb-6">Innovation That Matters</h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of forward-thinking companies already using our platform 
                to revolutionize their operations.
              </p>
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Schedule a Demo
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzNjM0NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Abstract Technology"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl mb-6">Ready to Transform?</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Start your journey into the future. Experience the next evolution of technology.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10">
              Contact Sales
            </Button>
          </div>

          {/* Trusted by badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-wrap justify-center gap-8 items-center opacity-60"
          >
            <span className="text-slate-400">Trusted by industry leaders worldwide</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <span>NEXUS</span>
              </div>
              <p className="text-slate-400 text-sm">Building the future of technology, one innovation at a time.</p>
            </div>
            
            <div>
              <div className="mb-4">Product</div>
              <div className="space-y-2 text-sm text-slate-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>Security</div>
                <div>Enterprise</div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">Company</div>
              <div className="space-y-2 text-sm text-slate-400">
                <div>About</div>
                <div>Careers</div>
                <div>Blog</div>
                <div>Press</div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">Connect</div>
              <div className="space-y-2 text-sm text-slate-400">
                <div>Twitter</div>
                <div>LinkedIn</div>
                <div>GitHub</div>
                <div>Discord</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © 2025 NEXUS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}