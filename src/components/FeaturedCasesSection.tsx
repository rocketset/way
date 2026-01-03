import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface CaseBenefit {
  titulo: string;
  descricao: string;
  icon: string;
}

interface FeaturedCase {
  id: string;
  titulo: string;
  descricao: string;
  resumo: string | null;
  imagem_principal: string | null;
  mockup_screenshot_url: string | null;
  logo_url: string | null;
  subtitulo: string | null;
  tags: string[];
  benefits: CaseBenefit[];
}

const FeaturedCasesSection = () => {
  const [cases, setCases] = useState<FeaturedCase[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCases();
  }, []);

  const fetchFeaturedCases = async () => {
    try {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          id,
          titulo,
          descricao,
          mockup_screenshot_url,
          case_content_blocks (block_type, content),
          case_tags (tag_id, tags!inner(nome))
        `)
        .eq("publicado", true)
        .eq("is_featured", true)
        .order("ordem", { ascending: true })
        .limit(10);

      if (error) throw error;

      const mapped = (data || []).map((c: any) => {
        const heroBlock = c.case_content_blocks?.find(
          (b: any) => b.block_type === "hero"
        );
        const benefitsBlock = c.case_content_blocks?.find(
          (b: any) => b.block_type === "benefits"
        );

        return {
          id: c.id,
          titulo: heroBlock?.content?.titulo || c.titulo,
          descricao: c.descricao,
          resumo: heroBlock?.content?.resumo || null,
          imagem_principal: heroBlock?.content?.imagem_principal || null,
          mockup_screenshot_url: c.mockup_screenshot_url || null,
          logo_url: heroBlock?.content?.logo_url || null,
          subtitulo: heroBlock?.content?.subtitulo || null,
          tags: c.case_tags?.map((ct: any) => ct.tags.nome) || [],
          benefits: benefitsBlock?.content?.benefits || [],
        } as FeaturedCase;
      });

      setCases(mapped);
    } catch (error) {
      console.error("Error fetching featured cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCase = cases[selectedIndex];

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-12">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="flex gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-32" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (cases.length === 0) {
    return null;
  }

  return (
    <section id="cases" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-primary/10 text-6xl font-serif">
        ✦
      </div>

      <div className="container mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
              CASES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Cases em destaque
            </h2>
            <p className="text-muted-foreground mt-2">
              Cada um com um desafio único e uma solução sob medida.
            </p>
          </div>
          <Link
            to="/cases"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Ver todos os cases
          </Link>
        </div>

        {/* Client Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-10 pb-4 border-b border-border">
          {cases.map((caseItem, index) => (
            <button
              key={caseItem.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex items-center justify-center h-16 px-2 rounded-md transition-all duration-300 border ${
                selectedIndex === index
                  ? "border-primary bg-background shadow-md"
                  : "border-transparent bg-muted/30 hover:bg-muted/50"
              }`}
            >
              {caseItem.logo_url ? (
                <img
                  src={caseItem.logo_url}
                  alt={caseItem.titulo}
                  className={`max-h-12 w-auto object-contain transition-all duration-300 ${
                    selectedIndex === index
                      ? "grayscale-0 opacity-100"
                      : "grayscale-0 opacity-100 hover:grayscale hover:opacity-70"
                  }`}
                />
              ) : (
                <span
                  className={`font-semibold text-sm text-center transition-colors ${
                    selectedIndex === index
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {caseItem.titulo}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Selected Case Content */}
        {selectedCase && (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-fade-in">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl border border-border bg-muted shadow-lg">
                <img
                  src={selectedCase.mockup_screenshot_url || selectedCase.imagem_principal || "/placeholder.svg"}
                  alt={selectedCase.titulo}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-5">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                {selectedCase.titulo}
              </h3>

              {selectedCase.subtitulo && (
                <p className="text-muted-foreground leading-relaxed">
                  {selectedCase.subtitulo}
                </p>
              )}

              {/* Breve resumo do projeto */}
              {selectedCase.resumo && (
                <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
                  {selectedCase.resumo}
                </p>
              )}

              {/* Benefits/Entregas */}
              {selectedCase.benefits.length > 0 && (
                <ul className="space-y-4">
                  {selectedCase.benefits.slice(0, 4).map((benefit, i) => {
                    const iconName = benefit.icon?.replace(/([a-z])([A-Z])/g, '$1$2') || 'Check';
                    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Check;
                    
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-foreground font-medium block">
                            {benefit.titulo}
                          </span>
                          {benefit.descricao && (
                            <span className="text-sm text-muted-foreground block">
                              {benefit.descricao}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Tags */}
              {selectedCase.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedCase.tags.slice(0, 4).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-muted text-muted-foreground border border-border text-xs px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="pt-4">
                <Link
                  to={`/cases/${selectedCase.id}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors group"
                >
                  Ver case completo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCasesSection;
