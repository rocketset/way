import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AcademyProgress {
  id: string;
  user_id: string;
  content_id: string;
  material_id?: string;
  concluido: boolean;
  progresso: number;
  criado_em: string;
  atualizado_em: string;
}

export const useAcademyProgress = (contentId: string, userId?: string) => {
  return useQuery({
    queryKey: ["academy-progress", contentId, userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("academy_progress")
        .select("*")
        .eq("content_id", contentId)
        .eq("user_id", userId);

      if (error) throw error;
      return (data || []) as AcademyProgress[];
    },
    enabled: !!userId && !!contentId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      contentId, 
      materialId, 
      concluido 
    }: { 
      contentId: string; 
      materialId?: string; 
      concluido: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const progressData = {
        user_id: user.id,
        content_id: contentId,
        material_id: materialId,
        concluido,
        progresso: concluido ? 100 : 0,
      };

      const { data, error } = await supabase
        .from("academy_progress")
        .upsert(progressData, { 
          onConflict: 'user_id,material_id'
        })
        .select()
        .single();

      if (error) throw error;
      
      // Registra atividade de conclusão
      if (concluido) {
        await supabase.from('user_activity_logs').insert({
          user_id: user.id,
          activity_type: 'material_complete',
          activity_data: { content_id: contentId, material_id: materialId }
        });
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["academy-progress", variables.contentId] 
      });
      toast.success(
        variables.concluido ? "Material concluído!" : "Progresso atualizado"
      );
    },
    onError: (error) => {
      console.error("Erro ao atualizar progresso:", error);
      toast.error("Erro ao atualizar progresso");
    },
  });
};
