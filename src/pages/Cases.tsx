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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      <section className="pt-24 pb-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
            <Breadcrumb className="mb-4 flex justify-center">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cases</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-3xl md:text-4xl font-bold">
              Cases de <span className="text-primary">Sucesso</span>
            </h1>
            
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Histórias de sucesso reais de empresas que transformaram seus negócios.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categoriesLoading ? (
                <>
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full text-sm transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-card border-border text-foreground hover:bg-primary/10 hover:border-primary"
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
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {casesLoading ? (
              <div className="grid md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-52 w-full rounded-xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : visibleCasesList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum case encontrado. Ajuste os filtros ou volte em breve!
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-5">
                  {visibleCasesList.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      to={`/cases/${caseItem.id}`}
                      className="group"
                    >
                      <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
                        {/* Header com título e tags */}
                        <div className="p-4 pb-3">
                          <h3 className="text-base md:text-lg font-medium italic text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                            {caseItem.titulo}
                          </h3>
                          
                          {/* Tags */}
                          {caseItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {caseItem.tags.slice(0, 3).map((tag) => (
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
                        <div className="relative overflow-hidden flex-1 min-h-[160px]">
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
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      size="sm"
                      className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary px-6 rounded-full"
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

      {/* Carousel de Mockups - Todos os Cases com imagem */}
      {allCases.filter(c => c.mockup_screenshot_url).length > 0 && (
        <MockupSection 
          screenshotUrls={allCases
            .filter(c => c.mockup_screenshot_url)
            .map(c => ({
              url: c.mockup_screenshot_url!,
              title: c.titulo
            }))
          }
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
