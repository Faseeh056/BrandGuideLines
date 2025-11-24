import { HeroSection } from "./components/HeroSection";
import { CollectionGrid } from "./components/CollectionGrid";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { FeaturedVideo } from "./components/FeaturedVideo";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <HeroSection />
      <CollectionGrid />
      <CategoryShowcase />
      <FeaturedVideo />
      <Newsletter />
      <Footer />
    </div>
  );
}
