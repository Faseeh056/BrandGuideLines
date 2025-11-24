import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900">
                <span className="text-white">M</span>
              </div>
              <span className="text-neutral-900">MONO</span>
            </div>
            <p className="mb-6 text-neutral-600">
              Minimalist furniture for modern living.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="mb-4 text-neutral-900">Products</div>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Web Development
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Mobile Apps
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Cloud Services
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                AI Solutions
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="mb-4 text-neutral-900">Company</div>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                About Us
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Careers
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Blog
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Press Kit
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="mb-4 text-neutral-900">Resources</div>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Documentation
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Support
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Privacy Policy
              </a>
              <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-900">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-neutral-500">
          © {currentYear} MONO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}