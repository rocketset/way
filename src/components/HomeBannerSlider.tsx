import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import banner1Desktop from "@/assets/home-banner-1.png";

// Array de banners - futuramente virá do admin
const banners = [
  {
    id: 1,
    desktopImage: banner1Desktop,
    mobileImage: banner1Desktop,
    alt: "Banner Way+ E-commerce",
  },
];

const HomeBannerSlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-primary/90 hover:bg-primary text-primary-foreground p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl hover:shadow-primary/50 group"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-7 h-7 transition-transform group-hover:-translate-x-1" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-primary/90 hover:bg-primary text-primary-foreground p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl hover:shadow-primary/50 group"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-7 h-7 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? "w-8 h-3 bg-primary"
                    : "w-3 h-3 bg-primary/40 hover:bg-primary/70"
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HomeBannerSlider;
