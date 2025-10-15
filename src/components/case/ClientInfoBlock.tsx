import { ClientInfoBlockContent, HeroBlockContent } from "@/hooks/useCaseBlocks";
import { useCase } from "@/hooks/useCase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import DOMPurify from "dompurify";
interface ClientInfoBlockProps {
  data: ClientInfoBlockContent;
  caseId: string;
  heroData?: HeroBlockContent;
}
const tagColors: Record<string, string> = {
  instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  shopee: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  nuvemshop: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  default: "bg-zinc-700/50 text-zinc-300 border-zinc-600/50"
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
  return <section className="py-16 px-6 bg-background">
      <div className="container mx-auto max-w-7xl space-y-16 my-[37px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
          <Link to="/" className="hover:text-primary transition-colors">
            Página inicial
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/cases" className="hover:text-primary transition-colors">
            Cases
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">
            {caseData?.titulo || 'Case'}
          </span>
        </nav>

        {/* Tags */}
        {caseTags && caseTags.length > 0 && <div className="flex flex-wrap gap-3 animate-fade-in" style={{
        animationDelay: '100ms'
      }}>
            {caseTags.map(tag => <Badge key={tag.id} variant="outline" className="px-4 py-2 text-sm font-medium bg-card border border-border hover:border-primary/50 transition-all duration-300">
                {tag.nome}
              </Badge>)}
          </div>}

        {/* Client Info Card */}
        {(data.logo_cliente || data.nome_cliente) && <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in border border-border bg-card p-8" style={{
        animationDelay: '200ms'
      }}>
            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
              {data.logo_cliente && <div className="flex justify-center md:justify-start">
                  <img src={data.logo_cliente} alt="Logo do cliente" className="w-32 h-32 object-contain" />
                </div>}
              <div className="space-y-4">
                {data.nome_cliente && <h3 className="text-2xl font-bold text-foreground">{data.nome_cliente}</h3>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {data.setor && <div>
                      <span className="text-muted-foreground">Setor:</span>
                      <span className="ml-2 text-foreground font-medium">{data.setor}</span>
                    </div>}
                  {data.localizacao && <div>
                      <span className="text-muted-foreground">Localização:</span>
                      <span className="ml-2 text-foreground font-medium">{data.localizacao}</span>
                    </div>}
                  {data.site_cliente && <div className="md:col-span-2">
                      <span className="text-muted-foreground">Site:</span>
                      <a href={data.site_cliente} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline font-medium">
                        {data.site_cliente}
                      </a>
                    </div>}
                </div>
              </div>
            </div>
          </div>}

        {/* Hero Content Below */}
        {heroData && <div className="relative py-20 overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card/50 to-background border border-border animate-fade-in" style={{
        animationDelay: '400ms'
      }}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            
            {/* Animated dots pattern */}
            <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'var(--gradient-dots)',
          backgroundSize: 'var(--dot-size) var(--dot-size)'
        }} />

            {/* Gradient orbs */}
            <div className="absolute top-10 left-10 w-48 h-48 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />

            <div className="relative z-10 container px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                    <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                      {heroData.titulo}
                    </span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-muted-foreground font-light">
                    {heroData.subtitulo}
                  </p>

                  <div className="h-1 w-20 bg-gradient-to-r from-primary via-accent to-transparent rounded-full" />

                  <div
                    className="text-base lg:text-lg text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(heroData.descricao || '') }}
                  />
                </div>

                {/* Right Column - Image */}
                {heroData.imagem_principal && <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Image container */}
                    <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl transform group-hover:scale-[1.02] transition-all duration-500">
                      <img src={heroData.imagem_principal} alt={heroData.titulo} className="w-full h-auto object-cover" />
                      
                      {/* Overlay gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-500" />
                  </div>}
              </div>
            </div>
          </div>}
      </div>
    </section>;
};