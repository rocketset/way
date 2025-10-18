import { Button } from "@/components/ui/button";

const HomeBannerSlider = () => {
  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background">
      {/* Background com elementos gráficos */}
      <div className="relative w-full h-[70vh] sm:h-[75vh] md:h-auto md:aspect-[21/9] bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {/* Linhas decorativas diagonais */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] border-t-2 border-r-2 border-white rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] border-t-2 border-r-2 border-white/70 rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] border-t-2 border-r-2 border-white/50 rotate-45 transform translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* Gradient overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-4xl space-y-6 md:space-y-8">
            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-primary leading-[1.1] tracking-tight">
              Aceleramos o futuro
              <br />
              do varejo digital
            </h1>

            {/* Subtítulo */}
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-extralight leading-relaxed">
              Independente, estratégica e
              <br />
              focada em expansão.
            </p>

            {/* Descrição */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-extralight leading-relaxed max-w-2xl">
              Somos a Way E-commerce — a aceleradora de negócios que transforma.
            </p>

            {/* Call to action */}
            <div className="pt-4 md:pt-6">
              <Button 
                size="lg"
                className="text-base sm:text-lg px-8 py-3 h-auto font-normal shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="/contact">
                  Quero acelerar meu negócio
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Efeito de brilho sutil no canto */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default HomeBannerSlider;
