import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <section className="bg-neutral-50 px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1721146378270-1b93839f7ae7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBibGFjayUyMHdoaXRlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NjM3MjA4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Modern living room"
              className="relative rounded-2xl shadow-xl"
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="mb-6 text-neutral-900">Why Choose MONO</h2>
            <p className="mb-8 text-neutral-600">
              We believe in the philosophy of less is more. Our furniture collection embodies timeless design, exceptional quality, and the perfect balance of black and white aesthetics.
            </p>
            
            <div className="space-y-4">
              {[
                "Handcrafted with premium materials",
                "Timeless monochrome design",
                "Free shipping on all orders",
                "30-day easy returns",
                "Lifetime warranty on select pieces",
                "Expert interior design consultation",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
