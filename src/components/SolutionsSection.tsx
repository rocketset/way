import { ShoppingCart, Target, BarChart3, Compass, Plus, ArrowRight, Globe, MessageCircle, Bot, Plug, Store, TrendingUp, Brain, Network, Zap, Users, Palette, Activity, Share2, MousePointerClick, Map, Route } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const SolutionsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const solutions = [{
    icon: Target,
    badge: "Way.Consulting",
    title: "Mentoria e Consultoria",
    subtitle: "Estratégia, estrutura e decisões certas para escalar o e-commerce",
    description: "Atuamos lado a lado com empresas para estruturar, organizar e acelerar operações de e-commerce. Apoiamos na definição da melhor plataforma, integrações e parceiros, sempre alinhados à realidade da operação e aos objetivos do negócio.",
    services: [{
      icon: Target,
      label: "Diagnóstico e Direcionamento"
    }, {
      icon: Plug,
      label: "Plataforma e Integrações"
    }, {
      icon: TrendingUp,
      label: "Performance e Crescimento"
    }, {
      icon: Store,
      label: "Marketplaces e Canais"
    }, {
      icon: Network,
      label: "Estratégia Omnichannel"
    }],
    link: "/solucoes/consultoria"
  }, {
    icon: ShoppingCart,
    badge: "Way.Tech",
    title: "Implantação, Desenvolvimento e Migração",
    subtitle: "Arquitetura e execução para escalar o e-commerce",
    description: "Implantamos, desenvolvemos e migramos operações digitais completas, estruturando integrações, automações e canais de venda para sustentar crescimento contínuo.",
    services: [{
      icon: ShoppingCart,
      label: "E-commerce"
    }, {
      icon: Globe,
      label: "Desenvolvimento Web"
    }, {
      icon: Plug,
      label: "Migração de Plataformas"
    }, {
      icon: Plug,
      label: "Integrações"
    }, {
      icon: MessageCircle,
      label: "Automações de WhatsApp"
    }, {
      icon: Bot,
      label: "CRM e Automações com IA"
    }, {
      icon: Store,
      label: "Marketplaces"
    }],
    link: "/solucoes/implantacao-desenvolvimento"
  }, {
    icon: BarChart3,
    badge: "Way.Digital",
    title: "Performance e Marketing",
    subtitle: "Operação Data-Driven para crescimento sustentável",
    description: "Núcleo estratégico que transforma objetivos em planos práticos e mensuráveis. Combinamos criatividade e inteligência de dados para desenvolver estratégias e campanhas que geram resultados reais, otimizando investimentos e ampliando conversões.",
    services: [{
      icon: Zap,
      label: "Automação"
    }, {
      icon: Users,
      label: "CRM"
    }, {
      icon: Palette,
      label: "Criativos"
    }, {
      icon: TrendingUp,
      label: "Evolução"
    }, {
      icon: Activity,
      label: "Performance"
    }, {
      icon: Share2,
      label: "Social Consulting"
    }, {
      icon: MousePointerClick,
      label: "Tráfego Pago"
    }],
    link: "/solucoes/performance-marketing"
  }
  // JORNADA WAY - TEMPORARIAMENTE REMOVIDO (para uso futuro)
  // {
  //   icon: Compass,
  //   badge: "Way.Journey",
  //   title: "Jornada Way",
  //   subtitle: "Metodologia completa de transformação digital",
  //   description: "Uma metodologia completa para transformar seu e-commerce com análise 360° do seu negócio, plano de ação estruturado com metas e prazos definidos, além de suporte e mentoria em todas as etapas da transformação digital.",
  //   services: [{
  //     icon: Map,
  //     label: "Diagnóstico Completo"
  //   }, {
  //     icon: Route,
  //     label: "Roadmap Personalizado"
  //   }, {
  //     icon: Compass,
  //     label: "Acompanhamento Contínuo"
  //   }],
  //   link: "/solucoes/jornada"
  // }
  ];
  return <section id="solucoes" className="relative py-20 bg-gradient-to-b from-background via-background to-card overflow-hidden">
      {/* Animated background elements */}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
            <Plus className="w-5 h-5 text-primary plus-rotate" />
            <span className="text-xs font-bold text-primary tracking-wider">NOSSAS SOLUÇÕES</span>
            <Plus className="w-5 h-5 text-primary plus-rotate" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <span className="text-foreground">Soluções para estruturar</span>
            <br />
            <span className="gradient-text">a operação digital como um todo.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>A Way executa projetos que vão além do site. Implantamos, desenvolvemos e evoluímos operações de e-commerce, conectando plataforma, integrações, automações, CRM e marketplaces em uma estrutura única, sólida e preparada para escalar.</p>
          
          {/* Frase de autoridade */}
          <div className="mt-6 animate-fade-in" style={{
          animationDelay: '0.25s'
        }}>
            <p className="text-xl md:text-2xl font-bold text-primary italic">
              "Tecnologia não é escolha estética. É decisão estratégica."
            </p>
          </div>
          
          <div className="mt-8 animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <Button asChild size="lg" className="bg-primary text-background hover:bg-primary/90 font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              <a className="flex items-center gap-2" href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0">
                Fale agora com um consultor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>

        {/* Solutions List */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => {
          const Icon = solution.icon;
          const isHovered = hoveredCard === index;
          return <Link to={solution.link} key={index} className="group relative animate-fade-in block" style={{
            animationDelay: `${index * 0.15}s`
          }} onMouseEnter={() => setHoveredCard(index)} onMouseLeave={() => setHoveredCard(null)}>
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -mx-4">
                  {/* Animated Plus decorations on hover */}
                  <div className="absolute -top-4 left-1/4 text-primary text-2xl opacity-0 group-hover:opacity-100 plus-rotate transition-all duration-500">+</div>
                  <div className="absolute -bottom-4 right-1/4 text-primary text-2xl opacity-0 group-hover:opacity-100 plus-rotate transition-all duration-500">+</div>
                </div>
                
                <div className="flex gap-8 items-start py-8 border-b border-border/30 last:border-b-0 transition-all duration-500 group-hover:translate-x-4 relative">
                  {/* Content */}
                  <div className="flex-1 pt-1 relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-300 mb-4 cursor-pointer">
                      <Plus className="w-4 h-4 text-primary plus-rotate" />
                      <span className="text-sm font-medium text-primary">{solution.badge}</span>
                    </div>
                    
                    {/* Title with Icon */}
                    <h3 className="flex items-center gap-3 text-3xl font-bold mb-3 text-white group-hover:text-primary transition-all duration-500 group-hover:translate-x-2">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                        <Icon className="w-5 h-5 transition-transform duration-300" style={{
                      color: '#242424'
                    }} />
                      </div>
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
                    return <div key={idx} className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 px-4 py-2 rounded-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover-lift cursor-pointer group/tag relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover/tag:translate-x-[100%] transition-transform duration-500"></div>
                            <ServiceIcon className="w-4 h-4 text-primary group-hover/tag:rotate-[360deg] transition-transform duration-500 relative z-10" />
                            <span className="text-sm font-medium relative z-10">{service.label}</span>
                            
                            {/* Mini plus icon on hover */}
                            <span className="text-primary text-xs opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300 relative z-10">+</span>
                          </div>;
                  })}
                    </div>
                    
                    {/* Interactive arrow indicator */}
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-semibold">Saiba mais sobre esta solução</span>
                      <ArrowRight className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                </div>
              </Link>;
        })}
        </div>
      </div>
    </section>;
};
export default SolutionsSection;