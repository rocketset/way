import { ShoppingCart, Target, BarChart3, Compass, Plus, ArrowRight, Globe, MessageCircle, Bot, Plug, Store, TrendingUp, Brain, Network, Zap, Users, Palette, Activity, Share2, MousePointerClick, Map, Route } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SolutionsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const solutions = [
    {
      icon: ShoppingCart,
      badge: "Way.tech - Soluções Modulares",
      title: "Implantação & Desenvolvimento",
      subtitle: "Do planejamento estratégico à integração com marketplaces",
      description: "Estruturamos, migramos e desenvolvemos soluções personalizadas para que seu e-commerce nasça forte e já pronto para escalar. Conectamos todos os seus canais de venda para impulsionar o crescimento do seu negócio.",
      services: [
        { icon: ShoppingCart, label: "E-commerce" },
        { icon: Globe, label: "Desenvolvimento Web" },
        { icon: MessageCircle, label: "Automações de Whatsapp" },
        { icon: Bot, label: "CRM e automações com I.A" },
        { icon: Plug, label: "Integrações" },
        { icon: Store, label: "Marketplaces" }
      ],
      link: "/solucoes/implantacao-desenvolvimento"
    },
    {
      icon: Target,
      badge: "Way.consulting - Soluções Modulares",
      title: "Consultoria",
      subtitle: "Orientação estratégica e visão de mercado especializada",
      description: "Orientação estratégica para impulsionar o crescimento sustentável do seu e-commerce. Nossos consultores especializados analisam profundamente seu negócio, identificam oportunidades e desenvolvem estratégias personalizadas que geram resultados mensuráveis.",
      services: [
        { icon: Target, label: "Estratégia Digital" },
        { icon: TrendingUp, label: "Otimização de Conversão" },
        { icon: Store, label: "Marketplaces" },
        { icon: Brain, label: "Análise de Mercado" },
        { icon: Network, label: "Omnichannel" }
      ],
      link: "/solucoes/consultoria"
    },
    {
      icon: BarChart3,
      badge: "Way.Digital - Soluções Modulares",
      title: "Performance & Marketing",
      subtitle: "Operação Data-Driven para crescimento sustentável",
      description: "Núcleo estratégico que transforma objetivos em planos práticos e mensuráveis. Combinamos criatividade e inteligência de dados para desenvolver estratégias e campanhas que geram resultados reais, otimizando investimentos e ampliando conversões.",
      services: [
        { icon: Zap, label: "Automação" },
        { icon: Users, label: "CRM" },
        { icon: Palette, label: "Criativos" },
        { icon: TrendingUp, label: "Evolução" },
        { icon: Activity, label: "Performance" },
        { icon: Share2, label: "Social Consulting" },
        { icon: MousePointerClick, label: "Tráfego Pago" }
      ],
      link: "/solucoes/performance-marketing"
    },
    {
      icon: Compass,
      badge: "Way Journey - Metodologia Completa",
      title: "Jornada Way",
      subtitle: "Metodologia completa de transformação digital",
      description: "Uma metodologia completa para transformar seu e-commerce com análise 360° do seu negócio, plano de ação estruturado com metas e prazos definidos, além de suporte e mentoria em todas as etapas da transformação digital.",
      services: [
        { icon: Map, label: "Diagnóstico Completo" },
        { icon: Route, label: "Roadmap Personalizado" },
        { icon: Compass, label: "Acompanhamento Contínuo" }
      ],
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

        {/* Solutions List */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <Link
                to={solution.link}
                key={index}
                className="group relative animate-fade-in block"
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -mx-4"></div>
                
                <div className="flex gap-8 items-start py-8 border-b border-border/30 last:border-b-0 transition-all duration-500 group-hover:translate-x-4 relative">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-white flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:rotate-3 relative z-10 ${isHovered ? 'shadow-xl shadow-primary/20' : ''}`}>
                    <Icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" style={{ color: '#242424' }} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1 relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-300 mb-4">
                      <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform duration-300" />
                      <span className="text-sm font-medium text-primary">{solution.badge}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-3xl font-bold mb-3 text-black group-hover:text-primary transition-all duration-500 group-hover:translate-x-2">
                      {solution.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-primary font-semibold mb-4 text-lg leading-relaxed">
                      {solution.subtitle}
                    </p>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed text-base mb-6">
                      {solution.description}
                    </p>
                    
                    {/* Services tags */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {solution.services.map((service, idx) => {
                        const ServiceIcon = service.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 px-4 py-2 rounded-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-110 cursor-pointer group/tag relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover/tag:translate-x-[100%] transition-transform duration-500"></div>
                            <ServiceIcon className="w-4 h-4 text-primary group-hover/tag:rotate-[360deg] transition-transform duration-500 relative z-10" />
                            <span className="text-sm font-medium relative z-10">{service.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Interactive arrow indicator */}
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-semibold">Saiba mais sobre esta solução</span>
                      <ArrowRight className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
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
