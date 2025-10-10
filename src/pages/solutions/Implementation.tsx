import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Rocket, Zap } from "lucide-react";

const Implementation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Rocket className="w-4 h-4" />
              Implantação e Desenvolvimento
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent">
              Implantação e Desenvolvimento
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transformamos sua visão em realidade com soluções completas de e-commerce
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Code className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Desenvolvimento Custom</h3>
              <p className="text-muted-foreground">
                Soluções personalizadas para atender as necessidades específicas do seu negócio
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Rocket className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Implantação Rápida</h3>
              <p className="text-muted-foreground">
                Processos otimizados para colocar sua loja no ar com agilidade e segurança
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Integração Completa</h3>
              <p className="text-muted-foreground">
                Conectamos sua loja com os principais sistemas e plataformas do mercado
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Implementation;
