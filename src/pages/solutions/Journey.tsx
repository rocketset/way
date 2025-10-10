import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import journeyTeam from "@/assets/journey-team.jpg";

const Journey = () => {
  const steps = [
    "diagnosticar",
    "planejar", 
    "implementar",
    "otimizar",
    "escalar",
    "transformar"
  ];

  const benefits = [
    {
      number: "1",
      title: "Planejamento Estratégico Detalhado",
      description: "Através de um planejamento estratégico detalhado, identificamos oportunidades e traçamos o caminho ideal para o crescimento do seu e-commerce."
    },
    {
      number: "2",
      title: "Estratégias Personalizadas",
      description: "Criação e execução de estratégias personalizadas, adaptadas ao estágio de maturidade do seu negócio, garantindo ações no momento certo."
    },
    {
      number: "3",
      title: "Definição de Metas Claras",
      description: "Estabelecimento de metas claras e KPIs específicos que orientam cada ação e permitem mensurar o progresso de forma objetiva."
    },
    {
      number: "4",
      title: "Automações Inteligentes",
      description: "Implementação de automações inteligentes que otimizam processos, aumentam a eficiência e liberam tempo para focar no estratégico."
    },
    {
      number: "5",
      title: "Otimização do Funil de Vendas",
      description: "Análise contínua e otimização do funil de vendas, identificando gargalos e oportunidades para maximizar conversões."
    },
    {
      number: "6",
      title: "Crescimento Sustentável",
      description: "Promovemos o crescimento do seu e-commerce a curto, médio e longo prazo, com resultados consistentes e escaláveis."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-background via-primary/5 to-background py-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-light mb-6">
                A Way é <span className="font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">Digital</span>
              </h1>
            </div>

            {/* Flow Steps */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-2 md:gap-4">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative bg-card border border-primary/30 hover:border-primary px-4 md:px-8 py-2 md:py-3 rounded-full transition-all hover:scale-105">
                      <span className="text-sm md:text-base font-medium text-foreground">{step}</span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Hero Content with Image */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl"></div>
              <img 
                src={journeyTeam}
                alt="Equipe Way E-commerce"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Jornada Way: metodologia exclusiva e validada
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Método exclusivo e validado, criado com base em experiências reais em e-commerces. 
                Oferecemos um caminho claro para profissionalizar sua operação, melhorar resultados 
                e construir marcas sólidas no ambiente digital.
              </p>
              <Button className="group px-8 py-6 text-lg rounded-full">
                Conhecer a metodologia
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Highlighted Box */}
        <div className="container mx-auto px-4 mb-24">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-l-4 border-primary rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Acelere o crescimento do seu e-commerce
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nossa metodologia é projetada para acelerar o crescimento do seu e-commerce, 
              adaptando-se ao estágio de maturidade em que ele se encontra. Cada ação é executada 
              no momento ideal, garantindo eficácia e resultados. Através de um planejamento estratégico 
              detalhado, criação e execução de estratégias personalizadas, definição de metas claras, 
              automações inteligentes e otimização do funil de vendas, conseguimos promover o crescimento 
              do seu e-commerce a curto, médio e longo prazo.
            </p>
          </div>
        </div>

        {/* Benefits Section - Diagonal Staggered Layout */}
        <div className="container mx-auto px-4 mb-24">
          <div className="space-y-6">
            {benefits.map((benefit, index) => {
              const isEven = index % 2 === 0;
              const offsetPercent = Math.floor(index / 2) * 8;
              
              return (
                <div
                  key={benefit.number}
                  className={`flex ${isEven ? 'justify-start' : 'justify-end'} animate-fade-in`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    marginLeft: isEven ? `${offsetPercent}%` : '0',
                    marginRight: !isEven ? `${offsetPercent}%` : '0',
                  }}
                >
                  <div className="group relative max-w-2xl w-full">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                    
                    {/* Card */}
                    <div className="relative bg-card border border-border hover:border-primary/50 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                      <div className="flex items-start gap-6">
                        {/* Number */}
                        <div className="flex-shrink-0">
                          <div className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-primary/30 to-primary/10 bg-clip-text text-transparent">
                            {benefit.number}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pt-2">
                          <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                            {benefit.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90 rounded-3xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-16">
              {/* Text Content */}
              <div className="text-white space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Seja nosso próximo case de sucesso!
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Com um simples clique, transforme sua marca e alcance o sucesso digital que você sempre desejou.
                </p>
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-xl"
                >
                  Fale com nossos especialistas
                </Button>
              </div>

              {/* Decorative element */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 space-y-4">
                    {[
                      "Diagnóstico personalizado",
                      "Estratégia sob medida",
                      "Resultados mensuráveis"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-white">
                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Journey;
