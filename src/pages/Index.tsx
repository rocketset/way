import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WhyWaySection from "@/components/WhyWaySection";
import ResultsSection from "@/components/ResultsSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import SolutionsSection from "@/components/SolutionsSection";
import CasesSection from "@/components/CasesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <WhyWaySection />
      <ResultsSection />
      <PartnersCarousel />
      <SolutionsSection />
      <CasesSection />
      <TestimonialsSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
