import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaResultsSection from "@/components/CtaResultsSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Cpu, CreditCard, Truck, Smile, ArrowRight, Check, Globe, MessageCircle, Bot, Plus, Plug } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import shopifyPartner from "@/assets/partners/shopify-partner.png";
import wbuyPartner from "@/assets/partners/wbuy-partner.png";
import trayPartner from "@/assets/partners/tray-partner.png";
import nuvemshopPartner from "@/assets/partners/nuvemshop-partner.png";
import bagyPartner from "@/assets/partners/bagy-partner.png";
import implementationHero from "@/assets/implementation-hero.png";
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
  }];
  const services = [{
    icon: ShoppingCart,
    title: "E-commerce",
    subtitle: "Planejamos, desenvolvemos e gerenciamos toda a estratégia do seu e-commerce",
    description: "Desenvolvemos e gerenciamos e-commerce com atuação ampla e entrega. Oferecendo uma experiência de qualidade para seus clientes, com estratégias focadas em resultados. Atendemos diversos modelos de negócio, como B2B, B2C, B2E, D2C.",
    hasLogos: true
  }, {
    icon: Globe,
    title: "Desenvolvimento Web",
    subtitle: "Soluções web personalizadas e escaláveis para o seu negócio digital",
    description: "Criamos websites e aplicações web modernas, responsivas e otimizadas para performance. Utilizamos as melhores tecnologias e práticas de desenvolvimento para entregar soluções que impulsionam seu negócio online e proporcionam experiências excepcionais aos seus usuários."
  }, {
    icon: MessageCircle,
    title: "Automações de Whatsapp",
    subtitle: "Automatize seu atendimento e vendas através do WhatsApp",
    description: "Implementamos soluções de automação para WhatsApp que otimizam seu atendimento, qualificam leads e aumentam suas conversões. Integração com chatbots inteligentes, respostas automáticas e fluxos personalizados para cada etapa da jornada do cliente."
  }, {
    icon: Bot,
    title: "CRM e automações com I.A",
    subtitle: "Gestão de relacionamento com clientes potencializada por inteligência artificial",
    description: "Implementamos sistemas de CRM integrados com automações inteligentes que utilizam I.A para análise de dados, previsão de comportamento, personalização de comunicações e otimização de processos comerciais. Transforme dados em insights acionáveis e aumente a eficiência da sua equipe."
  }, {
    icon: Plug,
    title: "Integrações",
    subtitle: "Conexões perfeitas entre ferramentas e sistemas para máxima eficiência",
    description: "Implementamos e gerenciamos integrações entre suas principais ferramentas de marketing, vendas e gestão. Garantimos que seus dados fluam perfeitamente entre plataformas, eliminando trabalho manual e proporcionando visão unificada do negócio."
  }, {
    icon: Store,
    title: "Marketplaces",
    subtitle: "Aqui o objetivo é conectar seus produtos às plataformas certas, com atuação em mais de 300 marketplaces",
    description: "Expandimos o alcance dos seus negócios, criando oportunidades lucrativas capazes de ativar a cada ponto específico para seus produtos. Além disso, apresentamos histórias que possam se beneficiar da expertise da sua negócio, celebrando cada atuação qualificando sua visibilidade na sua marca."
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
                  <span className="text-sm font-medium text-primary">Way.tech
                </span>
                </div>
                
                <div className="flex items-start gap-4">
                  <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-primary flex-shrink-0 mt-1" />
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                    Implantação <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">e Desenvolvimento</span>
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
                  <img alt="Soluções de Implementação e Desenvolvimento" src="/lovable-uploads/abb5203a-df77-46c3-8b3a-e26e44e1d469.png" className="w-full h-full relative z-10 transition-transform duration-500 object-contain" />
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
                    É aqui que estruturamos, migramos e desenvolvemos soluções personalizadas para que seu e-commerce nasça forte e já pronto para escalar.
                  </h2>
                </div>
              </div>
              <div className="flex items-center animate-fade-in" style={{
              animationDelay: '0.2s'
            }}>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Do planejamento estratégico à integração com marketplaces, conectamos todos os seus canais de venda para impulsionar o crescimento do seu negócio. Nossas soluções integram sistemas de gestão, logística e meios de pagamento, simplificando toda a operação e garantindo uma jornada de compra fluida e completa.
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
                <a href="https://wayecommerce.com.br/contact" className="relative z-10 text-sm sm:text-base px-4 sm:px-6 flex items-center justify-center gap-2 whitespace-normal sm:whitespace-nowrap text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:rotate-[360deg] transition-transform duration-500" />
                  <span className="flex-1">Fale com um especialista</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-2 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Details */}
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
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
              {services.map((service, index) => <div key={index} className="group flex flex-col md:flex-row gap-4 md:gap-8 items-start py-6 md:py-8 border-b border-border/30 last:border-b-0 transition-all duration-500 md:hover:translate-x-4 animate-fade-in relative" style={{
              animationDelay: `${index * 0.1}s`
            }} onMouseEnter={() => setHoveredService(index)} onMouseLeave={() => setHoveredService(null)}>
                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -mx-4"></div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1 relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-3 md:mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <service.icon className="w-6 h-6 md:w-7 md:h-7 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-all duration-500 md:group-hover:translate-x-2">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-primary font-semibold mb-3 md:mb-4 text-base md:text-lg leading-relaxed">
                      {service.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {service.description}
                    </p>
                  </div>
                </div>)}
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