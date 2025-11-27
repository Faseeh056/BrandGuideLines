import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { BrandConfig } from "../shared-brand-config";

interface FooterProps {
  brandConfig: BrandConfig;
}

export function Footer({ brandConfig }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="border-t px-6 py-16"
      style={{ 
        borderColor: brandConfig.colorPalette.accent,
        backgroundColor: brandConfig.colorPalette.background 
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
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
              <span style={{ color: brandConfig.colorPalette.text }}>
                {brandConfig.brandName}
              </span>
            </div>
            <p 
              className="mb-6"
              style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}
            >
              {brandConfig.brandDescription}
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
                style={{ borderColor: brandConfig.colorPalette.accent }}
              >
                <Twitter className="h-4 w-4" style={{ color: brandConfig.colorPalette.text }} />
              </a>
              <a 
                href="#" 
                className="flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
                style={{ borderColor: brandConfig.colorPalette.accent }}
              >
                <Github className="h-4 w-4" style={{ color: brandConfig.colorPalette.text }} />
              </a>
              <a 
                href="#" 
                className="flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
                style={{ borderColor: brandConfig.colorPalette.accent }}
              >
                <Linkedin className="h-4 w-4" style={{ color: brandConfig.colorPalette.text }} />
              </a>
              <a 
                href="#" 
                className="flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
                style={{ borderColor: brandConfig.colorPalette.accent }}
              >
                <Mail className="h-4 w-4" style={{ color: brandConfig.colorPalette.text }} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="mb-4 font-semibold" style={{ color: brandConfig.colorPalette.text }}>
              Products
            </div>
            <div className="flex flex-col gap-3">
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                Products
              </a>
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                Services
              </a>
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                Solutions
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="mb-4 font-semibold" style={{ color: brandConfig.colorPalette.text }}>
              Company
            </div>
            <div className="flex flex-col gap-3">
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                About Us
              </a>
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                Careers
              </a>
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                Blog
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="mb-4 font-semibold" style={{ color: brandConfig.colorPalette.text }}>
              Contact
            </div>
            <div className="flex flex-col gap-3">
              {brandConfig.contact.email && (
                <a href={`mailto:${brandConfig.contact.email}`} style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                  {brandConfig.contact.email}
                </a>
              )}
              {brandConfig.contact.phone && (
                <a href={`tel:${brandConfig.contact.phone}`} style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                  {brandConfig.contact.phone}
                </a>
              )}
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                Privacy Policy
              </a>
              <a href="#" style={{ color: brandConfig.colorPalette.text, opacity: 0.7 }}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div 
          className="mt-12 border-t pt-8 text-center"
          style={{ 
            borderColor: brandConfig.colorPalette.accent,
            color: brandConfig.colorPalette.text,
            opacity: 0.6 
          }}
        >
          © {currentYear} {brandConfig.brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}