import { Button } from "@/components/ui/button";

const HomeBannerSlider = () => {
  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background">
      {/* Background com elementos gráficos */}
      <div className="relative w-full min-h-[80vh] bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {/* Linhas decorativas diagonais */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] border-t-2 border-r-2 border-white rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] border-t-2 border-r-2 border-white/70 rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] border-t-2 border-r-2 border-white/50 rotate-45 transform translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* Gradient overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

        {/* Conteúdo principal - Grid de duas colunas */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Coluna Esquerda - Conteúdo */}
            <div className="space-y-6 lg:space-y-8">
              {/* Título principal */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-primary leading-[1.1] tracking-tight">
                Transformamos operações digitais em negócios escaláveis.
              </h1>

              {/* Subtítulo */}
              <p className="text-lg sm:text-xl text-white/90 font-light leading-relaxed">
                Na Way E-commerce, unimos estratégia, tecnologia e performance para acelerar o crescimento de marcas que pensam grande.
              </p>

              {/* Parágrafo de posicionamento */}
              <p className="text-base sm:text-lg text-white/80 font-extralight leading-relaxed">
                Somos uma aceleradora de e-commerces e varejistas digitais, com foco em estrutura, expansão e resultados reais.
              </p>

              {/* Call to action */}
              <div className="pt-4">
                <Button 
                  size="lg"
                  className="text-base sm:text-lg px-8 py-6 h-auto font-normal shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="/contact">
                    🚀 Quero acelerar meu negócio
                  </a>
                </Button>
              </div>

              {/* Provas sociais */}
              <div className="pt-6 space-y-2 border-t border-white/10">
                <p className="text-sm sm:text-base text-primary font-semibold">
                  🔸 + de 700 empresas atendidas por todo o Brasil
                </p>
                <p className="text-sm sm:text-base text-primary/90 font-medium">
                  🔸 Especialistas em implantação, consultoria e expansão digital
                </p>
              </div>
            </div>

            {/* Coluna Direita - Gráfico Visual */}
            <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
              {/* Container do gráfico */}
              <div className="relative w-full h-full">
                {/* Linha ascendente (amarela - benefícios) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet">
                  {/* Linha amarela ascendente */}
                  <path
                    d="M 50 400 L 150 280 L 250 160 L 350 40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    fill="none"
                    className="animate-pulse"
                  />
                  
                  {/* Pontos da linha ascendente */}
                  <circle cx="50" cy="400" r="8" fill="hsl(var(--primary))" />
                  <circle cx="150" cy="280" r="8" fill="hsl(var(--primary))" />
                  <circle cx="250" cy="160" r="8" fill="hsl(var(--primary))" />
                  <circle cx="350" cy="40" r="8" fill="hsl(var(--primary))" />

                  {/* Linha vermelha/rosa descendente */}
                  <path
                    d="M 50 100 L 150 220 L 250 340 L 350 460"
                    stroke="#ff4466"
                    strokeWidth="4"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  
                  {/* Pontos da linha descendente */}
                  <circle cx="50" cy="100" r="8" fill="#ff4466" />
                  <circle cx="150" cy="220" r="8" fill="#ff4466" />
                  <circle cx="250" cy="340" r="8" fill="#ff4466" />
                  <circle cx="350" cy="460" r="8" fill="#ff4466" />
                </svg>

                {/* Labels da linha ascendente (amarela) */}
                <div className="absolute top-[8%] right-[5%] text-right">
                  <p className="text-primary font-bold text-lg sm:text-xl">+MARGEM</p>
                </div>
                <div className="absolute top-[32%] right-[20%] text-right">
                  <p className="text-primary font-bold text-base sm:text-lg">+TICKET MÉDIO</p>
                </div>
                <div className="absolute top-[56%] right-[35%] text-right">
                  <p className="text-primary font-bold text-sm sm:text-base">+CONVERSÃO</p>
                </div>

                {/* Labels da linha descendente (vermelha) */}
                <div className="absolute top-[20%] left-[5%] text-left">
                  <p className="text-[#ff4466] font-bold text-sm sm:text-base">-CAC</p>
                </div>
                <div className="absolute top-[44%] left-[20%] text-left">
                  <p className="text-[#ff4466] font-bold text-base sm:text-lg">-ATRITO</p>
                </div>
                <div className="absolute top-[68%] left-[35%] text-left">
                  <p className="text-[#ff4466] font-bold text-lg sm:text-xl">-PRAZO</p>
                </div>
              </div>
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
