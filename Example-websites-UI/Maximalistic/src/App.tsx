import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Products } from "./components/Products";
import { Testimonials } from "./components/Testimonials";
import { Gallery } from "./components/Gallery";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50">
      <Hero />
      <About />
      <Products />
      <Testimonials />
      <Gallery />
      <Footer />
    </div>
  );
}
