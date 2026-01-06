import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface PageSeo {
  id: string;
  page_key: string;
  page_name: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  noindex: boolean;
  nofollow: boolean;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_site: string | null;
  schema_markup: Json | null;
  custom_head_code: string | null;
  custom_body_code: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface GlobalSeoSettings {
  id: string;
  site_name: string;
  site_title_suffix: string;
  default_og_image: string | null;
  twitter_site: string | null;
  google_site_verification: string | null;
  bing_site_verification: string | null;
  robots_txt: string | null;
  criado_em: string;
  atualizado_em: string;
}

// Hook para buscar todas as páginas de SEO
export const usePageSeoList = () => {
  return useQuery({
    queryKey: ['page-seo-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_name');

      if (error) throw error;
      return data as PageSeo[];
    },
  });
};

// Hook para buscar SEO de uma página específica
export const usePageSeo = (pageKey: string) => {
  return useQuery({
    queryKey: ['page-seo', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle();

      if (error) throw error;
      return data as PageSeo | null;
    },
    enabled: !!pageKey,
  });
};

// Hook para atualizar SEO de uma página
export const useUpdatePageSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: {
      meta_title?: string | null;
      meta_description?: string | null;
      meta_keywords?: string | null;
      og_title?: string | null;
      og_description?: string | null;
      og_image?: string | null;
      canonical_url?: string | null;
      noindex?: boolean;
      nofollow?: boolean;
      twitter_title?: string | null;
      twitter_description?: string | null;
      twitter_image?: string | null;
      twitter_site?: string | null;
      custom_head_code?: string | null;
      custom_body_code?: string | null;
    } }) => {
      const { error } = await supabase
        .from('page_seo')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-seo-list'] });
      queryClient.invalidateQueries({ queryKey: ['page-seo'] });
      toast.success('Configurações de SEO atualizadas!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar SEO');
      console.error(error);
    },
  });
};

// Hook para configurações globais de SEO
export const useGlobalSeoSettings = () => {
  return useQuery({
    queryKey: ['global-seo-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_seo_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data as GlobalSeoSettings | null;
    },
  });
};

// Hook para atualizar configurações globais de SEO
export const useUpdateGlobalSeoSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GlobalSeoSettings> }) => {
      const { error } = await supabase
        .from('global_seo_settings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-seo-settings'] });
      toast.success('Configurações globais de SEO atualizadas!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar configurações');
      console.error(error);
    },
  });
};

// Hook para criar nova página de SEO
export const useCreatePageSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pageSeo: { page_key: string; page_name: string }) => {
      const { error } = await supabase
        .from('page_seo')
        .insert({
          page_key: pageSeo.page_key,
          page_name: pageSeo.page_name,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-seo-list'] });
      toast.success('Página de SEO criada!');
    },
    onError: (error) => {
      toast.error('Erro ao criar página de SEO');
      console.error(error);
    },
  });
};

// Hook para deletar página de SEO
export const useDeletePageSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('page_seo')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-seo-list'] });
      toast.success('Página de SEO removida!');
    },
    onError: (error) => {
      toast.error('Erro ao remover página de SEO');
      console.error(error);
    },
  });
};
