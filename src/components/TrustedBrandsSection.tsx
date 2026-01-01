import { Link } from "react-router-dom";
import daniel from "@/assets/clients/daniel.png";
import atacadao from "@/assets/clients/atacadao.png";
import barauna from "@/assets/clients/barauna.png";
import carretao from "@/assets/clients/carretao.png";
import cartopel from "@/assets/clients/cartopel.png";
import casatudo from "@/assets/clients/casatudo.png";
import chipart from "@/assets/clients/chipart.png";
import clubdamoda from "@/assets/clients/clubdamoda.png";
import colorsign from "@/assets/clients/colorsign.png";
import coure from "@/assets/clients/coure.png";
import shopar from "@/assets/clients/shopar.png";
import ekta from "@/assets/clients/ekta.png";
import eletropolo from "@/assets/clients/eletropolo.png";
import extrema from "@/assets/clients/extrema.png";
import inovare from "@/assets/clients/inovare.png";
import kingcolchoes from "@/assets/clients/kingcolchoes.png";
import ldf from "@/assets/clients/ldf.png";
import monipratas from "@/assets/clients/monipratas.png";
import nectar from "@/assets/clients/nectar.png";
import rutra from "@/assets/clients/rutra.png";
import verona from "@/assets/clients/verona.png";
import verazo from "@/assets/clients/verazo.png";

interface ClientBrand {
  name: string;
  logo: string;
  caseId?: string;
}

const TrustedBrandsSection = () => {
  const clients: ClientBrand[] = [
    { name: "Daniel Carvalho", logo: daniel },
    { name: "Atacadão dos Eletros", logo: atacadao },
    { name: "Baraúna", logo: barauna },
    { name: "O Carretão", logo: carretao },
    { name: "Cartopel", logo: cartopel },
    { name: "Casatudo", logo: casatudo },
    { name: "Chipart", logo: chipart },
    { name: "Club da Moda", logo: clubdamoda },
    { name: "Colorsign", logo: colorsign, caseId: "1da013dc-6664-404d-af56-acfbf1b154d2" },
    { name: "Couré", logo: coure },
    { name: "Shopar", logo: shopar },
    { name: "Ekta Professional", logo: ekta },
  ];

  return (
    <section className="py-20 bg-background">
      {/* Decorative element */}
      <div className="flex justify-center mb-12">
        <span className="text-primary/30 text-4xl font-serif">✦</span>
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-muted-foreground mb-12">
          Marcas que confiam na Way
        </h2>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {clients.map((client) => {
            const content = (
              <div className="flex items-center justify-center h-24 md:h-28 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border hover:bg-card transition-all duration-300 group">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-12 md:max-h-16 w-auto object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            );

            if (client.caseId) {
              return (
                <Link
                  key={client.name}
                  to={`/cases/${client.caseId}`}
                  title={`Ver case: ${client.name}`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={client.name} title={client.name}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsSection;
