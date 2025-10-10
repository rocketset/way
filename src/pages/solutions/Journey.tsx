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

  const journeySteps = [
    {
      number: "01",
      title: "Diagnóstico",
      description: "Análise completa do seu negócio, identificando oportunidades e pontos de melhoria",
      color: "from-[#FF6B6B] to-[#FF8E8E]"
    },
    {
      number: "02",
      title: "Planejamento",
      description: "Estratégia personalizada com metas claras e KPIs específicos para seu estágio",
      color: "from-[#4ECDC4] to-[#6FE0D8]"
    },
    {
      number: "03",
      title: "Implementação",
      description: "Execução técnica com as melhores práticas, garantindo qualidade e performance",
      color: "from-[#45B7D1] to-[#5CC8E0]"
    },
    {
      number: "04",
      title: "Otimização",
      description: "Análise contínua de dados para melhorar conversão e experiência do usuário",
      color: "from-[#96CEB4] to-[#A8D8BF]"
    },
    {
      number: "05",
      title: "Escala",
      description: "Expansão estruturada do seu e-commerce, preparado para crescer sem limites",
      color: "from-[#FFEAA7] to-[#FFF0BA]"
    },
    {
      number: "06",
      title: "Consolidação",
      description: "Evolução completa do negócio digital com resultados sustentáveis e mensuráveis",
      color: "from-[#DDA0DD] to-[#E6B8E6]"
    }
  ];

  const phases = [
    {
      title: "Implantação",
      subtitle: "Fundação sólida para seu e-commerce",
      features: [
        "Presença Omnichannel",
        "Suporte que acompanha",
        "Personalização que escala",
        "Segurança e confiança",
        "Alta performance",
        "Integração sem atrito"
      ],
      color: "bg-gradient-to-br from-[#4ECDC4]/10 to-[#4ECDC4]/5"
    },
    {
      title: "Evolução",
      subtitle: "Otimização contínua dos resultados",
      features: [
        "Otimização da plataforma de e-commerce",
        "Reestruturação de integrações com ERP, CRM, logística",
        "Ajustes no mix de produtos e precificação",
        "Melhoria da experiência de compra"
      ],
      color: "bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/5"
    },
    {
      title: "Escala",
      subtitle: "Crescimento exponencial sustentável",
      levels: [
        { value: "R$ 50 mil", stage: "Iniciante" },
        { value: "R$ 200 mil", stage: "Iniciante" },
        { value: "R$ 500 mil", stage: "Profissional" },
        { value: "R$ 1 milhão", stage: "Profissional" },
        { value: "R$ 5 milhões+", stage: "Especialista" }
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

        {/* Journey Steps - 6 Steps */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              As 6 Etapas da Jornada
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Um caminho claro e estruturado para transformar seu e-commerce
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {journeySteps.map((step, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`}></div>
                  <div className="relative bg-card border border-border hover:border-transparent rounded-2xl p-8 transition-all duration-300 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`text-6xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Phases Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              As 3 Fases da Jornada Way
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Cada fase é cuidadosamente estruturada para garantir seu sucesso
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {phases.map((phase, index) => (
                <div key={index} className={`${phase.color} rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                  </div>
                  
                  {phase.features && (
                    <div className="space-y-3">
                      {phase.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {phase.levels && (
                    <div className="space-y-3">
                      {phase.levels.map((level, i) => (
                        <div key={i} className="bg-background/50 p-4 rounded-lg">
                          <div className="font-bold text-lg text-primary mb-1">{level.value}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">
                            {level.stage}
                          </div>
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
