import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import banner1Desktop from "@/assets/home-banner-1.png";
import banner2Desktop from "@/assets/home-banner-2.png";

type ImageBanner = {
  id: number;
  type: 'image';
  desktopImage: string;
  mobileImage: string;
  alt: string;
};

type VideoBanner = {
  id: number;
  type: 'video';
  desktopVideo: string;
  mobileVideo: string;
  alt: string;
};

type Banner = ImageBanner | VideoBanner;

// Array de banners - futuramente virá do admin
// Suporta tanto imagens (type: 'image') quanto vídeos (type: 'video')
const banners: Banner[] = [
  {
    id: 1,
    type: 'image',
    desktopImage: banner1Desktop,
    mobileImage: banner1Desktop,
    alt: "Banner Way+ E-commerce 1",
  },
  {
    id: 2,
    type: 'image',
    desktopImage: banner2Desktop,
    mobileImage: banner2Desktop,
    alt: "Banner Way+ E-commerce 2",
  },
  // Exemplo de banner com vídeo:
  // {
  //   id: 3,
  //   type: 'video',
  //   desktopVideo: "/videos/banner-desktop.mp4",
  //   mobileVideo: "/videos/banner-mobile.mp4",
  //   alt: "Vídeo Banner Way+ E-commerce",
  // },
];

const texts = [
  "Soluções completas e integradas para transformar seu negócio",
  "Estamos presentes em toda a jornada",
  "Certificados nas principais plataformas"
];

const HomeBannerSlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animação de texto alternado
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 4000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide flex-[0_0_100%] min-w-0">
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                {banner.type === 'video' ? (
                  <video
                    src={isMobile ? banner.mobileVideo : banner.desktopVideo}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <img
                    src={isMobile ? banner.mobileImage : banner.desktopImage}
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay com texto e botões */}
      <div className="absolute inset-0 flex items-center justify-start z-10 bg-gradient-to-r from-black/60 via-black/30 to-transparent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-6">
            {/* Texto animado */}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#solucoes"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Conheça nossas soluções
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Fale com um especialista
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background text-foreground p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-xl backdrop-blur-sm group"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background text-foreground p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-xl backdrop-blur-sm group"
        aria-label="Próximo banner"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Dots indicator - interno */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`transition-all duration-300 rounded-full backdrop-blur-sm ${
              index === selectedIndex
                ? "w-10 h-2.5 bg-primary shadow-lg shadow-primary/50"
                : "w-2.5 h-2.5 bg-background/60 hover:bg-background/80 hover:scale-125"
            }`}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeBannerSlider;
