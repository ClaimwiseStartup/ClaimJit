import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import WhoItsForSection from "../components/WhoItsForSection";
import StatsSection from "../components/StatsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import PhotoBand from "../components/PhotoBand";
import ScenariosSection from "../components/ScenariosSection";
import CodeGuideSection from "../components/CodeGuideSection";
import FeaturesSection from "../components/FeaturesSection";
import ProductDemoSection from "../components/ProductDemoSection";
import DenialPlaybookSection from "../components/DenialPlaybookSection";
import TestimonialSection from "../components/TestimonialSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { IMAGES } from "../components/images";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <WhoItsForSection />
      <StatsSection />
      <HowItWorksSection />
      <PhotoBand
        src={IMAGES.audit}
        alt="Coder reviewing a paper chart next to a computer"
        eyebrow="Chart to claim"
        line="From the signed note to a clean claim, before it ever reaches the payer."
      />
      <ScenariosSection />
      <CodeGuideSection />
      <FeaturesSection />
      <ProductDemoSection />
      <DenialPlaybookSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  );
}
