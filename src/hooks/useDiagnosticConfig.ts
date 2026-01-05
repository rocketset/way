import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DiagnosticHub {
  id: string;
  name: string;
  icon: string;
  ordem: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface DiagnosticTool {
  id: string;
  hub_id: string;
  name: string;
  description: string;
  importance: string;
  ordem: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

// ============ HUBS ============

export function useDiagnosticHubs() {
  return useQuery({
    queryKey: ['diagnostic-hubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnostic_hubs')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as DiagnosticHub[];
    },
  });
}

export function useCreateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hub: { name: string; icon: string }) => {
      // Pega a maior ordem atual
      const { data: existing } = await supabase
        .from('diagnostic_hubs')
        .select('ordem')
        .order('ordem', { ascending: false })
        .limit(1);

      const nextOrdem = (existing?.[0]?.ordem ?? 0) + 1;

      const { error } = await supabase
        .from('diagnostic_hubs')
        .insert({ ...hub, ordem: nextOrdem });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-hubs'] });
      toast.success('Hub criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar hub:', error);
      toast.error('Erro ao criar hub');
    },
  });
}

export function useUpdateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<DiagnosticHub> & { id: string }) => {
      const { error } = await supabase
        .from('diagnostic_hubs')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-hubs'] });
      toast.success('Hub atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar hub:', error);
      toast.error('Erro ao atualizar hub');
    },
  });
}

export function useDeleteHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('diagnostic_hubs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-hubs'] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tools'] });
      toast.success('Hub excluído!');
    },
    onError: (error) => {
      console.error('Erro ao excluir hub:', error);
      toast.error('Erro ao excluir hub');
    },
  });
}

// ============ TOOLS ============

export function useDiagnosticTools(hubId?: string) {
  return useQuery({
    queryKey: ['diagnostic-tools', hubId],
    queryFn: async () => {
      let query = supabase
        .from('diagnostic_tools')
        .select('*')
        .order('ordem', { ascending: true });

      if (hubId) {
        query = query.eq('hub_id', hubId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as DiagnosticTool[];
    },
  });
}

export function useCreateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tool: { hub_id: string; name: string; description: string; importance: string }) => {
      // Pega a maior ordem atual para o hub
      const { data: existing } = await supabase
        .from('diagnostic_tools')
        .select('ordem')
        .eq('hub_id', tool.hub_id)
        .order('ordem', { ascending: false })
        .limit(1);

      const nextOrdem = (existing?.[0]?.ordem ?? 0) + 1;

      const { error } = await supabase
        .from('diagnostic_tools')
        .insert({ ...tool, ordem: nextOrdem });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tools'] });
      toast.success('Ferramenta criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar ferramenta:', error);
      toast.error('Erro ao criar ferramenta');
    },
  });
}

export function useUpdateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<DiagnosticTool> & { id: string }) => {
      const { error } = await supabase
        .from('diagnostic_tools')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tools'] });
      toast.success('Ferramenta atualizada!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar ferramenta:', error);
      toast.error('Erro ao atualizar ferramenta');
    },
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('diagnostic_tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-tools'] });
      toast.success('Ferramenta excluída!');
    },
    onError: (error) => {
      console.error('Erro ao excluir ferramenta:', error);
      toast.error('Erro ao excluir ferramenta');
    },
  });
}
