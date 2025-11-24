import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-orange-900 to-pink-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <h3 className="text-4xl mb-2">
                <span className="text-yellow-400">FOOD</span>
                <span className="text-pink-400">BRAND</span>
              </h3>
              <p className="text-white/70">
                🌟 Serving happiness one dish at a time since 2020!
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-2xl text-yellow-400 mb-6">Quick Links 🔗</h4>
            <ul className="space-y-3">
              {["About Us", "Our Menu", "Catering", "Franchise", "Careers", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors hover:translate-x-2 inline-block">
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-2xl text-pink-400 mb-6">Contact Us 📞</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                <span className="text-white/70">123 Food Street, Culinary City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-pink-400 flex-shrink-0" />
                <span className="text-white/70">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <span className="text-white/70">hello@foodbrand.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-2xl text-orange-400 mb-6">Newsletter 💌</h4>
            <p className="text-white/70 mb-4">
              Subscribe for exclusive deals and updates!
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Your email..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-6"
              />
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-full py-6 shadow-xl">
                Subscribe Now! 🎉
              </Button>
            </div>
          </div>
        </div>

        {/* Opening Hours Banner */}
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-3xl p-8 mb-12 shadow-2xl transform hover:scale-105 transition-transform">
          <div className="text-center space-y-2">
            <h4 className="text-3xl text-white">⏰ Opening Hours</h4>
            <p className="text-white/90 text-xl">Monday - Friday: 9AM - 10PM | Saturday - Sunday: 10AM - 11PM</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60">
            <p className="flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" /> by FoodBrand Team
            </p>
            <p>© 2024 FoodBrand. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
