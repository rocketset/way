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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.2] tracking-tight">E-commerce com método.  
Escala com performance.</h1>

            {/* Subtitle/Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
              <span className="text-primary font-semibold">Na Way E-commerce,</span> Atendemos do pequeno ao enterprise, da implantação à expansão, com estrutura e previsibilidade. Atuamos da implantação à escala, com um método próprio e validado, aplicado em <span className="text-primary font-semibold">mais de 190 projetos no Brasil</span> focado em estrutura, expansão e crescimento sustentável.
            </p>

            {/* CTA Button */}
            <div className="pt-6">
              <Button size="lg" className="text-base sm:text-lg px-10 font-normal shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105" asChild>
                <a href="https://wa.me/message/5AGVY5WZR56KA1">Fale agora com um consultor         </a>
              </Button>
            </div>

            {/* Social Proof Text */}
            <div className="pt-8">
              <p className="text-sm sm:text-base text-primary font-bold tracking-wider">
                + DE 700 EMPRESAS ATENDIDAS POR TODO O BRASIL
              </p>
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