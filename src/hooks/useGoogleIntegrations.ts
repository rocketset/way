import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface GoogleIntegrations {
  id: string;
  analytics_id: string | null;
  tag_manager_id: string | null;
  search_console_verification: string | null;
  created_at: string;
  updated_at: string;
}

export const useGoogleIntegrations = () => {
  return useQuery({
    queryKey: ["google-integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_integrations")
        .select("*")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as GoogleIntegrations | null;
    },
  });
};

export const useSaveGoogleIntegrations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<GoogleIntegrations>) => {
      const { data: existing } = await supabase
        .from("google_integrations")
        .select("id")
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("google_integrations")
          .update(config)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("google_integrations")
          .insert(config)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-integrations"] });
      toast({
        title: "Configurações salvas",
        description: "As integrações do Google foram atualizadas com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Error saving Google integrations:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações do Google.",
        variant: "destructive",
      });
    },
  });
};
