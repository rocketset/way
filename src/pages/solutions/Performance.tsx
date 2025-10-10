import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarChart3, Megaphone, Search } from "lucide-react";

const Performance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BarChart3 className="w-4 h-4" />
              Performance & Marketing
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent">
              Performance & Marketing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Estratégias data-driven para maximizar seus resultados
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Megaphone className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Marketing Digital</h3>
              <p className="text-muted-foreground">
                Campanhas integradas em Google Ads, Meta Ads e principais canais digitais
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <Search className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">SEO & Tráfego Orgânico</h3>
              <p className="text-muted-foreground">
                Otimização para mecanismos de busca e estratégias de conteúdo
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300">
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Analytics & Performance</h3>
              <p className="text-muted-foreground">
                Análise de dados e otimização contínua para melhor ROI
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Performance;
