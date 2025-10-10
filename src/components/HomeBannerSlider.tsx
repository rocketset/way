import { useState, useEffect } from "react";
import heroBg from "@/assets/hero-solutions-bg.jpg";

const texts = [
  "Soluções completas e integradas para transformar seu negócio",
  "Estamos presentes em toda a jornada",
  "Certificados nas principais plataformas"
];

const HomeBannerSlider = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Animação de texto alternado
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 4000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background">
      {/* Imagem de fundo fixa */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
        <img
          src={heroBg}
          alt="Soluções Way E-commerce"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay com texto e botões */}
      <div className="absolute inset-0 flex items-center justify-start z-10 bg-gradient-to-r from-black/60 via-black/30 to-transparent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-6">
            {/* Texto animado */}
            <h1 className="text-3xl md:text-5xl font-light text-white leading-tight">
              {texts.map((text, index) => (
                <span
                  key={index}
                  className={`block transition-all duration-700 ${
                    index === currentTextIndex
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 absolute translate-y-4"
                  }`}
                >
                  {text}
                </span>
              ))}
            </h1>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href="#solucoes"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-normal text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Conheça nossas soluções
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-normal text-primary border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Fale com um especialista
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBannerSlider;
