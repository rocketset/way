import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Target, TrendingUp, Users, Zap, BarChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      title: "Planejamento Estratégico",
      description: "Análise completa do seu e-commerce, identificando oportunidades e traçando um plano de ação personalizado para o crescimento sustentável."
    },
    {
      number: "2",
      title: "Estratégias Personalizadas",
      description: "Criação e execução de estratégias sob medida, alinhadas ao estágio de maturidade do seu negócio e aos objetivos estabelecidos."
    },
    {
      number: "3",
      title: "Metas Claras e Alcançáveis",
      description: "Definição de KPIs específicos e metas mensuráveis, garantindo que cada ação contribua diretamente para os resultados."
    },
    {
      number: "4",
      title: "Automações Inteligentes",
      description: "Implementação de processos automatizados que aumentam a eficiência operacional e liberam tempo para decisões estratégicas."
    },
    {
      number: "5",
      title: "Otimização do Funil",
      description: "Análise e melhoria contínua de cada etapa do funil de vendas, maximizando conversões e o valor do cliente."
    },
    {
      number: "6",
      title: "Crescimento Escalável",
      description: "Estruturação de processos e sistemas que permitem o crescimento sustentável a curto, médio e longo prazo."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 text-foreground">
              A Way é <span className="font-bold text-primary">Digital</span>
            </h1>
          </div>

          {/* Flow Steps */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="bg-card border-2 border-primary px-6 py-3 rounded-full">
                  <span className="text-foreground font-medium">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Section */}
        <div className="container mx-auto px-4 mb-24">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Jornada Way: Metodologia exclusiva e validada
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Método exclusivo e validado, criado com base em experiências reais em e-commerces. 
              Oferecemos um caminho claro para profissionalizar sua operação, melhorar resultados 
              e construir marcas sólidas no ambiente digital.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nossa metodologia é projetada para acelerar o crescimento do seu e-commerce, 
              adaptando-se ao estágio de maturidade em que ele se encontra. Cada ação é executada 
              no momento ideal, garantindo eficácia e resultados consistentes.
            </p>
          </div>
        </div>

        {/* Benefits Section - Diagonal Layout */}
        <div className="container mx-auto px-4 mb-24">
          <div className="relative">
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.number}
                  className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  style={{
                    marginLeft: index % 2 === 0 ? `${index * 5}%` : '0',
                    marginRight: index % 2 === 1 ? `${index * 5}%` : '0',
                  }}
                >
                  <div className="bg-card border-2 border-primary/20 hover:border-primary rounded-2xl p-8 max-w-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <div className="flex items-start gap-6">
                      <div className="text-6xl font-bold text-primary/20">
                        {benefit.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-foreground">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
              Seja nosso próximo case de sucesso!
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Com um simples clique, transforme sua marca e alcance o sucesso digital que você sempre desejou
            </p>
            <Button 
              size="lg"
              className="bg-card text-primary hover:bg-card/90 px-8 py-6 text-lg rounded-full"
            >
              Ver cases de sucesso
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Journey;
