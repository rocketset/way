import { Zap, ShoppingCart, TrendingUp } from "lucide-react";
import { useState } from "react";

const WhyWaySection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const benefits = [{
    icon: Zap,
    title: "TUDO PRONTO",
    description: "Plataforma completa e pronta para escalar seu e-commerce com todas as ferramentas necessárias.",
    color: "from-yellow-400 to-amber-500",
    iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500"
  }, {
    icon: ShoppingCart,
    title: "FÁCIL DE USAR",
    description: "Interface intuitiva e recursos simplificados para você gerenciar sua loja sem complicações.",
    color: "from-primary to-yellow-600",
    iconBg: "bg-gradient-to-br from-primary to-yellow-600"
  }, {
    icon: TrendingUp,
    title: "SUPORTE COMPLETO",
    description: "Time dedicado para ajudar seu negócio a crescer com soluções personalizadas e atendimento ágil.",
    color: "from-amber-400 to-orange-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500"
  }];

  return (
    <section id="por-que-way" className="relative py-32 bg-gradient-to-b from-background to-gray-900 overflow-hidden">
      {/* Plus icons animados de fundo */}
      <div className="absolute top-10 left-10 text-primary/5 text-6xl animate-float" style={{ animationDelay: '0s' }}>+</div>
      <div className="absolute top-20 right-20 text-primary/5 text-8xl animate-float" style={{ animationDelay: '1s' }}>+</div>
      <div className="absolute bottom-20 left-1/4 text-primary/5 text-7xl animate-float" style={{ animationDelay: '2s' }}>+</div>
      <div className="absolute bottom-10 right-1/3 text-primary/5 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>+</div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Por que escolher a <span className="gradient-text">Way E-commerce?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluções completas para transformar seu negócio digital
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isHovered = hoveredCard === index;
            return (
              <div
                key={index}
                className="group relative bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover-scale cursor-pointer animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated corner Plus */}
                <div className="absolute top-4 right-4 text-primary text-xl opacity-0 group-hover:opacity-100 plus-rotate transition-all duration-500">+</div>
                
                <div className="relative">
                  <div className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl ${benefit.iconBg} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300 text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyWaySection;