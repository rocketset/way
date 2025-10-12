import { ClientInfoBlockContent } from "@/hooks/useCaseBlocks";
import { useCase } from "@/hooks/useCase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ClientInfoBlockProps {
  data: ClientInfoBlockContent;
  caseId: string;
}

const tagColors: Record<string, string> = {
  "vtex io": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "shopify": "bg-green-500/10 text-green-500 border-green-500/20",
  "nuvemshop": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "magento": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "migração": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "evolução": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  "on-going": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  "b2c": "bg-pink-500/10 text-pink-500 border-pink-500/20",
  "b2b": "bg-teal-500/10 text-teal-500 border-teal-500/20",
  default: "bg-muted text-muted-foreground border-border",
};

const getTagColor = (tag: string): string => {
  const normalizedTag = tag.toLowerCase();
  return tagColors[normalizedTag] || tagColors.default;
};

export const ClientInfoBlock = ({ data, caseId }: ClientInfoBlockProps) => {
  const { data: caseData } = useCase(caseId);

  // Fetch case tags
  const { data: caseTags = [] } = useQuery({
    queryKey: ['case-tags-client-info', caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_tags')
        .select('tag_id, tags(id, nome)')
        .eq('case_id', caseId);
      
      if (error) throw error;
      
      return data.map(ct => ({
        id: ct.tags?.id || '',
        nome: ct.tags?.nome || ''
      }));
    },
    enabled: !!caseId
  });

  return (
    <section className="py-12 px-6 bg-background">
      <div className="container mx-auto space-y-8">
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
        {caseTags && caseTags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {caseTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className={`px-4 py-2 text-sm font-medium border ${getTagColor(tag.nome)}`}
              >
                {tag.nome}
              </Badge>
            ))}
          </div>
        )}

        {/* Banner do Cliente */}
        {data.banner_url && (
          <div className="relative w-full aspect-[21/9] md:aspect-[21/7] lg:aspect-[21/6] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={data.banner_url}
              alt="Banner do cliente"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Sobre o Cliente */}
        <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Sobre o Cliente
          </h2>
          <div className="text-lg text-muted-foreground leading-relaxed">
            {data.sobre_cliente_texto.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
