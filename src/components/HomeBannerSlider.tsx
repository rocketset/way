import { Button } from "@/components/ui/button";
import growthHero from "@/assets/growth-chart-hero.jpg";

const HomeBannerSlider = () => {
  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background">
      {/* Background image */}
      <div className="relative w-full min-h-[85vh] flex items-center justify-center">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${growthHero})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content container - Centralized */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.2] tracking-tight">
              Soluções estratégicas para acelerar o crescimento do seu negócio.
            </h1>

            {/* Subtitle/Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
              Na <span className="text-primary font-semibold">Way E-commerce</span>, unimos estratégia, tecnologia e performance para escalar marcas que pensam grande. Somos uma <span className="text-primary font-semibold">aceleradora de negócios digitais</span>, com foco em estrutura, expansão e resultados reais.
            </p>

            {/* CTA Button */}
            <div className="pt-6">
              <Button 
                size="lg"
                className="text-base sm:text-lg px-10 font-normal shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="/contact">
                  Quero acelerar meu negócio
                </a>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBannerSlider;
