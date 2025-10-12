import Header from "@/components/Header";
import HomeBannerSlider from "@/components/HomeBannerSlider";
import ClientsCarousel from "@/components/ClientsCarousel";
import WhyChooseSection from "@/components/WhyChooseSection";
import SolutionsSection from "@/components/SolutionsSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import CasesSection from "@/components/CasesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import CtaResultsSection from "@/components/CtaResultsSection";
import NewsletterSection from "@/components/NewsletterSection";
import { GoogleReviews } from "@/components/GoogleReviews";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Plus Background Pattern */}
      <div className="fixed inset-0 plus-pattern opacity-30 pointer-events-none" />
      
      {/* Floating Plus Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={`plus-${i}`}
            className="absolute text-primary/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 60 + 20}px`,
              animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            +
          </div>
        ))}
      </div>

      <Header />
      
      {/* Sections with stagger animation */}
      <div className="relative z-10">
        <HomeBannerSlider />
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <WhyChooseSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <PartnersCarousel />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <SolutionsSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CasesSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <TestimonialsSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <NewsSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CtaResultsSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.85s' }}>
          <GoogleReviews />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <NewsletterSection />
        </div>
        <Footer />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
