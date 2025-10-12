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
export const ClientInfoBlock = ({
  data,
  caseId
}: ClientInfoBlockProps) => {
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
        <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Sobre o Cliente
          </h2>
          <div className="text-lg text-muted-foreground leading-relaxed">
            {data.sobre_cliente_texto.split('\n').map((paragraph, index) => <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>)}
          </div>
        </div>
      </div>
    </section>;
};