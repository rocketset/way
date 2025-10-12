import { ClientInfoBlockContent, HeroBlockContent } from "@/hooks/useCaseBlocks";
import { useCase } from "@/hooks/useCase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ClientInfoBlockProps {
  data: ClientInfoBlockContent;
  caseId: string;
  heroData?: HeroBlockContent;
}
const tagColors: Record<string, string> = {
  instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  shopee: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  nuvemshop: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  default: "bg-zinc-700/50 text-zinc-300 border-zinc-600/50",
};

export const ClientInfoBlock = ({
  data,
  caseId,
  heroData
}: ClientInfoBlockProps) => {
  const getTagColor = (tag: string) => {
    const normalized = tag.toLowerCase();
    return tagColors[normalized] || tagColors.default;
  };
  const {
    data: caseData
  } = useCase(caseId);

  // Fetch case tags
  const {
    data: caseTags = []
  } = useQuery({
    queryKey: ['case-tags-client-info', caseId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('case_tags').select('tag_id, tags(id, nome)').eq('case_id', caseId);
      if (error) throw error;
      return data.map(ct => ({
        id: ct.tags?.id || '',
        nome: ct.tags?.nome || ''
      }));
    },
    enabled: !!caseId
  });
  return <section className="py-12 px-6 bg-background">
      <div className="container space-y-8 mx-0 my-[100px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Página inicial
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/cases" className="hover:text-foreground transition-colors">
            Cases
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">
            {caseData?.titulo || 'Case'}
          </span>
        </nav>

        {/* Tags */}
        {caseTags && caseTags.length > 0 && <div className="flex flex-wrap gap-3">
            {caseTags.map(tag => <Badge key={tag.id} variant="outline" className="px-4 py-2 text-sm font-medium bg-card border border-border hover:border-primary/50 transition-all duration-300">
                {tag.nome}
              </Badge>)}
          </div>}

        {/* Banner do Cliente */}
        {data.banner_url && <div className="relative w-full aspect-[21/9] md:aspect-[21/7] lg:aspect-[21/6] rounded-xl overflow-hidden shadow-2xl">
            <img src={data.banner_url} alt="Banner do cliente" className="w-full h-full object-cover" />
          </div>}

        {/* Sobre o Cliente */}
        <div className="grid md:grid-cols-[300px_auto_1fr] gap-8 items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Sobre o Cliente
          </h2>
          <div className="hidden md:block w-px h-32 bg-border"></div>
          <div className="text-lg text-muted-foreground leading-relaxed">
            {data.sobre_cliente_texto.split('\n').map((paragraph, index) => <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>)}
          </div>
        </div>

        {/* Hero Content Below */}
        {heroData && (
          <div className="relative py-20 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
            
            {/* Animated dots pattern */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'var(--gradient-dots)',
                backgroundSize: 'var(--dot-size) var(--dot-size)',
              }}
            />

            {/* Gradient orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[140px] animate-pulse delay-700" />

            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Column - Content */}
                <div className="space-y-8 animate-fade-in">
                  <h1 className="text-5xl lg:text-8xl font-bold text-foreground leading-tight animate-fade-in delay-100">
                    <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-pulse">
                      {heroData.titulo}
                    </span>
                  </h1>

                  <p className="text-2xl lg:text-3xl text-muted-foreground font-light animate-fade-in delay-200">
                    {heroData.subtitulo}
                  </p>

                  <div className="h-1 w-24 bg-gradient-to-r from-primary via-accent to-transparent rounded-full animate-fade-in delay-300" />

                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed animate-fade-in delay-300">
                    {heroData.descricao}
                  </p>
                </div>

                {/* Right Column - Image */}
                {(data.banner_url || heroData.imagem_principal) && (
                  <div className="relative animate-fade-in delay-700 group">
                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Image container */}
                    <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700">
                      <img
                        src={data.banner_url || heroData.imagem_principal}
                        alt={heroData.titulo}
                        className="w-full h-auto object-cover"
                      />
                      
                      {/* Overlay gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Floating elements */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>;
};