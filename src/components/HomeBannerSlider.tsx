import { Button } from "@/components/ui/button";
import cleanHeroBg from "@/assets/clean-hero-bg.jpg";
import ClientsCarousel from "@/components/ClientsCarousel";
const HomeBannerSlider = () => {
  return <section id="inicio" className="relative w-full overflow-hidden bg-background">
      {/* Background image */}
      <div className="relative w-full min-h-[85vh] flex items-center justify-center">
        {/* Background image with overlay */}
        <div style={{
        backgroundImage: `url(${cleanHeroBg})`
      }} className="absolute inset-0 bg-cover bg-center bg-no-repeat my-[50px]">
          <div className="absolute inset-0 bg-black/60 py-0 my-0"></div>
        </div>

        {/* Content container - Centralized */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 lg:pt-20 lg:pb-10 my-0 py-[48px]">
          <div className="max-w-4xl mx-auto text-center space-y-8 my-[91px]">
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.2] tracking-tight flex flex-col items-center">
              <span>E-commerce com método.</span>
              <span>Escala com performance.</span>
            </h1>

            {/* Subtitle/Description */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl mx-auto flex flex-col items-center">
                <span className="text-white/90">Na Way</span>
                <span><span className="text-primary font-semibold">E-commerce</span><span className="text-white/90">, Atendemos do pequeno ao enterprise, da implantação à expansão, com estrutura e previsibilidade.</span></span>
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl text-primary font-semibold leading-relaxed max-w-3xl mx-auto">
                Com mais de 190 projetos no Brasil.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Button size="lg" className="text-base sm:text-lg px-10 font-normal shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105" asChild>
                <a href="https://wa.me/message/5AGVY5WZR56KA1">Fale agora com um consultor         </a>
              </Button>
            </div>


            {/* Clients Carousel */}
            <div className="pt-6 my-0">
              <ClientsCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HomeBannerSlider;