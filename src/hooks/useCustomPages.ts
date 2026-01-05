import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

export interface CustomPage {
  id: string;
  titulo: string;
  slug: string;
  html_content: string;
  css_content: string;
  js_content: string;
  blocks_content: any[];
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  noindex: boolean;
  publicado: boolean;
  layout: string;
  header_visible: boolean;
  footer_visible: boolean;
  custom_head: string | null;
  autor_id: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface CustomPageInput {
  titulo: string;
  slug: string;
  html_content?: string;
  css_content?: string;
  js_content?: string;
  blocks_content?: any[];
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
  publicado?: boolean;
  layout?: string;
  header_visible?: boolean;
  footer_visible?: boolean;
  custom_head?: string | null;
}

// Hook para listar todas as páginas (admin)
export const useCustomPages = () => {
  return useQuery({
    queryKey: ['custom-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data as CustomPage[];
    },
  });
};

// Hook para buscar página por ID (admin)
export const useCustomPageById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['custom-page', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as CustomPage;
    },
    enabled: !!id,
  });
};

// Hook para buscar página pública por slug
export const useCustomPageBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['custom-page-slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data as CustomPage;
    },
    enabled: !!slug,
  });
};

// Hook para criar página
export const useCreateCustomPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CustomPageInput) => {
      const { data, error } = await supabase
        .from('custom_pages')
        .insert({
          ...input,
          autor_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CustomPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      toast({
        title: "Sucesso",
        description: "Página criada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a página",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar página
export const useUpdateCustomPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: CustomPageInput & { id: string }) => {
      const { data, error } = await supabase
        .from('custom_pages')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as CustomPage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      queryClient.invalidateQueries({ queryKey: ['custom-page', data.id] });
      toast({
        title: "Sucesso",
        description: "Página atualizada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a página",
        variant: "destructive",
      });
    },
  });
};

// Hook para excluir página
export const useDeleteCustomPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      toast({
        title: "Sucesso",
        description: "Página excluída com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir a página",
        variant: "destructive",
      });
    },
  });
};

// Hook para alternar publicação
export const useToggleCustomPagePublish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { data, error } = await supabase
        .from('custom_pages')
        .update({ publicado })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as CustomPage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      queryClient.invalidateQueries({ queryKey: ['custom-page', data.id] });
      toast({
        title: "Sucesso",
        description: data.publicado ? "Página publicada" : "Página despublicada",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar o status da página",
        variant: "destructive",
      });
    },
  });
};