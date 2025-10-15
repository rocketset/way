import { ShoppingCart, Target, BarChart3, Compass, Plus, ArrowRight, Globe, MessageCircle, Bot, Plug, Store, TrendingUp, Brain, Network, Zap, Users, Palette, Activity, Share2, MousePointerClick, Map, Route } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const SolutionsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const solutions = [{
    icon: ShoppingCart,
    badge: "Way.Tech",
    title: "Implantação & Desenvolvimento",
    subtitle: "Do planejamento estratégico à integração com marketplaces",
    description: "Estruturamos, migramos e desenvolvemos soluções personalizadas para que seu e-commerce nasça forte e já pronto para escalar. Conectamos todos os seus canais de venda para impulsionar o crescimento do seu negócio.",
    services: [{
      icon: ShoppingCart,
      label: "E-commerce"
    }, {
      icon: Globe,
      label: "Desenvolvimento Web"
    }, {
      icon: MessageCircle,
      label: "Automações de Whatsapp"
    }, {
      icon: Bot,
      label: "CRM e automações com I.A"
    }, {
      icon: Plug,
      label: "Integrações"
    }, {
      icon: Store,
      label: "Marketplaces"
    }],
    link: "/solucoes/implantacao-desenvolvimento"
  }, {
    icon: Target,
    badge: "Way.Consulting",
    title: "Consultoria",
    subtitle: "Orientação estratégica e visão de mercado especializada",
    description: "Orientação estratégica para impulsionar o crescimento sustentável do seu e-commerce. Nossos consultores especializados analisam profundamente seu negócio, identificam oportunidades e desenvolvem estratégias personalizadas que geram resultados mensuráveis.",
    services: [{
      icon: Target,
      label: "Estratégia Digital"
    }, {
      icon: TrendingUp,
      label: "Otimização de Conversão"
    }, {
      icon: Store,
      label: "Marketplaces"
    }, {
      icon: Brain,
      label: "Análise de Mercado"
    }, {
      icon: Network,
      label: "Omnichannel"
    }],
    link: "/solucoes/consultoria"
  }, {
    icon: BarChart3,
    badge: "Way.Digital",
    title: "Performance & Marketing",
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
  }, {
    icon: Compass,
    badge: "Way.Jorney",
    title: "Jornada Way",
    subtitle: "Metodologia completa de transformação digital",
    description: "Uma metodologia completa para transformar seu e-commerce com análise 360° do seu negócio, plano de ação estruturado com metas e prazos definidos, além de suporte e mentoria em todas as etapas da transformação digital.",
    services: [{
      icon: Map,
      label: "Diagnóstico Completo"
    }, {
      icon: Route,
      label: "Roadmap Personalizado"
    }, {
      icon: Compass,
      label: "Acompanhamento Contínuo"
    }],
    link: "/solucoes/jornada"
  }];
  return <section id="solucoes" className="relative py-20 bg-gradient-to-b from-background via-background to-card overflow-hidden">
      {/* Animated background elements */}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
            <Plus className="w-5 h-5 text-primary plus-rotate" />
            <span className="text-xs font-bold text-primary tracking-wider">SOLUÇÕES INTEGRADAS</span>
            <Plus className="w-5 h-5 text-primary plus-rotate" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <span className="text-foreground">Quer resultados de verdade?</span>
            <br />
            <span className="gradient-text">Da implantação à performance.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>Temos 4 hubs integrados para transformar seu e-commerce em uma operação de alta performance.</p>
          
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              asChild 
              size="lg" 
              className="bg-primary text-background hover:bg-primary/90 font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <a href="https://wayecommerce.com.br/contact" className="flex items-center gap-2">
                Fale com um especialista
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