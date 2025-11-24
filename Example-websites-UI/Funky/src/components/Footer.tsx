import { motion } from "motion/react";
import { Sparkles, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const footerLinks = {
    Shop: ["Men's Collection", "Women's Collection", "Shalwar Kameez", "Suits & Formals", "Casual Wear"],
    About: ["Our Story", "Designers", "Sustainability", "Careers", "Press"],
    Support: ["Contact Us", "FAQs", "Shipping Info", "Returns", "Size Guide"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"],
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white pt-20 pb-10 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <span className="tracking-wider">FUNKIFY</span>
              </div>
              <p className="text-purple-200 text-sm">
                Bold. Funky. Fearless. Express yourself with fashion that speaks your language.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, color: "hover:text-pink-400" },
                  { icon: Facebook, color: "hover:text-blue-400" },
                  { icon: Twitter, color: "hover:text-cyan-400" },
                  { icon: Youtube, color: "hover:text-red-400" },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center ${social.color} transition-colors`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h4 className="mb-4 text-yellow-400">{category}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-200 text-sm">
              © 2024 Funkify Fashion. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-purple-200">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-white transition-colors"
              >
                Privacy
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-white transition-colors"
              >
                Terms
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-white transition-colors"
              >
                Cookies
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500" />
      </div>
    </footer>
  );
}
