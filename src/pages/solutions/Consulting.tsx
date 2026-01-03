import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaResultsSection from "@/components/CtaResultsSection";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Store, Brain, Network, ArrowRight, Check, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import consultingHero from "@/assets/consulting-hero.png";
const Consulting = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const servicesList = [{
    icon: Target,
    label: "Diagnóstico e Direcionamento Estratégico"
  }, {
    icon: Store,
    label: "Plataforma, Integrações e Arquitetura"
  }, {
    icon: TrendingUp,
    label: "Performance e Crescimento"
  }, {
    icon: Brain,
    label: "Marketplaces e Expansão de Canais"
  }, {
    icon: Network,
    label: "Estratégia Omnichannel"
  }];
  const howWeWork = [
    "Diagnóstico completo da operação, tecnologia, canais e processos",
    "Definição da plataforma de e-commerce e integrações ideais",
    "Construção de roadmap estratégico alinhado a metas reais",
    "Apoio em decisões críticas (tecnologia, parceiros, canais e estrutura)",
    "Estruturação de processos, times e fluxos operacionais",
    "Acompanhamento contínuo para ajuste de rota e evolução da operação"
  ];
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
                  <span className="text-sm font-medium text-primary">Way.consulting</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <Target className="w-10 h-10 md:w-12 md:h-12 text-primary flex-shrink-0 mt-1" />
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                    Estratégia, estrutura e decisões certas para <span className="text-primary">escalar o e-commerce.</span>
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
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                      Como atuamos na prática
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground max-w-4xl">
                      Atuamos lado a lado com empresas para estruturar, organizar e acelerar operações de e-commerce. Apoiamos diretamente na definição da melhor plataforma, integrações e parceiros, sempre alinhados à realidade da operação, aos objetivos do negócio e à capacidade de execução. Mais do que orientar, ajudamos a tomar decisões críticas, estruturar a operação e sustentar a execução com método e acompanhamento contínuo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {howWeWork.map((item, index) => <div key={index} className="flex items-start gap-3 bg-card border border-border hover:border-primary/50 px-5 py-4 rounded-xl hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group relative overflow-hidden animate-fade-in" style={{
              animationDelay: `${index * 0.05}s`
            }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 relative z-10" />
                  <span className="text-sm font-medium relative z-10 text-foreground">{item}</span>
                </div>)}
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

        {/* Services Highlights */}
        <section className="relative py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
          {/* Plus icons animados de fundo */}
          <div className="absolute top-10 left-10 text-foreground/5 text-6xl animate-float" style={{
          animationDelay: '0s'
        }}>+</div>
          <div className="absolute top-20 right-20 text-foreground/5 text-8xl animate-float" style={{
          animationDelay: '1s'
        }}>+</div>
          <div className="absolute bottom-20 left-1/4 text-foreground/5 text-7xl animate-float" style={{
          animationDelay: '2s'
        }}>+</div>
          <div className="absolute bottom-10 right-1/3 text-foreground/5 text-6xl animate-float" style={{
          animationDelay: '1.5s'
        }}>+</div>
          
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Áreas de atuação</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Nossos pilares de consultoria para estruturar e escalar sua operação</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {servicesList.map((service, index) => <div key={index} className="group flex flex-col gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 animate-fade-in relative overflow-hidden" style={{
              animationDelay: `${index * 0.1}s`
            }} onMouseEnter={() => setHoveredService(index)} onMouseLeave={() => setHoveredService(null)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {service.label}
                    </h3>
                  </div>
                </div>)}
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