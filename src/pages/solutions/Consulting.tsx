import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, TrendingUp, Users } from "lucide-react";

const Consulting = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target className="w-4 h-4" />
              Consultorias
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent">
              Consultorias Especializadas
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Orientação estratégica para impulsionar o crescimento do seu e-commerce
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Estratégia Digital</h3>
              <p className="text-muted-foreground">
                Planejamento completo para posicionar sua marca no mercado digital
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Otimização de Conversão</h3>
              <p className="text-muted-foreground">
                Análise e melhorias para aumentar as vendas e reduzir o abandono de carrinho
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Experiência do Cliente</h3>
              <p className="text-muted-foreground">
                Melhore a jornada de compra e fidelize seus clientes
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Consulting;
