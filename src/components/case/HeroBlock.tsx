import { HeroBlockContent } from "@/hooks/useCaseBlocks";
import { Badge } from "@/components/ui/badge";

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
  const bgColor = "#000000";
  const getTagColor = (tag: string) => {
    const normalized = tag.toLowerCase();
    return tagColors[normalized] || tagColors.default;
  };

  return (
    <section 
      className="min-h-screen flex items-center py-20 px-6"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {data.logo_url && (
              <div className="mb-8">
                <img 
                  src={data.logo_url} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}

            <h1 className="text-5xl lg:text-7xl font-bold text-white">
              {data.titulo}
            </h1>

            <p className="text-xl text-gray-400">
              {data.subtitulo}
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              {data.descricao}
            </p>

            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-4">
                {data.tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="outline"
                    className={`${getTagColor(tag.nome)} px-4 py-2 text-sm font-medium`}
                  >
                    {tag.nome}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          {data.imagem_principal && (
            <div className="relative">
              <img
                src={data.imagem_principal}
                alt={data.titulo}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
