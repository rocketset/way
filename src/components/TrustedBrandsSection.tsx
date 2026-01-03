import { Link } from "react-router-dom";
import { useClientLogos } from "@/hooks/useClientLogos";
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
interface ClientBrand {
  name: string;
  logo: string;
  caseId?: string | null;
  isFromDb?: boolean;
}

// Static fallback clients
const staticClients: ClientBrand[] = [{
  name: "Daniel Carvalho",
  logo: daniel
}, {
  name: "Atacadão dos Eletros",
  logo: atacadao
}, {
  name: "Baraúna",
  logo: barauna
}, {
  name: "O Carretão",
  logo: carretao
}, {
  name: "Cartopel",
  logo: cartopel
}, {
  name: "Casatudo",
  logo: casatudo
}, {
  name: "Chipart",
  logo: chipart
}, {
  name: "Club da Moda",
  logo: clubdamoda
}, {
  name: "Colorsign",
  logo: colorsign
}, {
  name: "Couré",
  logo: coure
}, {
  name: "Shopar",
  logo: shopar
}, {
  name: "Ekta Professional",
  logo: ekta
}];
const TrustedBrandsSection = () => {
  const {
    data: dbClients
  } = useClientLogos(true);
  const normalizeExibirEm = (value?: string | null) => (value || "").toLowerCase().trim();

  // Filter clients for grid display (both or grid) and use static as fallback
  const filteredDbClients = (dbClients || []).filter(c => {
    const v = normalizeExibirEm(c.exibir_em);
    // Support both Portuguese + English values
    return v === "" || v === "both" || v === "ambos" || v === "grid";
  });
  const clients: ClientBrand[] = dbClients && dbClients.length > 0 ? (filteredDbClients.length > 0 ? filteredDbClients : dbClients).map(c => ({
    name: c.nome,
    logo: c.logo_url,
    caseId: c.case_id,
    isFromDb: true
  })) : staticClients;
  if (clients.length === 0) {
    return null;
  }
  return <section className="pt-8 pb-20 bg-background">
      {/* Decorative element */}
      <div className="flex justify-center mb-8">
        <span className="text-primary/30 text-4xl font-serif">✦</span>
      </div>

      <div className="container mx-auto px-[40px]">
        <h2 className="text-center text-xl md:text-2xl font-semibold text-muted-foreground mb-12">
          Marcas que confiam na Way
        </h2>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {clients.map(client => {
          const content = <div className="flex items-center justify-center h-24 md:h-28 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border hover:bg-card transition-all duration-300 group">
                <img src={client.logo} alt={client.name} className={`max-h-12 md:max-h-16 w-auto object-contain transition-all duration-300 ${client.isFromDb ? "opacity-80 group-hover:opacity-100" : "grayscale-0 group-hover:grayscale opacity-100 group-hover:opacity-60"}`} />
              </div>;
          if (client.caseId) {
            return <Link key={client.name} to={`/cases/${client.caseId}`} title={`Ver case: ${client.name}`}>
                  {content}
                </Link>;
          }
          return <div key={client.name} title={client.name}>
                {content}
              </div>;
        })}
        </div>
      </div>
    </section>;
};
export default TrustedBrandsSection;