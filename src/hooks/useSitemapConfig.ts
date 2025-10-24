import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SitemapConfig {
  id: string;
  last_generated_at: string | null;
  total_urls: number;
  status: 'pending' | 'generating' | 'success' | 'error';
  created_at: string;
  updated_at: string;
}

export const useSitemapConfig = () => {
  return useQuery({
    queryKey: ["sitemap-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sitemap_config")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data as SitemapConfig | null;
    },
  });
};

export const useGenerateSitemap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Atualizar status para "generating"
      const { data: config } = await supabase
        .from("sitemap_config")
        .select("id")
        .maybeSingle();

      if (config) {
        await supabase
          .from("sitemap_config")
          .update({ status: 'generating' })
          .eq("id", config.id);
      }

      // Chamar edge function para gerar sitemap
      const { data, error } = await supabase.functions.invoke('generate-sitemap');

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitemap-config"] });
      toast({
        title: "Sitemap atualizado",
        description: "O sitemap foi gerado com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Error generating sitemap:", error);
      toast({
        title: "Erro ao gerar sitemap",
        description: "Não foi possível gerar o sitemap. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
