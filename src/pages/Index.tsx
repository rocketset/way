import Header from "@/components/Header";
import HomeBannerSlider from "@/components/HomeBannerSlider";
import ClientsCarousel from "@/components/ClientsCarousel";
import WhyChooseSection from "@/components/WhyChooseSection";
import SolutionsSection from "@/components/SolutionsSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import WhyWaySection from "@/components/WhyWaySection";
import ResultsSection from "@/components/ResultsSection";
import CasesSection from "@/components/CasesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HomeBannerSlider />
      <ClientsCarousel />
      <WhyChooseSection />
      <SolutionsSection />
      <PartnersCarousel />
      <WhyWaySection />
      <ResultsSection />
      <CasesSection />
      <TestimonialsSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
