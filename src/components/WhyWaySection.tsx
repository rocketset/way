import { LayoutGrid, RefreshCcw, TrendingUp, Plus } from "lucide-react";

const WhyWaySection = () => {
  const benefits = [
    {
      icon: LayoutGrid,
      title: "Estruturação Estratégica",
      description: "Implantamos operações de e-commerce com base em diagnóstico, arquitetura de tecnologia e processos claros. Cada projeto nasce preparado para operar, vender e evoluir sem retrabalho.",
    },
    {
      icon: RefreshCcw,
      title: "Evolução Contínua",
      description: "Atuamos de forma próxima e estratégica, acompanhando dados, operação e performance para orientar decisões, corrigir rotas e evoluir a operação com consistência.",
    },
    {
      icon: TrendingUp,
      title: "Escala com Previsibilidade",
      description: "Com a base estruturada, focamos em crescimento sustentável, expansão de canais e performance. Escalar deixa de ser aposta e passa a ser processo.",
    },
  ];

  return (
    <section id="por-que-way" className="relative py-24 bg-background overflow-hidden">
      {/* Background Plus Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <Plus className="absolute top-20 right-[10%] w-8 h-8 text-primary/20" />
        <Plus className="absolute top-40 right-[5%] w-6 h-6 text-primary/15" />
        <Plus className="absolute bottom-32 left-[8%] w-6 h-6 text-primary/15" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Text */}
        <div className="text-center mb-16 max-w-4xl mx-auto animate-fade-in">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Com origem no Nordeste e atuação nacional, a Way E-commerce é uma aceleradora de operações digitais especializada em{" "}
            <span className="text-foreground font-semibold">estruturar e escalar negócios no online</span>. 
            Atuamos em toda a jornada da implantação à evolução contínua. Unindo estratégia, tecnologia e performance para gerar{" "}
            <span className="text-foreground font-semibold">crescimento previsível e sustentável</span>.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Corner Plus Decorations */}
                <Plus className="absolute top-4 right-4 w-5 h-5 text-primary/30 group-hover:text-primary/50 transition-colors duration-300" />
                <Plus className="absolute bottom-4 right-4 w-4 h-4 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />

                {/* Icon */}
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyWaySection;
