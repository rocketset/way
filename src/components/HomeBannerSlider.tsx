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
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Texto animado */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
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
            <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
              <a
                href="#solucoes"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-normal text-primary-foreground bg-primary hover:bg-primary/90 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Conheça nossas soluções
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-normal text-white border-2 border-white bg-transparent hover:bg-white hover:text-gray-900 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
