import { HeroBlockContent } from "@/hooks/useCaseBlocks";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "dompurify";

interface HeroBlockProps {
  data: HeroBlockContent;
}

const tagColors: Record<string, string> = {
  instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  shopee: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  nuvemshop: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  default: "bg-zinc-700/50 text-zinc-300 border-zinc-600/50",
};

export const HeroBlock = ({ data }: HeroBlockProps) => {
  const getTagColor = (tag: string) => {
    const normalized = tag.toLowerCase();
    return tagColors[normalized] || tagColors.default;
  };

  return (
    <section className="relative min-h-screen flex items-center py-32 px-6 overflow-hidden bg-background">
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

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl lg:text-8xl font-bold text-foreground leading-tight animate-fade-in delay-100">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-pulse">
                {data.titulo}
              </span>
            </h1>

            <p className="text-2xl lg:text-3xl text-muted-foreground font-light animate-fade-in delay-200">
              {data.subtitulo}
            </p>

            <div className="h-1 w-24 bg-gradient-to-r from-primary via-accent to-transparent rounded-full animate-fade-in delay-300" />

            <div
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed animate-fade-in delay-300 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.descricao || "") }}
            />

            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-4 animate-fade-in delay-500">
                {data.tags.map((tag, index) => (
                  <Badge 
                    key={tag.id} 
                    variant="outline"
                    className={`${getTagColor(tag.nome)} px-5 py-2.5 text-sm font-medium hover:scale-110 transition-all duration-300 cursor-default animate-scale-in backdrop-blur-sm`}
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    {tag.nome}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          {data.imagem_principal && (
            <div className="relative animate-fade-in delay-700 group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Image container */}
              <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700">
                <img
                  src={data.imagem_principal}
                  alt={data.titulo}
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
