import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900">
              <span className="text-white">M</span>
            </div>
            <span className="text-neutral-900">MONO</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Sofas
            </a>
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Chairs
            </a>
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Tables
            </a>
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Collections
            </a>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" className="text-neutral-600">
              Cart
            </Button>
            <Button className="bg-neutral-900 hover:bg-neutral-800">
              Shop Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-neutral-900" />
            ) : (
              <Menu className="h-6 w-6 text-neutral-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 flex flex-col gap-4 border-t border-neutral-200 pt-4 md:hidden">
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Products
            </a>
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Solutions
            </a>
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Resources
            </a>
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Pricing
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline">Sign In</Button>
              <Button className="bg-neutral-900 hover:bg-neutral-800">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}