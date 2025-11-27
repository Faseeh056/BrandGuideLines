import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { BrandConfig } from "../shared-brand-config";

interface NavbarProps {
  brandConfig: BrandConfig;
}

export function Navbar({ brandConfig }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {brandConfig.logoUrl ? (
              <img 
                src={brandConfig.logoUrl} 
                alt={brandConfig.brandName} 
                className="h-9 w-auto"
              />
            ) : (
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: brandConfig.colorPalette.primary }}
              >
                <span className="text-white">{brandConfig.brandName[0]}</span>
              </div>
            )}
            <span 
              className="font-medium"
              style={{ color: brandConfig.colorPalette.text }}
            >
              {brandConfig.brandName}
            </span>
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
            <Button 
              className="text-white"
              style={{ backgroundColor: brandConfig.colorPalette.primary }}
            >
              Shop Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" style={{ color: brandConfig.colorPalette.text }} />
            ) : (
              <Menu className="h-6 w-6" style={{ color: brandConfig.colorPalette.text }} />
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
              About
            </a>
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Contact
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button 
                className="text-white"
                style={{ backgroundColor: brandConfig.colorPalette.primary }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}