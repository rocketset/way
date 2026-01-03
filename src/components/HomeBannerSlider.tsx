import { Button } from "@/components/ui/button";
import cleanHeroBg from "@/assets/clean-hero-bg.jpg";
import ClientsCarousel from "@/components/ClientsCarousel";
const HomeBannerSlider = () => {
  return <section id="inicio" className="relative w-full min-h-screen overflow-hidden bg-background">
      {/* Background image with overlay */}
      <div style={{
      backgroundImage: `url(${cleanHeroBg})`
    }} className="absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main content - centered vertically */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Spacer to push content down from header */}
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center space-y-10">
              {/* Main Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white leading-[1.15] tracking-tight">
                <span className="block">Estruturamos e aceleramos</span>
                <span className="block">e-commerces com método e performance.</span>
              </h1>

              {/* Subtitle/Description */}
              <div className="space-y-6">
                <p className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed max-w-4xl mx-auto text-white/90">
                  Do pequeno ao enterprise, atuamos da implantação à escala, com tecnologia, decisões estratégicas e foco em crescimento sustentável.
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl text-primary font-semibold leading-relaxed max-w-3xl mx-auto border-l-4 border-primary pl-4 italic">
                  Tecnologia não é escolha estética. É decisão estratégica.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-8">
                <Button size="lg" className="text-lg sm:text-xl px-12 py-6 h-auto font-medium shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105" asChild>
                  <a href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0">Fale agora com um consultor</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Carousel - fixed at bottom */}
        <div className="w-full py-6">
          <ClientsCarousel />
        </div>
      </div>
    </section>;
};
export default HomeBannerSlider;