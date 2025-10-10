import { Plus, Grid3x3, Eye, Headphones } from "lucide-react";
import brazilFlag from "@/assets/brazil-flag.png";
import ClientsCarousel from "./ClientsCarousel";

const WhyChooseSection = () => {
  const stats = [
    {
      number: "190",
      label: "Lojas implantadas"
    },
    {
      number: "1 ano",
      label: "com soluções de ponta a ponta"
    },
    {
      number: "flag",
      label: "Atendemos todo o Brasil",
      isFlag: true
    },
    {
      number: "700",
      label: "Clientes atendidos"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Por que escolher <span className="text-primary">a Way+?</span>
            </h2>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="group relative bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-125 transition-transform duration-500">
                      {stat.isFlag ? (
                        <img src={brazilFlag} alt="Bandeira do Brasil" className="w-20 h-14 mx-auto object-cover rounded-md" />
                      ) : (
                        stat.number
                      )}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                  <Plus className="absolute -top-2 -right-2 w-6 h-6 text-primary opacity-0 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500" />
                </div>
              ))}
            </div>

            {/* Logos dos Clientes */}
            <ClientsCarousel />

            <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mt-12">
              Estamos presentes em toda a jornada de compra, acompanhando a operação em cada etapa, da criação da loja até a evolução contínua. Nosso papel é simplificar a entrada no digital ou escalar negócios já existentes, transformando desafios em crescimento real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1 - Soluções Modulares */}
            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 group-hover:rotate-90 transition-all duration-700" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Grid3x3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Soluções Modulares</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Customizamos cada projeto conforme a maturidade da operação. Co-criamos com nossos parceiros, sem perder ganhos de escala e eficiência.
                </p>
              </div>
            </div>

            {/* Card 2 - Transparência */}
            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 group-hover:rotate-90 transition-all duration-700" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Eye className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Transparência</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trabalhamos como parceiros de negócio. A rentabilidade precisa ser saudável para ambos os lados, e nossas metas estão sempre alinhadas às metas de venda do cliente.
                </p>
              </div>
            </div>

            {/* Card 3 - Atendimento */}
            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 group-hover:rotate-90 transition-all duration-700" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Headphones className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Atendimento</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mais do que suporte, oferecemos direcionamento estratégico e acompanhamento próximo, garantindo evolução constante e decisões mais assertivas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
