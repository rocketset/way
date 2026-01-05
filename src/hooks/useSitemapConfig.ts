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

// URL da edge function do sitemap dinâmico
export const SITEMAP_URL = "https://kmjasfuacnwqyershuxa.supabase.co/functions/v1/serve-sitemap";

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

      // Chamar edge function para testar e contar URLs
      const response = await fetch(SITEMAP_URL);
      
      if (!response.ok) {
        throw new Error('Failed to generate sitemap');
      }

      const xml = await response.text();
      
      // Contar URLs no XML
      const urlMatches = xml.match(/<url>/g);
      const totalUrls = urlMatches ? urlMatches.length : 0;

      // Atualizar configuração
      if (config) {
        await supabase
          .from("sitemap_config")
          .update({
            last_generated_at: new Date().toISOString(),
            total_urls: totalUrls,
            status: 'success',
          })
          .eq("id", config.id);
      } else {
        await supabase
          .from("sitemap_config")
          .insert({
            last_generated_at: new Date().toISOString(),
            total_urls: totalUrls,
            status: 'success',
          });
      }

      return { totalUrls, xml };
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
