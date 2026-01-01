import { usePartnerLogos } from "@/hooks/usePartnerLogos";

// Fallback estático
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

const staticPartners = [
  { name: "WBuy Partner", logo: wbuy },
  { name: "Google SkillShop", logo: skillshop },
  { name: "Meta Partner", logo: meta },
  { name: "Tray Partner", logo: tray },
  { name: "Nuvemshop Partner", logo: nuvemshop },
  { name: "ABComm Profissional", logo: abcomm },
  { name: "Bagy Partner", logo: bagy },
  { name: "Shopify Partner", logo: shopify },
  { name: "SUCESU PB", logo: sucesu },
  { name: "SEBRAE", logo: sebrae },
];

const PartnersCarousel = () => {
  const { data: dbPartners } = usePartnerLogos(true);

  const partners = dbPartners && dbPartners.length > 0
    ? dbPartners.map(p => ({ name: p.nome, logo: p.logo_url }))
    : staticPartners;

  return (
    <section className="pt-8 pb-20 bg-background">
      <div className="flex justify-center mb-8">
        <span className="text-primary/30 text-4xl font-serif">✦</span>
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-muted-foreground mb-12">
          Parceiros Oficiais e Credenciados
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              title={partner.name}
              className="flex items-center justify-center h-32 md:h-36 p-6 rounded-lg bg-card/50 border border-border/50 hover:border-border hover:bg-card transition-all duration-300 group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-16 md:max-h-24 w-auto object-contain grayscale-0 group-hover:grayscale opacity-100 group-hover:opacity-60 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;