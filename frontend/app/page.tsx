import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import ProductDemoSection from "../components/ProductDemoSection";
import TestimonialSection from "../components/TestimonialSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ProductDemoSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  );
}
