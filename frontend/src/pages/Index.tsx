import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ImpactSection from "@/components/ImpactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <ImpactSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
