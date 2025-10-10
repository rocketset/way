import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Compass, Map, Route } from "lucide-react";

const Journey = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Compass className="w-4 h-4" />
              Jornada Way
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent">
              Jornada Way
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma metodologia completa para transformar seu e-commerce
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Map className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Diagnóstico Completo</h3>
              <p className="text-muted-foreground">
                Análise 360° do seu negócio para identificar oportunidades e desafios
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Route className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Roadmap Personalizado</h3>
              <p className="text-muted-foreground">
                Plano de ação estruturado com metas e prazos definidos
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Compass className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Acompanhamento Contínuo</h3>
              <p className="text-muted-foreground">
                Suporte e mentoria em todas as etapas da transformação
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Journey;
