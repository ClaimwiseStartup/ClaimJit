import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import StatementSection from "../components/StatementSection";
import DenialCalculator from "../components/DenialCalculator";
import WhoItsForSection from "../components/WhoItsForSection";
import ProductShowcase from "../components/ProductShowcase";
import HowItWorksSection from "../components/HowItWorksSection";
import ClaimFormSection from "../components/ClaimFormSection";
import PhotoBand from "../components/PhotoBand";
import CodeGuideSection from "../components/CodeGuideSection";
import FeaturesSection from "../components/FeaturesSection";
import ProductDemoSection from "../components/ProductDemoSection";
import DenialPlaybookSection from "../components/DenialPlaybookSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import Mark from "../components/Mark";
import { VIDEOS, IMAGES } from "../components/images";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Navigation />
      <HeroSection />
      <StatementSection />
      <DenialCalculator />
      <WhoItsForSection />
      <ProductShowcase />
      <HowItWorksSection />
      <ClaimFormSection />
      <PhotoBand
        video={VIDEOS.hallway.src}
        poster={VIDEOS.hallway.poster}
        fallback={IMAGES.audit}
        eyebrow="Chart to claim"
        line={
          <>
            Your team cares for patients. <Mark tone="dark">Prevo</Mark> cares for the claim.
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
