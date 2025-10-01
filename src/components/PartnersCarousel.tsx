import { useState } from "react";
import wbuy from "@/assets/partners/wbuy.png";
import skillshop from "@/assets/partners/skillshop.png";
import meta from "@/assets/partners/meta.png";
import tray from "@/assets/partners/tray.png";
import nuvemshop from "@/assets/partners/nuvemshop.png";
import abcomm from "@/assets/partners/abcomm.png";
import bagy from "@/assets/partners/bagy.png";
import shopify from "@/assets/partners/shopify.png";

const PartnersCarousel = () => {
  const [isPaused, setIsPaused] = useState(false);

  const partners = [
    { name: "WBuy Partner", logo: wbuy },
    { name: "Google SkillShop", logo: skillshop },
    { name: "Meta Partner", logo: meta },
    { name: "Tray Partner", logo: tray },
    { name: "Nuvemshop Partner", logo: nuvemshop },
    { name: "ABComm Profissional", logo: abcomm },
    { name: "Bagy Partner", logo: bagy },
    { name: "Shopify Partner", logo: shopify },
  ];

  // Duplicate partners array for seamless infinite scroll
  const allPartners = [...partners, ...partners];

  return (
    <section className="relative py-20 bg-background overflow-hidden border-t border-border">
      {/* Subtle gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4 mb-12">
        <div className="text-center animate-fade-in">
          <p className="text-sm font-semibold text-primary tracking-wider mb-3">PARCEIROS OFICIAIS</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">
            Certificados e Integrados
          </h3>
          <p className="text-muted-foreground">
            Trabalhamos com as principais plataformas do mercado
          </p>
        </div>
      </div>

      {/* Infinite scrolling carousel */}
      <div className="relative">
        <div 
          className="flex gap-8 animate-scroll hover:pause"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {allPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-52 h-28 bg-card rounded-lg border border-border hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden relative"
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Logo container */}
              <div className="relative h-full flex items-center justify-center p-6 transform group-hover:scale-110 transition-transform duration-500">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-500"
                />
              </div>

              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-lg shadow-[0_0_30px_rgba(255,204,0,0.3)]" />
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="flex justify-center gap-2 mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
          display: flex;
          width: max-content;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation-duration: 80s;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnersCarousel;
