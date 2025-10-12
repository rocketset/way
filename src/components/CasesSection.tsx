import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
interface CaseItem {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
  categories?: {
    nome: string;
  };
  tags: string[];
}
const CasesSection = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetchCases();
  }, []);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        id,
        titulo,
        descricao,
        imagem_url,
        categories (nome),
        case_content_blocks (block_type, content),
        case_tags (tag_id, tags!inner(nome))
      `)
      .eq('publicado', true)
      .eq('is_featured', true)
      .order('criado_em', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching cases:', error);
      return;
    }

    const mapped = (data || []).map((c: any) => {
      const clientInfo = (c.case_content_blocks || []).find((b: any) => b.block_type === 'client_info');
      const banner = clientInfo?.content?.banner_url || '/placeholder.svg';
      const tags = c.case_tags?.map((ct: any) => ct.tags.nome) || [];
      return { ...c, imagem_url: banner, tags } as CaseItem;
    });

    setCases(mapped);
  };
  return (
    <section id="cases" className="py-32 bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Portfólio
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Especializada em impulsionar marcas para o sucesso online com soluções personalizadas para aumentar sua visibilidade.
          </p>
        </div>

        {/* Carousel */}
        {cases.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Nenhum case em destaque no momento.
          </p>
        ) : (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {cases.map((caseItem, index) => (
                  <div
                    key={caseItem.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)] min-w-0"
                  >
                    <div 
                      className="group cursor-pointer animate-fade-in h-full flex flex-col"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => navigate(`/cases/${caseItem.id}`)}
                    >
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-muted">
                        <img
                          src={caseItem.imagem_url || "/placeholder.svg"}
                          alt={caseItem.titulo}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {caseItem.titulo}
                      </h3>

                      {/* Tags/Services */}
                      {caseItem.tags.length > 0 && (
                        <ul className="space-y-1.5">
                          {caseItem.tags.slice(0, 3).map((tag, tagIndex) => (
                            <li key={tagIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                              <span>{tag}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full border-2 border-border bg-background hover:bg-muted hover:border-primary transition-all duration-300 flex items-center justify-center group"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              </button>
              <button
                onClick={scrollNext}
                className="w-12 h-12 rounded-full border-2 border-border bg-background hover:bg-muted hover:border-primary transition-all duration-300 flex items-center justify-center group"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={() => navigate('/cases')}
            className="px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            VER TODOS OS CASES
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;