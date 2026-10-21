import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import StatementSection from "../components/StatementSection";
import StatsSection from "../components/StatsSection";
import WhoItsForSection from "../components/WhoItsForSection";
import ProductShowcase from "../components/ProductShowcase";
import HowItWorksSection from "../components/HowItWorksSection";
import PhotoBand from "../components/PhotoBand";
import CodeGuideSection from "../components/CodeGuideSection";
import FeaturesSection from "../components/FeaturesSection";
import ProductDemoSection from "../components/ProductDemoSection";
import DenialPlaybookSection from "../components/DenialPlaybookSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { VIDEOS, IMAGES } from "../components/images";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Navigation />
      <HeroSection />
      <StatementSection />
      <StatsSection />
      <WhoItsForSection />
      <ProductShowcase />
      <HowItWorksSection />
      <PhotoBand
        video={VIDEOS.hallway.src}
        poster={VIDEOS.hallway.poster}
        fallback={IMAGES.audit}
        eyebrow="Chart to claim"
        line={
          <>
            Your team cares for patients. <span className="accent text-[#5EEAD4]">Prevo</span> cares for the claim.
          </>
        }
      />
      <CodeGuideSection />
      <FeaturesSection />
      <ProductDemoSection />
      <DenialPlaybookSection />
      <CTASection />
      <Footer />
    </main>
  );
}
