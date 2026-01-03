// Hook para gerenciar visibilidade do menu por role

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MenuVisibilityItem {
  id: string;
  menu_key: string;
  menu_label: string;
  menu_path: string | null;
  menu_icon: string | null;
  roles: string[];
  parent_key: string | null;
  ordem: number;
  is_separator: boolean;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export function useMenuVisibility() {
  return useQuery({
    queryKey: ['menu-visibility'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_visibility')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as MenuVisibilityItem[];
    },
  });
}

export function useAllMenuVisibility() {
  return useQuery({
    queryKey: ['menu-visibility-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_visibility')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as MenuVisibilityItem[];
    },
  });
}

export function useUpdateMenuVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      roles,
    }: {
      id: string;
      roles: string[];
    }) => {
      const { error } = await supabase
        .from('menu_visibility')
        .update({ roles, atualizado_em: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-visibility'] });
      queryClient.invalidateQueries({ queryKey: ['menu-visibility-all'] });
      toast.success('Permissões atualizadas!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar permissões');
    },
  });
}

export function useToggleMenuActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ativo,
    }: {
      id: string;
      ativo: boolean;
    }) => {
      const { error } = await supabase
        .from('menu_visibility')
        .update({ ativo, atualizado_em: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-visibility'] });
      queryClient.invalidateQueries({ queryKey: ['menu-visibility-all'] });
      toast.success('Status atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar status');
    },
  });
}
