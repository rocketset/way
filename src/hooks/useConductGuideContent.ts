import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ConductGuideSection {
  id: string;
  section_key: string;
  section_title: string;
  section_description: string | null;
  content: any;
  ordem: number;
  ativo: boolean;
}

export const useConductGuideContent = () => {
  return useQuery({
    queryKey: ["conduct-guide-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conduct_guide_content")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (error) throw error;
      return data as ConductGuideSection[];
    },
  });
};

export const useUpdateConductGuideSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: Partial<ConductGuideSection> & { id: string }) => {
      const { error } = await supabase
        .from("conduct_guide_content")
        .update({
          section_title: section.section_title,
          section_description: section.section_description,
          content: section.content,
        })
        .eq("id", section.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conduct-guide-content"] });
      toast({
        title: "Sucesso",
        description: "Seção atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar seção: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateConductGuideSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: {
      section_key: string;
      section_title: string;
      section_description: string;
      content: any;
      ordem: number;
    }) => {
      const { error } = await supabase
        .from("conduct_guide_content")
        .insert(section);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conduct-guide-content"] });
      toast({
        title: "Sucesso",
        description: "Nova seção criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar seção: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteConductGuideSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("conduct_guide_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conduct-guide-content"] });
      toast({
        title: "Sucesso",
        description: "Seção excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir seção: " + error.message,
        variant: "destructive",
      });
    },
  });
};
