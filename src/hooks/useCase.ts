import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCase = (caseId: string) => {
  return useQuery({
    queryKey: ["case", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          categories!categoria_id(nome),
          case_tags(tag_id, tags!inner(nome))
        `)
        .eq("id", caseId)
        .eq("publicado", true)
        .single();

      if (error) throw error;

      return {
        ...data,
        categoria_nome: data.categories?.nome || "",
        tags: data.case_tags?.map((ct: any) => ct.tags.nome) || [],
        mockup_screenshot_url: data.mockup_screenshot_url,
      };
    },
    enabled: !!caseId,
    staleTime: 0, // Force fresh data
  });
};
