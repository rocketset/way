import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Case {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
  publicado: boolean;
  criado_em: string;
  categoria_id: string | null;
  categoria_nome?: string;
  tags: string[];
  is_featured: boolean;
  mockup_screenshot_url?: string | null;
}

export const useCases = (searchQuery = "", selectedCategory = "Todos") => {
  return useQuery({
    queryKey: ["cases", searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("cases")
        .select(`
          *,
          categories!categoria_id(nome),
          case_tags(tag_id, tags!inner(nome)),
          case_content_blocks(block_type, content)
        `)
        .eq("publicado", true)
        .order("ordem", { ascending: true });

      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
      }

      if (selectedCategory !== "Todos") {
        query = query.eq("categories.nome", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedCases = data?.map((c: any) => {
        // Buscar a imagem principal do bloco hero (usada nas listagens)
        const heroBlock = c.case_content_blocks?.find(
          (block: any) => block.block_type === 'hero'
        );
        const imagemPrincipal = heroBlock?.content?.imagem_principal || '/placeholder.svg';

        return {
          id: c.id,
          titulo: c.titulo,
          descricao: c.descricao,
          imagem_url: imagemPrincipal,
          publicado: c.publicado,
          criado_em: c.criado_em,
          categoria_id: c.categoria_id,
          categoria_nome: c.categories?.nome || "",
          tags: c.case_tags?.map((ct: any) => ct.tags.nome) || [],
          is_featured: c.is_featured || false,
          mockup_screenshot_url: c.mockup_screenshot_url || null,
        };
      }) || [];

      // Separar cases em destaque (baseado no campo is_featured) e regulares
      const featured = formattedCases.filter((c: any) => c.is_featured);
      const regular = formattedCases.filter((c: any) => !c.is_featured);
      
      return {
        featured,
        regular,
      };
    },
  });
};
