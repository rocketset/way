import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, Target, TrendingUp, Users, Zap, BarChart3, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import journeyTeam from "@/assets/journey-team.jpg";
import atacadao from "@/assets/clients/atacadao.png";
import barauna from "@/assets/clients/barauna.png";
import carretao from "@/assets/clients/carretao.png";
import cartopel from "@/assets/clients/cartopel.png";
import casatudo from "@/assets/clients/casatudo.png";
import chipart from "@/assets/clients/chipart.png";
import clubdamoda from "@/assets/clients/clubdamoda.png";
import eletropolo from "@/assets/clients/eletropolo.png";
import extrema from "@/assets/clients/extrema.png";
import kingcolchoes from "@/assets/clients/kingcolchoes.png";
import team1 from "@/assets/gallery/team-1.jpg";
import team2 from "@/assets/gallery/team-2.jpg";
import team3 from "@/assets/gallery/team-3.jpg";

const Journey = () => {
  const clients = [
    { logo: atacadao, name: "Atacadão dos Eletros" },
    { logo: barauna, name: "Baraúna" },
    { logo: carretao, name: "O Carretão" },
    { logo: cartopel, name: "Cartopel" },
    { logo: casatudo, name: "Casatudo" },
    { logo: chipart, name: "Chipart" },
    { logo: clubdamoda, name: "Club da Moda" },
    { logo: eletropolo, name: "Eletropolo" },
    { logo: extrema, name: "Extrema" },
    { logo: kingcolchoes, name: "King Colchões" }
  ];

  const teamPhotos = [team1, team2, team3];

  const stats = [
    { number: "+150", label: "Projetos entregues", icon: Target },
    { number: "+300%", label: "Crescimento médio", icon: TrendingUp },
    { number: "98%", label: "Satisfação dos clientes", icon: Users },
    { number: "24/7", label: "Suporte disponível", icon: Zap }
  ];

  const journeyPhases = [
    {
      title: "IMPLANTAÇÃO",
      icon: Target,
      description: "Estruturar a operação, integrar tecnologia e definir processos",
      color: "from-[#96CEB4]/80 to-[#96CEB4]/40",
      position: 1
    },
    {
      title: "EVOLUÇÃO",
      icon: TrendingUp,
      description: "Otimizar a conversão, solidificar processos e validar performance",
      color: "from-[#96CEB4] to-[#96CEB4]/60",
      position: 2
    },
    {
      title: "ESCALA",
      icon: Rocket,
      description: "Expandir canais, audiência e receita com dados",
      color: "from-[#7CB89D] to-[#96CEB4]",
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
      color: "bg-gradient-to-br from-[#4ECDC4]/10 to-[#4ECDC4]/5"
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
      color: "bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/5"
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
      color: "bg-gradient-to-br from-[#45B7D1]/10 to-[#45B7D1]/5"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-0">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background via-primary/5 to-background py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Jornada <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">Way</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Método exclusivo e validado, criado com base em experiências reais em e-commerces
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-[#4ECDC4] py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center text-white">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-12 h-12" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                    <div className="text-sm md:text-base opacity-90">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Photos Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Nossa Equipe em Ação
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {teamPhotos.map((photo, index) => (
                <div key={index} className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    src={photo} 
                    alt={`Equipe Way ${index + 1}`}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology Description */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
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

        {/* Journey Phases - Stairway Visual */}
        <section className="py-20 bg-muted/30 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              As 3 Fases da Jornada Way
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
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
                      <div className={`bg-gradient-to-br ${phase.color} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-black/10 h-full min-h-[420px] flex flex-col justify-between`}>
                        <div className="flex flex-col items-center">
                          <Icon className="w-16 h-16 text-black/70 mb-4" strokeWidth={1.5} />
                          
                          <h3 className="text-2xl md:text-3xl font-bold text-center mb-3 text-black">
                            {phase.title}
                          </h3>
                          
                          <p className="text-center text-black/80 text-sm leading-relaxed">
                            {phase.description}
                          </p>
                        </div>

                        {phase.levels && (
                          <div className="mt-6 space-y-2 pt-4 border-t-2 border-black/20">
                            {phase.levels.map((level, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="font-bold text-black">{level.value}</span>
                                <span className="text-xs text-black/70 uppercase tracking-wider px-2 py-1 bg-black/10 rounded">
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
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Detalhamento das Fases
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Cada fase é cuidadosamente estruturada para garantir seu sucesso
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {detailedPhases.map((phase, index) => (
                <div key={index} className={`${phase.color} rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300`}>
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
        <section className="py-20 bg-[#FF6B6B] text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Clientes que confiam na Way
            </h2>
            <p className="text-center text-white/90 mb-12 max-w-2xl mx-auto">
              Marcas que crescem conosco e transformam seus negócios digitais
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
              {clients.map((client, index) => (
                <div key={index} className="bg-white rounded-xl p-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#45B7D1] to-[#4ECDC4] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Pronto para transformar seu e-commerce?
              </h2>
              <p className="text-xl md:text-2xl text-white/90">
                Junte-se às marcas que já estão crescendo com a Jornada Way
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button 
                  size="lg"
                  className="bg-white text-[#45B7D1] hover:bg-white/90 px-10 py-7 text-lg rounded-full shadow-2xl font-bold"
                >
                  Comece sua jornada agora
                  <ArrowRight className="ml-2 w-5 h-5" />
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
                    <div key={i} className="flex flex-col items-center gap-3">
                      <Icon className="w-12 h-12" />
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
    </div>
  );
};

export default Journey;
