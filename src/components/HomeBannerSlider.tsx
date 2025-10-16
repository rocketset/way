import { useState, useEffect } from "react";
import heroBg from "@/assets/hero-solutions-bg.jpg";

const solutions = [
  {
    title: "Implante seu e-commerce do jeito certo.",
    description: "Planejamento, tecnologia e operação integrados para lançar sua loja com base sólida e escalável.",
    button: "🚀 Quero implantar meu e-commerce"
  },
  {
    title: "Transforme seu e-commerce em um negócio previsível.",
    description: "Consultoria especializada para estruturar, otimizar e escalar sua operação digital com inteligência de dados.",
    button: "💼 Falar com um consultor"
  },
  {
    title: "Aumente suas vendas com performance real.",
    description: "Gestão de tráfego, CRM e otimização contínua para gerar resultados mensuráveis e sustentáveis.",
    button: "📈 Quero escalar minhas vendas"
  }
];

const HomeBannerSlider = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Animação de texto alternado
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % solutions.length);
    }, 5000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background">
      {/* Imagem de fundo fixa */}
      <div className="relative w-full h-[70vh] sm:h-[75vh] md:h-auto md:aspect-[21/9]">
        <img
          src={heroBg}
          alt="Soluções Way E-commerce"
          className="w-full h-full object-cover object-[center_30%] md:object-center"
        />
      </div>

      {/* Overlay com texto e botões */}
      <div className="absolute inset-0 flex items-center justify-start z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            {/* Conteúdo animado */}
            {solutions.map((solution, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentTextIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 absolute translate-y-4 pointer-events-none"
                }`}
              >
                {/* Título */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight mb-4">
                  {solution.title}
                </h1>

                {/* Descrição */}
                <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                  {solution.description}
                </p>

                {/* Botão */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {solution.button}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBannerSlider;
