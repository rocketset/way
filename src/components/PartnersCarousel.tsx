import wbuy from "@/assets/partners/wbuy.png";
import skillshop from "@/assets/partners/skillshop.png";
import meta from "@/assets/partners/meta.png";
import tray from "@/assets/partners/tray.png";
import nuvemshop from "@/assets/partners/nuvemshop.png";
import abcomm from "@/assets/partners/abcomm.png";
import bagy from "@/assets/partners/bagy.png";
import shopify from "@/assets/partners/shopify.png";
import sucesu from "@/assets/partners/sucesu.png";
import sebrae from "@/assets/partners/sebrae.png";
const PartnersCarousel = () => {
  const partners = [{
    name: "WBuy Partner",
    logo: wbuy
  }, {
    name: "Google SkillShop",
    logo: skillshop
  }, {
    name: "Meta Partner",
    logo: meta
  }, {
    name: "Tray Partner",
    logo: tray
  }, {
    name: "Nuvemshop Partner",
    logo: nuvemshop
  }, {
    name: "ABComm Profissional",
    logo: abcomm
  }, {
    name: "Bagy Partner",
    logo: bagy
  }, {
    name: "Shopify Partner",
    logo: shopify
  }, {
    name: "SUCESU PB",
    logo: sucesu
  }, {
    name: "SEBRAE",
    logo: sebrae
  }];

  // Duplicate partners array for seamless infinite scroll
  const allPartners = [...partners, ...partners];
  return <section className="relative py-20 bg-background overflow-hidden border-t border-border">
      {/* Subtle gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4 mb-12">
        <div className="text-center animate-fade-in">
          <p className="text-sm font-semibold text-primary tracking-wider mb-3">Reconhecimento que Gera Confiança</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">Parceiros Oficiais e Credenciados</h3>
          <p className="text-muted-foreground">Credenciados ao Sebrae e às principais plataformas e associações do mercado digital.</p>
        </div>
      </div>

      {/* Infinite scrolling carousel */}
      <div className="relative">
        <div className="flex gap-8 animate-scroll">
          {allPartners.map((partner, index) => <div key={`${partner.name}-${index}`} className="flex-shrink-0 w-48 h-28 bg-card rounded-lg border border-border hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group cursor-pointer overflow-hidden relative hover:scale-110">

              {/* Logo container */}
              <div className="relative h-full flex items-center justify-center p-4">
                <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>


            </div>)}
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="flex justify-center gap-2 mt-12 animate-fade-in" style={{
      animationDelay: '0.3s'
    }}>
        {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-primary/30 animate-pulse" style={{
        animationDelay: `${i * 0.2}s`
      }} />)}
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
          animation: scroll 50s linear infinite;
          display: flex;
          width: max-content;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation-duration: 80s;
          }
        }
      `}</style>
    </section>;
};
export default PartnersCarousel;