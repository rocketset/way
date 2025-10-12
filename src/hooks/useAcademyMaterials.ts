import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AcademyMaterial {
  id: string;
  content_id: string;
  tipo_material: 'curso' | 'treinamento' | 'guia' | 'ebook' | 'planilha' | 'video';
  nome: string;
  arquivo_url?: string;
  formato: string;
  duracao?: string;
  ordem: number;
  criado_em: string;
  atualizado_em: string;
}

export const useAcademyMaterials = (contentId: string) => {
  return useQuery({
    queryKey: ["academy-materials", contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academy_materials")
        .select("*")
        .eq("content_id", contentId)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return (data || []) as AcademyMaterial[];
    },
    enabled: !!contentId,
  });
};
