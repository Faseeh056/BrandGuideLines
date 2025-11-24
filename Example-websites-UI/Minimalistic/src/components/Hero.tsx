import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-block rounded-full border border-neutral-200 px-4 py-1.5 text-neutral-600">
              Minimal Living Collection
            </div>
            
            <h1 className="mb-6 text-neutral-900">
              Pure Design, Timeless Comfort
            </h1>
            
            <p className="mb-8 max-w-xl text-neutral-600">
              Discover our curated collection of minimalist furniture. Each piece crafted in classic black and white to bring elegance and simplicity to your space.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button className="bg-neutral-900 hover:bg-neutral-800">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-neutral-300 text-neutral-900 hover:bg-neutral-50">
                View Lookbook
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-neutral-200 pt-8">
              <div>
                <div className="mb-1 text-neutral-900">
                  500+
                </div>
                <div className="text-neutral-600">Products</div>
              </div>
              <div>
                <div className="mb-1 text-neutral-900">
                  50k+
                </div>
                <div className="text-neutral-600">Happy Homes</div>
              </div>
              <div>
                <div className="mb-1 text-neutral-900">
                  Free
                </div>
                <div className="text-neutral-600">Delivery</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1708758487256-8a3a73565dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYmxhY2slMjBzb2ZhfGVufDF8fHx8MTc2MzcyMDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Minimal black sofa"
              className="relative rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
