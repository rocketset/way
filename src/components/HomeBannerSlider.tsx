import { useState, useEffect } from "react";
import banner1Desktop from "@/assets/home-banner-1.png";
import banner2Desktop from "@/assets/home-banner-2.png";

// Array de banners - futuramente virá do admin
const banners = [
  {
    id: 1,
    desktopImage: banner1Desktop,
    mobileImage: banner1Desktop,
    alt: "Banner Way+ E-commerce 1",
  },
  {
    id: 2,
    desktopImage: banner2Desktop,
    mobileImage: banner2Desktop,
    alt: "Banner Way+ E-commerce 2",
  },
];

const HomeBannerSlider = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Duplicate banners array for seamless infinite scroll
  const allBanners = [...banners, ...banners];

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
      <div className="flex animate-banner-scroll">
        {allBanners.map((banner, index) => (
          <div key={`${banner.id}-${index}`} className="flex-shrink-0 w-full">
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

      <style>{`
        @keyframes banner-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-banner-scroll {
          animation: banner-scroll 20s linear infinite;
          display: flex;
          width: max-content;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-banner-scroll {
            animation-duration: 30s;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeBannerSlider;
