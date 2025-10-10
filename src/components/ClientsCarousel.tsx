import colorsign from "@/assets/clients/colorsign.png";
import verona from "@/assets/clients/verona.png";
import rutra from "@/assets/clients/rutra.png";
import verazo from "@/assets/clients/verazo.png";
import nectarPlus from "@/assets/clients/nectar-plus.png";
import extrema from "@/assets/clients/extrema.png";
import chipart from "@/assets/clients/chipart.png";
import shopar from "@/assets/clients/shopar.png";
import carretao from "@/assets/clients/carretao.png";
import eletropolo from "@/assets/clients/eletropolo.png";

const ClientsCarousel = () => {
  const clients = [
    { name: "Colorsign", logo: colorsign },
    { name: "Verona", logo: verona },
    { name: "Rutra", logo: rutra },
    { name: "Verazo", logo: verazo },
    { name: "Néctar Plus", logo: nectarPlus },
    { name: "Extrema", logo: extrema },
    { name: "Chipart", logo: chipart },
    { name: "Shopar", logo: shopar },
    { name: "O Carretão", logo: carretao },
    { name: "Eletropolo", logo: eletropolo },
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
              className="flex-shrink-0 h-64 flex items-center justify-center group cursor-pointer"
            >
              {/* Logo container */}
              <div className="relative h-full flex items-center justify-center px-16">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-48 w-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-500"
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
