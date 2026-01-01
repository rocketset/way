import { useRef } from "react";
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

const staticClients = [
  { name: "Daniel Carvalho", logo: daniel },
  { name: "Atacadão dos Eletros", logo: atacadao },
  { name: "Baraúna", logo: barauna },
  { name: "O Carretão", logo: carretao },
  { name: "Cartopel", logo: cartopel },
  { name: "Casatudo", logo: casatudo },
  { name: "Chipart", logo: chipart },
  { name: "Club da Moda", logo: clubdamoda },
  { name: "Colorsign", logo: colorsign },
  { name: "Couré", logo: coure },
  { name: "Shopar", logo: shopar },
  { name: "Ekta Professional", logo: ekta },
  { name: "Eletropolo", logo: eletropolo },
  { name: "Extrema", logo: extrema },
  { name: "Inovare Nutrition", logo: inovare },
  { name: "King Colchões", logo: kingcolchoes },
  { name: "LDF", logo: ldf },
  { name: "Moni Pratas", logo: monipratas },
  { name: "Néctar Plus", logo: nectar },
  { name: "Rutra", logo: rutra },
  { name: "Verona", logo: verona },
  { name: "Verazo", logo: verazo },
];

const ClientsCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: dbClients } = useClientLogos(true);

  const clients = dbClients && dbClients.length > 0
    ? dbClients.map(c => ({ name: c.nome, logo: c.logo_url }))
    : staticClients;

  const allClients = [...clients, ...clients, ...clients];
  return <section className="relative bg-transparent overflow-hidden py-[7px] w-screen -mx-[50vw] left-[50%] right-[50%]">
      {/* Subtle gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrollable carousel */}
      <div 
        ref={scrollContainerRef}
        className="relative overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-8 animate-scroll-left">
          {allClients.map((client, index) => <div key={`${client.name}-${index}`} className="flex-shrink-0 h-40 flex items-center justify-center group cursor-pointer">
              {/* Logo container */}
              <div className="relative h-full flex items-center justify-center px-10 transition-all duration-300 group-hover:scale-110">
                <img src={client.logo} alt={client.name} className="max-h-28 w-auto object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-2xl" />
              </div>
            </div>)}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll-left {
          animation: scroll-left 45s linear infinite;
          display: flex;
          width: max-content;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-left {
            animation-duration: 100s;
          }
        }
      `}</style>
    </section>;
};
export default ClientsCarousel;