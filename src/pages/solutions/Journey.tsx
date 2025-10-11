import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientsCarousel from "@/components/ClientsCarousel";
import { ArrowRight, CheckCircle2, Target, TrendingUp, Users, Zap, BarChart3, Rocket, DollarSign, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import brazilFlag from "@/assets/brazil-flag.png";
import team1 from "@/assets/gallery/team-1.jpg";
import team2 from "@/assets/gallery/team-2.jpg";
import team3 from "@/assets/gallery/team-3.jpg";

const Journey = () => {
  const teamPhotos = [team1, team2, team3];

  const stats = [
    { number: "190", label: "Lojas implantadas" },
    { number: "1 ano", label: "com soluções de ponta a ponta" },
    { number: "flag", label: "Atendemos todo o Brasil", isFlag: true },
    { number: "700", label: "Clientes atendidos" }
  ];

  const journeyPhases = [
    {
      title: "IMPLANTAÇÃO",
      icon: Target,
      description: "Estruturar a operação, integrar tecnologia e definir processos",
      color: "from-primary/5 to-transparent",
      position: 1
    },
    {
      title: "EVOLUÇÃO",
      icon: TrendingUp,
      description: "Otimizar a conversão, solidificar processos e validar performance",
      color: "from-primary/10 to-transparent",
      position: 2
    },
    {
      title: "ESCALA",
      icon: Rocket,
      description: "Expandir canais, audiência e receita com dados",
      color: "from-primary/15 to-transparent",
      position: 3,
      levels: [
        { value: "R$ 50 mil", stage: "Iniciante" },
        { value: "R$ 200 mil", stage: "Iniciante" },
        { value: "R$ 500 mil", stage: "Profissional" },
        { value: "R$ 1 milhão", stage: "Profissional" },
        { value: "R$ 5 milhões+", stage: "Especialista" }
      ]
    }
  ];

  const detailedPhases = [
    {
      title: "Implantação",
      subtitle: "Fase de estruturação completa da operação digital, garantindo base sólida, processos claros e tecnologia integrada",
      items: [
        {
          title: "Diagnóstico e Planejamento Estratégico",
          objective: "Entender o cenário atual e definir a direção do projeto"
        },
        {
          title: "Estruturação de Produto e Catálogo",
          objective: "Garantir base sólida de dados e atributos"
        },
        {
          title: "Tecnologia e Integrações",
          objective: "Garantir infraestrutura estável e escalável"
        },
        {
          title: "Operação e Processos",
          objective: "Estruturar os processos que sustentam a operação diária do e-commerce"
        },
        {
          title: "Branding, Conteúdo e Comunicação",
          objective: "Fortalecer o posicionamento da marca e construir uma comunicação coerente e atrativa"
        },
        {
          title: "Go-to-Market (Lançamento)",
          objective: "Validar o funcionamento da operação e iniciar o processo de vendas com segurança e consistência"
        }
      ],
      color: "bg-gradient-to-br from-primary/5 to-transparent"
    },
    {
      title: "Evolução",
      subtitle: "Fase de aperfeiçoamento contínuo da operação — onde se valida performance, otimiza conversão e solidifica os processos",
      items: [
        {
          title: "Performance e Métricas",
          objective: "Analisar dados e otimizar a jornada de compra para maximizar resultados"
        },
        {
          title: "Processos e Automação",
          objective: "Garantir eficiência e previsibilidade através da automação operacional e comercial"
        },
        {
          title: "Estratégia Comercial e Marketing",
          objective: "Aprimorar as campanhas e a comunicação com foco em aumento de conversão"
        },
        {
          title: "Sustentação Tecnológica",
          objective: "Manter estabilidade e evolução da infraestrutura digital"
        }
      ],
      color: "bg-gradient-to-br from-primary/10 to-transparent"
    },
    {
      title: "Escala",
      subtitle: "Fase de crescimento e consolidação — expandindo canais, audiência e receita com previsibilidade e dados",
      levels: [
        { 
          value: "R$ 50 mil/mês", 
          stage: "Iniciante",
          focus: "Validação de produto e canal principal. Ajuste de pricing e logística."
        },
        { 
          value: "R$ 200 mil/mês", 
          stage: "Iniciante",
          focus: "Formação de time interno e estruturação de performance contínua."
        },
        { 
          value: "R$ 500 mil/mês", 
          stage: "Profissional",
          focus: "Otimização de margens, escalonamento via mídia e CRM."
        },
        { 
          value: "R$ 1 milhão/mês", 
          stage: "Profissional",
          focus: "Expansão para marketplaces e consolidação omnichannel."
        },
        { 
          value: "R$ 5 milhões+/mês", 
          stage: "Especialista",
          focus: "Escala nacional, gestão data-driven e diversificação de canais."
        }
      ],
      color: "bg-gradient-to-br from-primary/15 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 plus-pattern opacity-30 pointer-events-none" />
      
      {/* Floating Growth Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => {
          const icons = ['+', '$', '▲'];
          const icon = icons[i % icons.length];
          return (
            <div
              key={`growth-${i}`}
              className="absolute text-primary/10 font-bold"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 50 + 30}px`,
                animation: `float ${10 + Math.random() * 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>

      <Header />
      
      <main className="pt-24 pb-0 relative z-10">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background via-primary/5 to-background py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Growth Symbols */}
          <div className="absolute inset-0 opacity-5">
            <DollarSign className="absolute top-20 right-1/4 w-32 h-32 animate-pulse" />
            <Plus className="absolute bottom-20 left-1/4 w-40 h-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Activity className="absolute top-1/2 right-1/3 w-36 h-36 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              {/* Method Tag */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary/30 bg-primary/10 mb-8 animate-fade-in hover-scale">
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">Way.journey - Método exclusivo</span>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                <Rocket className="w-10 h-10 md:w-12 md:h-12 text-primary flex-shrink-0" />
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold">
                  Jornada <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Way</span>
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Método exclusivo e validado, criado com base em experiências reais em e-commerces
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-500 hover-scale cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Plus icon decorations */}
                  <div className="absolute -top-3 -left-3 text-primary text-2xl opacity-0 group-hover:opacity-100 plus-rotate">+</div>
                  <div className="absolute -bottom-3 -right-3 text-primary text-2xl opacity-0 group-hover:opacity-100 plus-rotate">+</div>
                  
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-125 transition-transform duration-500">
                      {stat.isFlag ? (
                        <img 
                          src={brazilFlag} 
                          alt="Bandeira do Brasil" 
                          className="w-20 h-14 mx-auto object-cover rounded-md" 
                        />
                      ) : (
                        stat.number
                      )}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Photos Section - Carousel */}
        <section className="py-16 bg-muted/30 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
              Nossa Equipe em Ação
            </h2>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling Images */}
              <div className="flex gap-6 animate-scroll-team">
                {[...teamPhotos, ...teamPhotos, ...teamPhotos].map((photo, index) => (
                  <div key={index} className="relative group flex-shrink-0 w-[400px] overflow-hidden rounded-2xl shadow-lg hover-scale">
                    <img 
                      src={photo} 
                      alt={`Equipe Way ${(index % teamPhotos.length) + 1}`}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                        <Plus className="w-8 h-8 text-primary" />
                        <DollarSign className="w-8 h-8 text-primary" />
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Description */}
        <section className="py-20 bg-background relative">
          <div className="absolute inset-0 opacity-5">
            <TrendingUp className="absolute top-10 left-10 w-40 h-40 animate-pulse" />
            <DollarSign className="absolute bottom-10 right-10 w-40 h-40 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="flex justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse" style={{ animationDelay: '0.3s' }}>
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse" style={{ animationDelay: '0.6s' }}>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                Acelere o crescimento do seu e-commerce
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa metodologia é projetada para acelerar o crescimento do seu e-commerce, 
                adaptando-se ao estágio de maturidade em que ele se encontra. Cada ação é executada 
                no momento ideal, garantindo eficácia e resultados.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Através de um planejamento estratégico detalhado, criação e execução de estratégias 
                personalizadas, definição de metas claras, automações inteligentes e otimização do 
                funil de vendas, conseguimos promover o crescimento do seu e-commerce a curto, médio 
                e longo prazo.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Button Before 3 Phases */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-center animate-fade-in">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-8 text-lg rounded-full shadow-2xl font-bold hover-scale group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Plus className="mr-3 w-6 h-6 group-hover:rotate-[360deg] transition-transform duration-500" />
                QUERO APLICAR A JORNADA NA MINHA EMPRESA
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Journey Phases - Stairway Visual */}
        <section className="py-20 overflow-hidden relative" style={{ backgroundColor: '#ECECEC' }}>
          <div className="absolute inset-0 opacity-5">
            {[...Array(8)].map((_, i) => (
              <TrendingUp key={i} className="absolute w-24 h-24" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }} />
            ))}
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in text-black">
              As 3 Fases da Jornada Way
            </h2>
            <p className="text-center text-black/70 mb-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Um caminho progressivo e estruturado para o crescimento sustentável
            </p>
            
            <div className="relative max-w-6xl mx-auto">
              {/* Growth Line */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block">
                <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
                  <path 
                    d="M 100 450 L 400 300 L 700 150" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none"
                    className="text-primary"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="currentColor" className="text-primary" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Phase Cards */}
              <div className="grid md:grid-cols-3 gap-6 relative">
                {journeyPhases.map((phase, index) => {
                  const Icon = phase.icon;
                  return (
                    <div 
                      key={index} 
                      className="relative"
                      style={{ 
                        marginTop: `${(journeyPhases.length - 1 - index) * 80}px`,
                      }}
                    >
                      <div className={`bg-gradient-to-br ${phase.color} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-border h-full min-h-[320px] flex flex-col justify-between animate-fade-in hover-scale`} style={{ animationDelay: `${index * 0.2}s`, backgroundColor: '#1A1A1A' }}>
                        <div className="flex flex-col items-center">
                          <Icon className="w-12 h-12 text-primary mb-3" strokeWidth={1.5} />
                          
                          <h3 className="text-xl md:text-2xl font-bold text-center mb-2 text-white">
                            {phase.title}
                          </h3>
                          
                          <p className="text-center text-white/70 text-xs leading-relaxed">
                            {phase.description}
                          </p>
                        </div>

                        {phase.levels && (
                          <div className="mt-4 space-y-1.5 pt-3 border-t-2 border-white/20">
                            {phase.levels.map((level, i) => (
                              <div key={i} className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white">{level.value}</span>
                                <span className="text-[10px] text-white/70 uppercase tracking-wider px-2 py-0.5 bg-white/10 rounded">
                                  {level.stage}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed 3 Phases Section */}
        <section className="py-20 bg-background relative">
          <div className="absolute inset-0 opacity-5">
            <Activity className="absolute top-20 left-1/4 w-32 h-32 animate-pulse" />
            <DollarSign className="absolute bottom-20 right-1/4 w-32 h-32 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in">
              Detalhamento das Fases
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Cada fase é cuidadosamente estruturada para garantir seu sucesso
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {detailedPhases.map((phase, index) => (
                <div key={index} className={`${phase.color} rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300 animate-fade-in hover-scale`} style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                  </div>
                  
                  {phase.items && (
                    <div className="space-y-4">
                      {phase.items.map((item, i) => (
                        <div key={i} className="p-4 bg-background/50 rounded-lg">
                          <div className="flex items-start gap-3 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <h4 className="text-sm font-semibold leading-relaxed">{item.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground pl-8">
                            Objetivo: {item.objective}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {phase.levels && (
                    <div className="space-y-3">
                      {phase.levels.map((level, i) => (
                        <div key={i} className="bg-background/50 p-4 rounded-lg space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-bold text-base text-primary">{level.value}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider px-2 py-1 bg-primary/10 rounded">
                              {level.stage}
                            </div>
                          </div>
                          {level.focus && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {level.focus}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in">
              Clientes que confiam na Way
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Marcas que crescem conosco e transformam seus negócios digitais
            </p>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ClientsCarousel />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/20 to-primary/10 text-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <Plus key={i} className="absolute w-24 h-24" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }} />
            ))}
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Pronto para transformar seu e-commerce?
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Junte-se às marcas que já estão crescendo com a Jornada Way
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-lg rounded-full shadow-2xl font-bold hover-scale group"
                >
                  Comece sua jornada agora
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              <div className="pt-12 grid md:grid-cols-3 gap-8">
                {[
                  { icon: Rocket, text: "Implementação rápida" },
                  { icon: BarChart3, text: "Resultados mensuráveis" },
                  { icon: Users, text: "Suporte dedicado" }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex flex-col items-center gap-3 animate-fade-in hover-scale" style={{ animationDelay: `${i * 0.15}s` }}>
                      <div className="relative">
                        <Icon className="w-12 h-12 text-primary" />
                        <Plus className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
                      </div>
                      <span className="text-lg font-medium">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }
        
        .plus-rotate {
          animation: rotate 10s linear infinite;
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes scroll-team {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-400px * 3 - 24px * 3));
          }
        }

        .animate-scroll-team {
          animation: scroll-team 30s linear infinite;
          display: flex;
          width: max-content;
        }

        .animate-scroll-team:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-team {
            animation-duration: 60s;
          }
        }
      `}</style>
    </div>
  );
};

export default Journey;
