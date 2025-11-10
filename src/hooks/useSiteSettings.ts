import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SiteSettings {
  id: string;
  company_name: string;
  company_description: string | null;
  company_founding_year: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  google_reviews_url: string | null;
  site_url: string | null;
  logo_url: string | null;
  rating_value: number | null;
  review_count: number | null;
  criado_em: string;
  atualizado_em: string;
}

export const useSiteSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data as SiteSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<SiteSettings>) => {
      if (!settings?.id) throw new Error('Nenhuma configuração encontrada');

      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', settings.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar configurações');
      console.error(error);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
  };
};
