import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaResultsSection from "@/components/CtaResultsSection";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Brain, Compass, Users, BarChart3, ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";

const Consulting = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const servicesList = [{
    icon: Target,
    label: "Diagnóstico Estratégico"
  }, {
    icon: Compass,
    label: "Direcionamento e Roadmap"
  }, {
    icon: Brain,
    label: "Decisão de Plataforma e Arquitetura"
  }, {
    icon: Users,
    label: "Estruturação de Operação e Times"
  }, {
    icon: BarChart3,
    label: "Análise de Performance e Crescimento"
  }];

  const howWeWork = [
    "Diagnóstico estratégico da operação digital",
    "Avaliação de maturidade, gargalos e oportunidades",
    "Apoio na decisão da melhor plataforma e arquitetura",
    "Definição de roadmap estratégico e prioridades",
    "Direcionamento para estruturação de times e processos",
    "Acompanhamento estratégico para evolução contínua"
  ];

  const deliveries = [{
    icon: Brain,
    title: "Diagnóstico Estratégico",
    description: "Análise profunda da operação, tecnologia, canais e processos para identificar gargalos e oportunidades."
  }, {
    icon: Compass,
    title: "Direcionamento e Roadmap",
    description: "Definição de prioridades, etapas e caminhos claros para evolução do e-commerce."
  }, {
    icon: Target,
    title: "Decisão de Plataforma e Arquitetura",
    description: "Apoio na escolha da plataforma, integrações e arquitetura mais adequadas ao negócio."
  }, {
    icon: Users,
    title: "Estruturação de Operação e Times",
    description: "Orientação para organização de processos, papéis e estrutura interna do e-commerce."
  }, {
    icon: BarChart3,
    title: "Análise de Performance e Crescimento",
    description: "Leitura estratégica de dados para apoiar decisões e evolução contínua da operação."
  }];

  return <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      <main className="pt-24 pb-0">
        {/* Hero Section */}
        <section className="mb-16 relative">
          {/* Animated Decorative Plus Icons */}
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
                  <span className="text-sm font-medium text-primary">Way.Consulting</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <Target className="w-10 h-10 md:w-12 md:h-12 text-primary flex-shrink-0 mt-1" />
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                    Direção estratégica para <span className="text-primary">decisões certas no e-commerce.</span>
                  </h1>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {servicesList.map((service, index) => {
                    const ServiceIcon = service.icon;
                    return <div key={index} className="group flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 cursor-pointer animate-fade-in relative overflow-hidden" style={{
                      animationDelay: `${index * 0.1}s`
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-3 relative z-10">
                        <ServiceIcon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors relative z-10">{service.label}</span>
                      <ArrowRight className="ml-auto w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all relative z-10" />
                    </div>;
                  })}
                </div>
              </div>
              
              <div className="relative animate-fade-in group flex items-center justify-center h-full" style={{
              animationDelay: '0.3s'
            }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-primary/20 group-hover:border-primary/40 transition-all duration-500 hover:scale-105 transform w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  <img alt="Mentoria e Consultoria" src="/lovable-uploads/4febb48a-4651-410c-9449-9c830ed7065b.jpg" className="w-full h-full relative z-10 object-cover" />
                  <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/30 animate-[spin_10s_linear_infinite] group-hover:text-primary/50 transition-colors" />
                  <Plus className="absolute bottom-4 left-4 w-6 h-6 text-primary/20 animate-[spin_15s_linear_infinite_reverse] group-hover:text-primary/40 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Banner Section */}
        <section className="py-16 mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
              <div className="space-y-4 md:space-y-6 animate-fade-in lg:col-span-2">
                <div className="flex items-start gap-3">
                  <Plus className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0 mt-1" />
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed text-muted-foreground max-w-4xl">
                      A Mentoria & Consultoria da Way é focada em direcionamento estratégico, clareza e tomada de decisão.
                      Atuamos ao lado de gestores e lideranças para definir caminhos, priorizar ações e orientar escolhas críticas sobre tecnologia, operação, canais e crescimento.
                    </p>
                    <p className="text-lg leading-relaxed text-foreground font-semibold max-w-4xl border-l-4 border-primary pl-4">
                      Este serviço não executa a implantação, mas direciona como, quando e por que executar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center px-4">
              <Button asChild size="lg" className="group shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105 relative overflow-hidden w-full sm:w-auto">
                <a href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0" className="relative z-10 text-sm sm:text-base px-4 sm:px-6 flex items-center justify-center gap-2 whitespace-normal sm:whitespace-nowrap text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:rotate-[360deg] transition-transform duration-500" />
                  <span className="flex-1">Fale com um especialista</span>
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
                Direcionamento estratégico na prática
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

        {/* Pílulas - Mentoria & Consultoria */}
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
                <span className="text-xs font-bold text-primary tracking-wider">MENTORIA & CONSULTORIA</span>
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in text-white" style={{ animationDelay: '0.1s' }}>
                Áreas de atuação
              </h2>
            </div>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              {deliveries.map((delivery, index) => {
                const DeliveryIcon = delivery.icon;
                return (
                  <div 
                    key={index} 
                    className="group flex flex-col gap-4 p-6 rounded-xl bg-card/10 border border-border/30 hover:border-primary/50 transition-all duration-500 hover:bg-card/20 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setHoveredService(index)} 
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <DeliveryIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {delivery.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {delivery.description}
                    </p>
                  </div>
                );
              })}
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
                  Consultoria para quem precisa de direção,
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">
                  não de achismo.
                </p>
                <p className="text-lg text-muted-foreground mt-8">
                  Clareza estratégica para decisões que sustentam a execução.
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

        {/* Contact Form Section */}
        <CtaResultsSection />
      </main>

      <Footer />
    </div>;
};

export default Consulting;