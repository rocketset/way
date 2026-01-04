import { Target, ShoppingCart, Settings, TrendingUp, Users, Megaphone } from "lucide-react";

const StrategicPillarsSection = () => {
  const pillars = [
    {
      icon: Target,
      title: "Diagnóstico & Estratégia",
      description: "Direcionamento claro antes de qualquer execução"
    },
    {
      icon: ShoppingCart,
      title: "Plataforma & Arquitetura",
      description: "Decisão, implantação e migração de e-commerces"
    },
    {
      icon: Settings,
      title: "Estruturação de Operação",
      description: "Processos, times, fluxos e integrações"
    },
    {
      icon: TrendingUp,
      title: "Performance & Crescimento",
      description: "Dados, métricas, CRO e evolução contínua"
    },
    {
      icon: Users,
      title: "CRM & Automação",
      description: "Relacionamento, recompra e inteligência de dados"
    },
    {
      icon: Megaphone,
      title: "Tráfego & Criativos",
      description: "Aquisição orientada a performance e conversão"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-background to-card overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Microheadline */}
        <div className="text-center mb-6 animate-fade-in">
          <span className="inline-block px-4 py-2 text-xs font-bold tracking-widest text-muted-foreground bg-muted/50 rounded-full border border-border/50">
            ESCALAR E-COMMERCE EXIGE ESTRUTURA, NÃO APENAS FERRAMENTAS
          </span>
        </div>

        {/* Headline principal */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="text-foreground">Seu e-commerce precisa de </span>
          <span className="text-primary">bases sólidas</span>
          <span className="text-foreground"> para crescer e escalar</span>
        </h2>

        {/* Grid de 6 ícones/pilares */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="group relative bg-card border border-border/50 rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                {/* Ícone */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                
                {/* Título */}
                <h3 className="text-sm md:text-base font-bold text-foreground mb-2 leading-tight">
                  {pillar.title}
                </h3>
                
                {/* Descrição */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Linhas convergentes SVG */}
        <div className="relative h-24 md:h-32 max-w-6xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Linhas curvas partindo de cada card convergindo ao centro */}
            <path
              d="M100 0 Q100 60 600 110"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeOpacity="0.3"
              fill="none"
            />
            <path
              d="M300 0 Q300 50 600 110"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeOpacity="0.4"
              fill="none"
            />
            <path
              d="M500 0 Q500 40 600 110"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeOpacity="0.5"
              fill="none"
            />
            <path
              d="M700 0 Q700 40 600 110"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeOpacity="0.5"
              fill="none"
            />
            <path
              d="M900 0 Q900 50 600 110"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeOpacity="0.4"
              fill="none"
            />
            <path
              d="M1100 0 Q1100 60 600 110"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeOpacity="0.3"
              fill="none"
            />
            {/* Ponto central de convergência */}
            <circle
              cx="600"
              cy="110"
              r="6"
              fill="hsl(var(--primary))"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Texto de transição */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-lg md:text-xl text-primary font-semibold italic max-w-3xl mx-auto">
            Estrutura, método e performance atuando juntos
            <br />
            para sustentar decisões estratégicas no e-commerce.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StrategicPillarsSection;
