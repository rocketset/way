import Header from "@/components/Header";
import HomeBannerSlider from "@/components/HomeBannerSlider";
import WhyChooseSection from "@/components/WhyChooseSection";
import SolutionsSection from "@/components/SolutionsSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import FeaturedCasesSection from "@/components/FeaturedCasesSection";
import TrustedBrandsSection from "@/components/TrustedBrandsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import CtaResultsSection from "@/components/CtaResultsSection";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
const Index = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://wayecommerce.com.br/#organization",
    "name": "Way E-commerce",
    "url": "https://wayecommerce.com.br",
    "logo": "https://wayecommerce.com.br/logo-way.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "47"
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      <SEO title="De consultoria a performance: sua operação digital em outro nível" description="Fazemos seu e-commerce crescer com estratégia, tecnologia, integrações e performance. Estrutura, processo e resultado para escalar suas vendas com previsibilidade." keywords="e-commerce, consultoria, performance, marketing digital, implantação, desenvolvimento" schema={organizationSchema} />
      
      {/* Linhas decorativas diagonais - fundo fixo */}
      <div className="fixed inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] border-t-2 border-r-2 border-white rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] border-t-2 border-r-2 border-white/70 rotate-45"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] border-t-2 border-r-2 border-white/50 rotate-45 transform translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] border-t-2 border-r-2 border-white/40 rotate-45 transform -translate-x-1/2"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[700px] h-[700px] border-t-2 border-r-2 border-white/30 rotate-45"></div>
      </div>

      {/* Gradient overlay sutil */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

      <Header />
      
      {/* Sections with stagger animation */}
      <div className="relative z-10">
        <HomeBannerSlider />
        <div className="animate-fade-in" style={{
        animationDelay: '0.1s'
      }}>
          <WhyChooseSection className="py-0 my-0" />
        </div>
        <div className="animate-fade-in" style={{
        animationDelay: '0.2s'
      }}>
          <PartnersCarousel />
        </div>
        <div className="animate-fade-in" style={{
        animationDelay: '0.3s'
      }}>
          <SolutionsSection />
        </div>
        <div className="animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          <FeaturedCasesSection />
        </div>
        <div className="animate-fade-in" style={{
        animationDelay: '0.45s'
      }}>
          <TrustedBrandsSection />
        </div>
        <div className="animate-fade-in" style={{
        animationDelay: '0.5s'
      }}>
          <TestimonialsSection />
        </div>
        <div className="animate-fade-in" style={{
        animationDelay: '0.55s'
      }}>
          <CtaResultsSection />
        </div>
        <div className="animate-fade-in" style={{
        animationDelay: '0.6s'
      }}>
          <NewsSection />
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
    </div>;
};
export default Index;