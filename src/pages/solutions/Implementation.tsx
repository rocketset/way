import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaResultsSection from "@/components/CtaResultsSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, ArrowRight, Globe, MessageCircle, Bot, Plus, Plug, RefreshCw, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import shopifyPartner from "@/assets/partners/shopify-partner.png";
import wbuyPartner from "@/assets/partners/wbuy-partner.png";
import trayPartner from "@/assets/partners/tray-partner.png";
import nuvemshopPartner from "@/assets/partners/nuvemshop-partner.png";
import bagyPartner from "@/assets/partners/bagy-partner.png";

const Implementation = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const ecommerceLogos = [shopifyPartner, wbuyPartner, trayPartner, nuvemshopPartner, bagyPartner];
  
  const servicesList = [{
    icon: ShoppingCart,
    label: "E-commerce"
  }, {
    icon: Globe,
    label: "Desenvolvimento Web"
  }, {
    icon: RefreshCw,
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
  }];

  const howWeWork = [
    "Planejamento técnico e operacional antes de qualquer implantação ou migração",
    "Definição da plataforma ideal conforme a maturidade e o crescimento da operação",
    "Implantação ou reconstrução completa do e-commerce",
    "Migração estruturada, preservando dados, SEO, histórico e continuidade operacional",
    "Integrações com ERP, CRM, WMS, meios de pagamento, logística e marketplaces",
    "Estruturação da base para automações, CRM e performance futura",
    "Acompanhamento no go-live e pós-implantação"
  ];

  const deliveries = [{
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Implantação de lojas virtuais B2C e B2B com foco em performance, usabilidade e escalabilidade."
  }, {
    icon: Globe,
    title: "Desenvolvimento Web",
    description: "Desenvolvimento de páginas, fluxos e funcionalidades sob medida para a operação."
  }, {
    icon: RefreshCw,
    title: "Migração de Plataformas",
    description: "Migração estratégica entre plataformas, preservando dados, SEO, pedidos e faturamento."
  }, {
    icon: Plug,
    title: "Integrações",
    description: "Integração entre e-commerce, ERP, CRM, WMS, pagamentos, logística e marketplaces."
  }, {
    icon: MessageCircle,
    title: "Automações de WhatsApp",
    description: "Automação de atendimento, vendas e pós-venda integrada à operação e ao CRM."
  }, {
    icon: Bot,
    title: "CRM e Automações com IA",
    description: "Implantação de CRM, réguas de relacionamento e automações para retenção e LTV."
  }, {
    icon: Store,
    title: "Marketplaces",
    description: "Estruturação e integração com marketplaces conectados à operação central."
  }];

  return <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      <main className="pt-32 pb-0">
        {/* Hero Section */}
        <section className="mb-20 relative">
          {/* Animated Decorative Plus Icons with floating effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <Plus className="absolute top-10 left-10 w-20 h-20 text-primary animate-[spin_20s_linear_infinite]" />
            <Plus className="absolute top-32 right-20 w-32 h-32 text-primary animate-[spin_25s_linear_infinite_reverse]" />
            <Plus className="absolute bottom-20 left-1/4 w-16 h-16 text-primary animate-[spin_15s_linear_infinite]" />
            <Plus className="absolute top-1/2 right-1/3 w-24 h-24 text-primary animate-[spin_30s_linear_infinite_reverse]" />
            <Plus className="absolute top-1/4 left-1/2 w-12 h-12 text-primary animate-[spin_18s_linear_infinite]" />
          </div>
          
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6 md:space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-sm font-medium text-primary">Way.Tech</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-primary flex-shrink-0 mt-1" />
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                    A base técnica e operacional <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">para escalar o e-commerce.</span>
                  </h1>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                {servicesList.map((service, index) => <div key={index} className="group flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 cursor-pointer animate-fade-in relative overflow-hidden" style={{
                  animationDelay: `${index * 0.1}s`
                }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-3 relative z-10">
                        <service.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors relative z-10">{service.label}</span>
                      <ArrowRight className="ml-auto w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all relative z-10" />
                    </div>)}
                </div>
              </div>
              
              <div className="relative animate-fade-in group flex items-center justify-center h-full" style={{
              animationDelay: '0.3s'
            }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-primary/20 group-hover:border-primary/40 transition-all duration-500 hover:scale-105 transform w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  <img alt="Soluções de Implantação, Desenvolvimento e Migração" src="/lovable-uploads/abb5203a-df77-46c3-8b3a-e26e44e1d469.png" className="w-full h-full relative z-10 transition-transform duration-500 object-contain" />
                  {/* Floating Plus decorations */}
                  <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/30 animate-[spin_10s_linear_infinite] group-hover:text-primary/50 transition-colors" />
                  <Plus className="absolute bottom-4 left-4 w-6 h-6 text-primary/20 animate-[spin_15s_linear_infinite_reverse] group-hover:text-primary/40 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Banner Section */}
        <section className="py-20 mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
              <div className="space-y-4 md:space-y-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Plus className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0 mt-1" />
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                    Implantamos, desenvolvemos e migramos operações de e-commerce com foco na estrutura completa da operação digital.
                  </h2>
                </div>
              </div>
              <div className="flex flex-col justify-center animate-fade-in space-y-6" style={{
              animationDelay: '0.2s'
            }}>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Executamos projetos que envolvem plataforma, integrações, automações, CRM e marketplaces, garantindo uma base sólida, escalável e preparada para evolução contínua.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Apoiamos a escolha da plataforma mais adequada e das integrações ideais, sempre considerando a realidade da operação, os processos existentes e o crescimento esperado.
                </p>
                <p className="text-xl md:text-2xl font-bold text-primary italic">
                  "Tecnologia não é escolha estética. É decisão estratégica."
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {servicesList.map((service, index) => <div key={index} className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 px-5 py-3 rounded-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-110 cursor-pointer group relative overflow-hidden animate-fade-in" style={{
              animationDelay: `${index * 0.05}s`
            }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  <service.icon className="w-4 h-4 text-primary group-hover:rotate-[360deg] transition-transform duration-500 relative z-10" />
                  <span className="text-sm font-medium relative z-10">{service.label}</span>
                </div>)}
            </div>

            <div className="text-center px-4">
              <Button asChild size="lg" className="group shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105 relative overflow-hidden w-full sm:w-auto">
                <a href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0" className="relative z-10 text-sm sm:text-base px-4 sm:px-6 flex items-center justify-center gap-2 whitespace-normal sm:whitespace-nowrap text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:rotate-[360deg] transition-transform duration-500" />
                  <span className="flex-1">Fale agora com um consultor</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-2 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Como Atuamos Section */}
        <section className="relative py-20 bg-gradient-to-b from-card to-background overflow-hidden">
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wider">COMO ATUAMOS</span>
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Execução estruturada do início ao fim
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {howWeWork.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nossas Entregas Section */}
        <section className="relative py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
          {/* Plus icons animados de fundo */}
          <div className="absolute top-10 left-10 text-primary/5 text-6xl animate-float" style={{
          animationDelay: '0s'
        }}>+</div>
          <div className="absolute top-20 right-20 text-primary/5 text-8xl animate-float" style={{
          animationDelay: '1s'
        }}>+</div>
          <div className="absolute bottom-20 left-1/4 text-primary/5 text-7xl animate-float" style={{
          animationDelay: '2s'
        }}>+</div>
          <div className="absolute bottom-10 right-1/3 text-primary/5 text-6xl animate-float" style={{
          animationDelay: '1.5s'
        }}>+</div>
          
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wider">NOSSAS ENTREGAS</span>
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in text-white" style={{ animationDelay: '0.1s' }}>
                O que entregamos
              </h2>
            </div>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              {deliveries.map((delivery, index) => (
                <div 
                  key={index} 
                  className="group flex flex-col gap-4 p-6 rounded-xl bg-card/10 border border-border/30 hover:border-primary/50 transition-all duration-500 hover:bg-card/20 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredService(index)} 
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                      <delivery.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {delivery.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {delivery.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diferencial Way Section */}
        <section className="relative py-20 bg-gradient-to-b from-background to-card overflow-hidden">
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wider">DIFERENCIAL WAY</span>
                <Plus className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Não entregamos apenas um site no ar.
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">
                  Entregamos uma operação pronta para crescer.
                </p>
                <p className="text-lg text-muted-foreground mt-8">
                  Implantamos pensando no mês 1, no mês 6 e no ano 2 da operação.
                </p>
              </div>
              
              <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="group shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105 relative overflow-hidden">
                  <a href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0" className="relative z-10 flex items-center gap-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Plus className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-500" />
                    Fale com um especialista
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Carousel */}
        <PartnersCarousel />

        {/* Contact Form Section */}
        <CtaResultsSection />
      </main>

      <Footer />
    </div>;
};

export default Implementation;