import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, TrendingUp, Users, ShoppingCart, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCase } from "@/hooks/useCase";
import CaseContactForm from "@/components/CaseContactForm";

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

      {/* Why Choose Section - With text and image */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center bg-card border border-border rounded-3xl p-8 lg:p-12 animate-fade-in">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                  Por que escolher a {caseData.categoria_nome || 'solução'}?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Escolha a plataforma certa para o seu negócio e acelere seu crescimento digital. 
                  Nossa solução oferece tecnologia de ponta, suporte especializado e resultados comprovados 
                  para empresas que querem se destacar no mercado.
                </p>
                <p className="text-muted-foreground">
                  Conheça a estratégia da {caseData.categoria_nome} para vender mais, logística mais 
                  eficiente e muito mais.
                </p>
              </div>
              <div className="relative animate-scale-in">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={caseData.imagem_url || '/placeholder.svg'}
                    alt="Why choose"
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid - 4 Cards */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Benefit 1 */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">ROI e economia comprovados</h3>
                <p className="text-muted-foreground">
                  Empresas que migram para a plataforma conseguem até 51% de economia em até 12 meses.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Processos escolha dos Clientes</h3>
                <p className="text-muted-foreground">
                  A plataforma é mais transparente, flexível e intuitiva do que as ferramentas dos concorrentes.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Líder em Comércio B2C</h3>
                <p className="text-muted-foreground">
                  A solução top #1 em 20 de 20 casos de uso em comércio digital para lojas online.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 hover-scale animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Destaque em B2B Digital</h3>
                <p className="text-muted-foreground">
                  A ferramenta tem capacidades muito boas e também foi reconhecida em B2B no mercado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Ideal Section - With image on right */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center bg-card border border-border rounded-3xl p-8 lg:p-12 animate-fade-in">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                  {caseData.categoria_nome} é a plataforma ideal para diversos perfis de negócios
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Com a plataforma certa, você oferece uma formatura personalizada aos seus clientes. 
                  Hoje, lojas de diferentes tamanhos já experimentam esse software moderno para organizar 
                  negócios online complexos.
                </p>
                <div className="pt-4">
                  <Link to="/contact">
                    <Button size="lg" className="rounded-full group">
                      Falar com especialista
                      <ArrowLeft className="w-5 h-5 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative animate-scale-in lg:order-first">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={caseData.imagem_url || '/placeholder.svg'}
                    alt="Platform ideal"
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Contact Form Section */}
      <CaseContactForm />

      <Footer />
    </div>
  );
};

export default CaseDetail;
