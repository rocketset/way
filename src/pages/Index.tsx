import Header from "@/components/Header";
import HomeBannerSlider from "@/components/HomeBannerSlider";
import ClientsCarousel from "@/components/ClientsCarousel";
import WhyChooseSection from "@/components/WhyChooseSection";
import SolutionsSection from "@/components/SolutionsSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import WhyWaySection from "@/components/WhyWaySection";
import CasesSection from "@/components/CasesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import CtaResultsSection from "@/components/CtaResultsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HomeBannerSlider />
      <WhyChooseSection />
      <PartnersCarousel />
      <SolutionsSection />
      <WhyWaySection />
      <CasesSection />
      <TestimonialsSection />
      <NewsSection />
      <CtaResultsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
