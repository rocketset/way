import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientsCarousel from "@/components/ClientsCarousel";
import CtaResultsSection from "@/components/CtaResultsSection";
import MockupSection from "@/components/MockupSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCases } from "@/hooks/useCases";
import { useCaseCategories } from "@/hooks/useCaseCategories";

const Cases = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [visibleCases, setVisibleCases] = useState(4);

  const { data: categoriesData, isLoading: categoriesLoading } = useCaseCategories();
  const { data: allCasesData } = useCases("", "Todos"); // Buscar todos para calcular categorias
  const { data: casesData, isLoading: casesLoading } = useCases("", selectedCategory);

  // Combinar todos os cases para calcular categorias
  const allCasesForCategories = [...(allCasesData?.featured || []), ...(allCasesData?.regular || [])];
  
  // Calcular categorias que realmente têm cases
  const categoriesWithCases = categoriesData?.filter(category => {
    return allCasesForCategories.some(caseItem => caseItem.categoria_nome === category.nome);
  }) || [];

  // Adicionar "Todos" apenas se houver cases
  const categories = allCasesForCategories.length > 0 
    ? ["Todos", ...categoriesWithCases.map(c => c.nome)]
    : [];

  // Cases filtrados para exibição
  const allCases = [...(casesData?.featured || []), ...(casesData?.regular || [])];
  const visibleCasesList = allCases.slice(0, visibleCases);
  const hasMoreCases = allCases.length > visibleCases;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCases(4); // Reset para mostrar os primeiros 4 cases
  };

  const handleLoadMore = () => {
    setVisibleCases((prev) => prev + 4);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-block">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 inline-block mr-2" />
                Histórias de sucesso reais
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold">
              Cases de <span className="text-primary">Sucesso</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça empresas que transformaram seus negócios com soluções digitais 
              e alcançaram resultados extraordinários.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categoriesLoading ? (
                <>
                  <Skeleton className="h-10 w-24 rounded-full" />
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`rounded-full transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                        : "bg-card border-border text-foreground hover:bg-primary/10 hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {category}
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cases Grid 2x2 */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {casesLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : visibleCasesList.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhum case encontrado. Ajuste os filtros ou volte em breve para novos cases!
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {visibleCasesList.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      to={`/cases/${caseItem.id}`}
                      className="group"
                    >
                      <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 h-full flex flex-col">
                        {/* Header com título e tags */}
                        <div className="p-4 pb-3">
                          <h3 className="text-lg md:text-xl font-medium italic text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                            {caseItem.titulo}
                          </h3>
                          
                          {/* Tags */}
                          {caseItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {caseItem.tags.slice(0, 4).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-background text-foreground border border-border text-xs px-2 py-0.5 rounded-md hover:bg-background/80 transition-colors duration-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Image com logo sobreposto */}
                        <div className="relative overflow-hidden flex-1 min-h-[190px]">
                          <img
                            src={caseItem.imagem_url || '/placeholder.svg'}
                            alt={caseItem.titulo}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Overlay escuro sutil */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMoreCases && (
                  <div className="text-center mt-12">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary px-8 py-6 text-lg rounded-full"
                    >
                      Ver mais cases
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Clients Carousel */}
      <ClientsCarousel />

      {/* MacBook Mockup Section - Featured Case */}
      {casesData?.featured?.[0]?.mockup_screenshot_url && (
        <MockupSection 
          screenshotUrl={casesData.featured[0].mockup_screenshot_url}
          title="Veja nossos projetos em ação"
          description="Conheça como transformamos ideias em soluções digitais de sucesso"
        />
      )}

      {/* CTA Section */}
      <CtaResultsSection />

      <Footer />
    </div>
  );
};

export default Cases;
