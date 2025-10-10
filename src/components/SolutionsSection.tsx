import { ShoppingCart, Target, BarChart3, Compass, Plus, ArrowRight, Globe, MessageCircle, Bot, Plug, Store, TrendingUp, Brain, Network, Zap, Users, Palette, Activity, Share2, MousePointerClick, Map, Route } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SolutionsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const solutions = [
    {
      icon: ShoppingCart,
      badge: "Way.tech",
      title: "Implantação & Desenvolvimento",
      description: "Estruturamos, migramos e desenvolvemos soluções personalizadas para que seu e-commerce nasça forte e já pronto para escalar.",
      services: [
        { icon: ShoppingCart, label: "E-commerce" },
        { icon: Globe, label: "Desenvolvimento Web" },
        { icon: MessageCircle, label: "Automações de Whatsapp" },
        { icon: Bot, label: "CRM e automações com I.A" },
        { icon: Plug, label: "Integrações" },
        { icon: Store, label: "Marketplaces" }
      ],
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      link: "/solucoes/implantacao-desenvolvimento"
    },
    {
      icon: Target,
      badge: "Way.consulting",
      title: "Consultoria",
      description: "Orientação estratégica para impulsionar o crescimento sustentável do seu e-commerce com expertise técnica e visão de mercado.",
      services: [
        { icon: Target, label: "Estratégia Digital" },
        { icon: TrendingUp, label: "Otimização de Conversão" },
        { icon: Store, label: "Marketplaces" },
        { icon: Brain, label: "Análise de Mercado" },
        { icon: Network, label: "Omnichannel" }
      ],
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      link: "/solucoes/consultoria"
    },
    {
      icon: BarChart3,
      badge: "Way.Digital",
      title: "Performance & Marketing",
      description: "Núcleo estratégico que transforma objetivos em planos práticos, mensuráveis e sustentáveis através de operação data-driven.",
      services: [
        { icon: Zap, label: "Automação" },
        { icon: Users, label: "CRM" },
        { icon: Palette, label: "Criativos" },
        { icon: TrendingUp, label: "Evolução" },
        { icon: Activity, label: "Performance" },
        { icon: Share2, label: "Social Consulting" },
        { icon: MousePointerClick, label: "Tráfego Pago" }
      ],
      gradient: "from-amber-500 via-orange-500 to-red-500",
      link: "/solucoes/performance-marketing"
    },
    {
      icon: Compass,
      badge: "Way Journey",
      title: "Jornada Way",
      description: "Uma metodologia completa para transformar seu e-commerce com diagnóstico, roadmap personalizado e acompanhamento contínuo.",
      services: [
        { icon: Map, label: "Diagnóstico Completo" },
        { icon: Route, label: "Roadmap Personalizado" },
        { icon: Compass, label: "Acompanhamento Contínuo" }
      ],
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      link: "/solucoes/jornada"
    }
  ];

  return (
    <section id="solucoes" className="relative py-32 bg-gradient-to-b from-background via-background to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        
        {/* Animated Plus Icons */}
        <div className="opacity-5">
          <Plus className="absolute top-10 left-10 w-20 h-20 text-primary animate-[spin_20s_linear_infinite]" />
          <Plus className="absolute top-32 right-20 w-32 h-32 text-primary animate-[spin_25s_linear_infinite_reverse]" />
          <Plus className="absolute bottom-20 left-1/4 w-16 h-16 text-primary animate-[spin_15s_linear_infinite]" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
            <Plus className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary tracking-wider">SOLUÇÕES INTEGRADAS</span>
            <Plus className="w-6 h-6 text-primary animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Soluções modulares</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-primary">
              para seu e-commerce
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Escolha as soluções ideais para cada etapa do seu negócio digital
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <Link
                to={solution.link}
                key={index}
                className="group relative animate-fade-in block"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${solution.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700`} />

                {/* Main card */}
                <div className="relative bg-card/95 backdrop-blur-sm border-2 border-border hover:border-transparent rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl h-full">
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${solution.gradient}`} />

                  <div className="p-8">
                    {/* Header with Icon and Badge */}
                    <div className="flex items-start gap-4 mb-6">
                      {/* Icon */}
                      <div className="relative">
                        <div 
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.gradient} shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
                        >
                          <Icon className="w-8 h-8 text-white relative z-10" />
                          
                          {/* Pulse rings */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping opacity-20" />
                        </div>

                        {/* Floating Plus decoration */}
                        {isHovered && (
                          <Plus className="absolute -top-2 -right-2 w-5 h-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                        )}
                      </div>

                      {/* Badge */}
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
                          <Plus className="w-3 h-3 text-primary group-hover:rotate-90 transition-transform duration-300" />
                          <span className="text-xs font-medium text-primary">{solution.badge}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-yellow-500 transition-all duration-300">
                      {solution.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {solution.description}
                    </p>

                    {/* Services tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {solution.services.slice(0, 4).map((service, idx) => {
                        const ServiceIcon = service.icon;
                        return (
                          <div
                            key={idx}
                            className="group/tag relative overflow-hidden"
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r ${solution.gradient} opacity-10 group-hover/tag:opacity-20 transition-opacity duration-300`} />
                            
                            <div className="relative px-3 py-2 bg-background/50 backdrop-blur-sm border border-border group-hover/tag:border-transparent rounded-full transition-all duration-300 flex items-center gap-2">
                              <ServiceIcon className="w-3 h-3 text-primary" />
                              <span className="text-xs font-medium text-foreground">
                                {service.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {solution.services.length > 4 && (
                        <div className="px-3 py-2 bg-background/50 backdrop-blur-sm border border-border rounded-full">
                          <span className="text-xs font-medium text-muted-foreground">
                            +{solution.services.length - 4} mais
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Call to action */}
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 mt-4">
                      <span className="text-sm font-semibold">Saiba mais sobre esta solução</span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </div>
                  </div>

                  {/* Bottom decorative element */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${solution.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
