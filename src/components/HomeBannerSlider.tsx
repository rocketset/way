import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import banner1Desktop from "@/assets/home-banner-1.png";

// Array de banners - futuramente virá do admin
const banners = [
  {
    id: 1,
    desktopImage: banner1Desktop,
    mobileImage: banner1Desktop, // Por enquanto usa a mesma imagem
    alt: "Banner Way+ E-commerce",
  },
];

const HomeBannerSlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-background">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide flex-[0_0_100%] min-w-0">
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                <img
                  src={isMobile ? banner.mobileImage : banner.desktopImage}
                  alt={banner.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - only show if there are multiple banners */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </section>
  );
};

export default HomeBannerSlider;
