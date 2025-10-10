import malavazi from "@/assets/clients/malavazi.webp";
import coure from "@/assets/clients/coure.png";
import ldf from "@/assets/clients/ldf.png";
import atacadaoEletros from "@/assets/clients/atacadao-eletros.png";
import cartope from "@/assets/clients/cartope.png";
import catfish from "@/assets/clients/catfish.png";
import barauna from "@/assets/clients/barauna.jpg";
import colorsign from "@/assets/clients/colorsign.webp";
import casatudo from "@/assets/clients/casatudo.png";
import inovare from "@/assets/clients/inovare.png";
import clubDaModa from "@/assets/clients/club-da-moda.png";
import eletropolo from "@/assets/clients/eletropolo.png";
import moniPratas from "@/assets/clients/moni-pratas.png";
import carretao from "@/assets/clients/carretao.png";
import shopar from "@/assets/clients/shopar.png";
import chipart from "@/assets/clients/chipart.webp";
import ekta from "@/assets/clients/ekta.webp";
import extrema from "@/assets/clients/extrema.webp";
import nectarPlus from "@/assets/clients/nectar-plus.png";
import rutra from "@/assets/clients/rutra.png";
import verazo from "@/assets/clients/verazo.png";
import verona from "@/assets/clients/verona.png";

const ClientsCarousel = () => {
  const clients = [
    { name: "Malavazi", logo: malavazi },
    { name: "Coure", logo: coure },
    { name: "LDF", logo: ldf },
    { name: "Atacadão dos Eletros", logo: atacadaoEletros },
    { name: "Cartope", logo: cartope },
    { name: "Catfish", logo: catfish },
    { name: "Baraúna", logo: barauna },
    { name: "Colorsign", logo: colorsign },
    { name: "Casatudo", logo: casatudo },
    { name: "Inovare", logo: inovare },
    { name: "Club da Moda", logo: clubDaModa },
    { name: "Eletropolo", logo: eletropolo },
    { name: "Moni Pratas", logo: moniPratas },
    { name: "O Carretão", logo: carretao },
    { name: "Shopar", logo: shopar },
    { name: "Chipart", logo: chipart },
    { name: "Ekta", logo: ekta },
    { name: "Extrema", logo: extrema },
    { name: "Néctar Plus", logo: nectarPlus },
    { name: "Rutra", logo: rutra },
    { name: "Verazo", logo: verazo },
    { name: "Verona", logo: verona },
  ];

  // Duplicate clients array for seamless infinite scroll
  const allClients = [...clients, ...clients, ...clients];

  return (
    <section className="relative py-16 bg-transparent overflow-hidden">
      {/* Subtle gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Infinite scrolling carousel */}
      <div className="relative">
        <div className="flex gap-12 animate-scroll-left">
          {allClients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex-shrink-0 h-20 flex items-center justify-center group cursor-pointer"
            >
              {/* Logo container with white filter */}
              <div className="relative h-full flex items-center justify-center px-8">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-16 w-auto object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
          display: flex;
          width: max-content;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-left {
            animation-duration: 100s;
          }
        }
      `}</style>
    </section>
  );
};

export default ClientsCarousel;
