import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Store, Brain, Network, ArrowRight, Check, Smile, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Consulting = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  
  const servicesList = [{
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
  }];
  
  const services = [{
    icon: Target,
    title: "Estratégia Digital",
    subtitle: "Planejamento completo para posicionar sua marca no mercado digital",
    description: "Desenvolvemos estratégias personalizadas que alinham objetivos de negócio com as melhores práticas do mercado digital. Analisamos seu posicionamento atual, identificamos oportunidades e criamos um roadmap detalhado para alcançar seus objetivos de crescimento e consolidação no ambiente online."
  }, {
    icon: TrendingUp,
    title: "Otimização de Conversão",
    subtitle: "Análise e melhorias para aumentar as vendas e reduzir o abandono de carrinho",
    description: "Através de análises detalhadas do comportamento do usuário, testes A/B e otimizações contínuas, aumentamos suas taxas de conversão. Identificamos pontos de fricção na jornada de compra e implementamos melhorias que transformam visitantes em clientes fiéis, maximizando o retorno sobre o investimento."
  }, {
    icon: Store,
    title: "Marketplaces",
    subtitle: "Estratégias completas para vender nos principais marketplaces do Brasil",
    description: "Desenvolvemos estratégias especializadas para posicionar e vender seus produtos nos principais marketplaces brasileiros como Mercado Livre, Amazon, Shopee e Magazine Luiza. Otimizamos catálogos, criamos campanhas eficientes, gerenciamos reputação e implementamos processos que maximizam vendas e rentabilidade em cada canal."
  }, {
    icon: Brain,
    title: "Análise de Mercado",
    subtitle: "Inteligência competitiva e insights estratégicos para tomada de decisão",
    description: "Realizamos estudos aprofundados do seu mercado, concorrência e público-alvo. Utilizamos ferramentas avançadas de business intelligence para fornecer insights acionáveis que orientam decisões estratégicas, identificam tendências e revelam oportunidades de crescimento antes da concorrência."
  }, {
    icon: Network,
    title: "Omnichannel",
    subtitle: "Integração perfeita entre todos os canais de venda e comunicação",
    description: "Desenvolvemos estratégias omnichannel que conectam todos os pontos de contato com seus clientes de forma integrada e fluida. Sincronizamos lojas físicas, e-commerce, marketplaces, redes sociais e aplicativos para criar uma experiência unificada, permitindo que seus clientes comprem quando, onde e como preferirem, aumentando vendas e satisfação."
  }];
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      <main className="pt-32 pb-0">
        {/* Hero Section */}
        <section className="mb-20 relative">
          {/* Animated Decorative Plus Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <Plus className="absolute top-10 left-10 w-20 h-20 text-primary animate-[spin_20s_linear_infinite]" />
            <Plus className="absolute top-32 right-20 w-32 h-32 text-primary animate-[spin_25s_linear_infinite_reverse]" />
            <Plus className="absolute bottom-20 left-1/4 w-16 h-16 text-primary animate-[spin_15s_linear_infinite]" />
            <Plus className="absolute top-1/2 right-1/3 w-24 h-24 text-primary animate-[spin_30s_linear_infinite_reverse]" />
            <Plus className="absolute top-1/4 left-1/2 w-12 h-12 text-primary animate-[spin_18s_linear_infinite]" />
          </div>
          
          <div className="container mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer group">
                  <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-sm font-medium text-primary">Soluções Modulares</span>
                </div>
                
                <h1 className="text-5xl font-bold text-primary leading-tight lg:text-4xl">
                  Consultorias <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Especializadas</span>
                </h1>
                
                <div className="grid grid-cols-1 gap-4">
                  {servicesList.map((service, index) => (
                    <div 
                      key={index}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 cursor-pointer animate-fade-in relative overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-3 relative z-10">
                        <service.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors relative z-10">{service.label}</span>
                      <ArrowRight className="ml-auto w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all relative z-10" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative animate-fade-in group flex items-center justify-center" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-primary/20 group-hover:border-primary/40 transition-all duration-500 hover:scale-105 transform w-[70%]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  <div className="w-full h-full flex items-center justify-center p-12">
                    <Target className="w-full h-full text-primary/20" />
                  </div>
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
          
          <div className="container mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Plus className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                    Orientação estratégica para impulsionar o crescimento sustentável do seu e-commerce.
                  </h2>
                </div>
              </div>
              <div className="flex items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Nossos consultores especializados analisam profundamente seu negócio, identificam oportunidades de crescimento e desenvolvem estratégias personalizadas. Combinamos expertise técnica com visão de mercado para entregar soluções que geram resultados mensuráveis e transformam seu e-commerce em uma máquina de vendas.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {servicesList.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 px-5 py-3 rounded-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-110 cursor-pointer group relative overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  <service.icon className="w-4 h-4 text-primary group-hover:rotate-[360deg] transition-transform duration-500 relative z-10" />
                  <span className="text-sm font-medium relative z-10">{service.label}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="group shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105 relative overflow-hidden">
                <Link to="/contato" className="relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className="mr-2 w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-500" />
                  Quer saber mais? Fale com um especialista agora mesmo
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Details */}
        <section className="py-20" style={{ backgroundColor: '#F2F2F2' }}>
          <div className="container mx-auto px-12">
            <div className="max-w-5xl mx-auto space-y-8">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="group flex gap-8 items-start py-8 border-b border-border/30 last:border-b-0 transition-all duration-500 hover:translate-x-4 animate-fade-in relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -mx-4"></div>
                  
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-white flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:rotate-3 relative z-10 ${hoveredService === index ? 'shadow-xl shadow-primary/20' : ''}`}>
                    <service.icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" style={{ color: '#242424' }} />
                  </div>
                  
                  <div className="flex-1 pt-1 relative z-10">
                    <h3 className="text-3xl font-bold mb-4 text-black group-hover:text-primary transition-all duration-500 group-hover:translate-x-2">
                      {service.title}
                    </h3>
                    <p className="text-primary font-semibold mb-4 text-lg leading-relaxed">
                      {service.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 mb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
          
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <Plus className="absolute top-10 left-10 w-24 h-24 text-primary-foreground animate-[spin_20s_linear_infinite]" />
            <Plus className="absolute bottom-10 right-10 w-32 h-32 text-primary-foreground animate-[spin_25s_linear_infinite_reverse]" />
            <Plus className="absolute top-1/2 left-1/3 w-16 h-16 text-primary-foreground animate-[spin_15s_linear_infinite]" />
            <Plus className="absolute bottom-1/3 right-1/4 w-20 h-20 text-primary-foreground animate-[spin_18s_linear_infinite_reverse]" />
          </div>
          
          <div className="container mx-auto px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-6 flex-1">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Smile className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight mb-4">
                    Pronto para transformar seu e-commerce com consultoria especializada?
                  </h2>
                  <p className="text-primary-foreground/90 text-lg">
                    Nossa equipe de especialistas está pronta para analisar seu negócio e criar estratégias de crescimento.
                  </p>
                </div>
              </div>
              
              <Button asChild size="lg" variant="secondary" className="flex-shrink-0 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group relative overflow-hidden">
                <Link to="/contato" className="relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className="mr-2 w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-500" />
                  Converse com um especialista
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 mb-20" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="container mx-auto px-12">
            <div className="max-w-6xl mx-auto rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 animate-fade-in" style={{ backgroundColor: '#F2F2F2' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/10 animate-[spin_15s_linear_infinite]" />
              <Plus className="absolute bottom-4 left-4 w-6 h-6 text-primary/10 animate-[spin_20s_linear_infinite_reverse]" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-3 group-hover:text-primary transition-colors duration-300">
                    Newsletter
                  </h2>
                  <p className="text-black text-lg">
                    Receba insights exclusivos e as últimas novidades diretamente no seu e-mail.
                  </p>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto md:min-w-[400px]">
                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="flex-1 px-6 py-3 rounded-lg bg-white text-black border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-300 hover:shadow-md"
                  />
                  <Button 
                    size="lg" 
                    className="bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold px-8 shadow-lg hover:shadow-2xl transition-all hover:scale-110 relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10">Cadastrar</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Consulting;