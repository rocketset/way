import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCase } from "@/hooks/useCase";

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: caseData, isLoading, error } = useCase(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Case não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O case que você procura não existe ou não está mais disponível.
          </p>
          <Link to="/cases">
            <Button>Voltar para Cases</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-32 pb-8">
        <Link to="/cases">
          <Button variant="ghost" className="group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Voltar para Cases
          </Button>
        </Link>
      </div>

      {/* Hero Section - Following reference image style */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-gradient-to-br from-card via-card to-card/80 rounded-3xl overflow-hidden border border-border">
              <div className="absolute inset-0 bg-[url('/hero-dots-bg.png')] opacity-5" />
              
              <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-16">
                {/* Left Content */}
                <div className="flex-1 space-y-6 animate-fade-in">
                  <div className="inline-block">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                      <Sparkles className="w-4 h-4 inline-block mr-2" />
                      {caseData.categoria_nome || 'Case de Sucesso'}
                    </Badge>
                  </div>

                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    {caseData.titulo}
                  </h1>

                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    {caseData.descricao}
                  </p>

                  {/* Tags */}
                  {caseData.tags && caseData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {caseData.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-6">
                    <Link to="/contact">
                      <Button 
                        size="lg" 
                        className="group hover-scale rounded-full px-8 text-lg shadow-lg shadow-primary/20"
                      >
                        Falar com especialista
                        <ArrowLeft className="w-5 h-5 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Image with animated decorations */}
                <div className="flex-1 relative animate-scale-in">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    {/* Animated gradient blobs */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-500/30 to-transparent rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-500/30 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    
                    <img
                      src={caseData.imagem_url || '/placeholder.svg'}
                      alt={caseData.titulo}
                      className="relative z-10 w-full h-auto rounded-2xl"
                    />
                  </div>

                  {/* Floating decoration elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Challenge Section */}
            <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold mb-4 text-primary">O Desafio</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {caseData.descricao}
              </p>
            </div>

            {/* Solution Section */}
            <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-3xl font-bold mb-4 text-primary">A Solução</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Implementamos uma estratégia completa de transformação digital, focando em 
                otimização de processos, experiência do usuário e resultados mensuráveis.
              </p>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-3xl font-bold mb-6 text-primary">Resultados Alcançados</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">+150%</div>
                  <p className="text-muted-foreground">Crescimento em vendas</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">+200%</div>
                  <p className="text-muted-foreground">Aumento em conversão</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">-40%</div>
                  <p className="text-muted-foreground">Redução de custos</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-6 pt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <h3 className="text-2xl font-bold">
                Quer alcançar resultados como este?
              </h3>
              <p className="text-muted-foreground">
                Entre em contato e descubra como podemos transformar seu negócio.
              </p>
              <Link to="/contact">
                <Button size="lg" className="rounded-full px-8">
                  Falar com especialista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseDetail;
