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
          case_tags(tag_id, tags!inner(nome))
        `)
        .eq("publicado", true)
        .order("criado_em", { ascending: false });

      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
      }

      if (selectedCategory !== "Todos") {
        query = query.eq("categories.nome", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedCases = data?.map((c: any) => ({
        id: c.id,
        titulo: c.titulo,
        descricao: c.descricao,
        imagem_url: c.imagem_url,
        publicado: c.publicado,
        criado_em: c.criado_em,
        categoria_id: c.categoria_id,
        categoria_nome: c.categories?.nome || "",
        tags: c.case_tags?.map((ct: any) => ct.tags.nome) || [],
      })) || [];

      // Separar cases em destaque (primeiros 2) e regulares
      return {
        featured: formattedCases.slice(0, 2),
        regular: formattedCases.slice(2),
      };
    },
  });
};
