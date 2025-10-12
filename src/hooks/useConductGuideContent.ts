import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ConductGuideSection {
  id: string;
  section_key: string;
  section_title: string;
  section_description: string | null;
  content: any[];
  ordem: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const useConductGuideContent = () => {
  return useQuery({
    queryKey: ["conduct-guide-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conduct_guide_content")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as ConductGuideSection[];
    },
  });
};

export const useUpdateConductGuideSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      section_title,
      section_description,
      content,
    }: {
      id: string;
      section_title: string;
      section_description: string | null;
      content: any[];
    }) => {
      const { data, error } = await supabase
        .from("conduct_guide_content")
        .update({
          section_title,
          section_description,
          content,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conduct-guide-content"] });
      toast.success("Seção atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar seção: " + error.message);
    },
  });
};
