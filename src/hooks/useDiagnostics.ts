import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiagnosticRecord {
  id: string;
  name: string;
  email: string;
  store_url: string;
  instagram: string;
  whatsapp: string;
  answers: Record<string, boolean>;
  score: number;
  lido: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticFormData {
  name: string;
  email: string;
  store_url: string;
  instagram: string;
  whatsapp: string;
}

export interface DiagnosticStats {
  total: number;
  averageScore: number;
  perfectScores: number;
  last7Days: number;
  unread: number;
}

export const useDiagnostics = () => {
  return useQuery({
    queryKey: ['diagnostics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnostic_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DiagnosticRecord[];
    }
  });
};

export const useDiagnosticStats = () => {
  return useQuery({
    queryKey: ['diagnostic-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnostic_records')
        .select('*');

      if (error) throw error;

      const records = data as DiagnosticRecord[];
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: DiagnosticStats = {
        total: records.length,
        averageScore: records.length > 0 
          ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length)
          : 0,
        perfectScores: records.filter(r => r.score === 100).length,
        last7Days: records.filter(r => new Date(r.created_at) >= sevenDaysAgo).length,
        unread: records.filter(r => !r.lido).length
      };

      return stats;
    }
  });
};

export const useCreateDiagnostic = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DiagnosticFormData & { answers: Record<string, boolean>; score: number }) => {
      const { data: result, error } = await supabase
        .from('diagnostic_records')
        .insert([{
          name: data.name,
          email: data.email,
          store_url: data.store_url,
          instagram: data.instagram,
          whatsapp: data.whatsapp,
          answers: data.answers,
          score: data.score
        }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic-stats'] });
    },
    onError: (error) => {
      console.error('Error creating diagnostic:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o diagnóstico. Tente novamente.',
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateDiagnostic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, lido }: { id: string; lido: boolean }) => {
      const { error } = await supabase
        .from('diagnostic_records')
        .update({ lido })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic-stats'] });
    }
  });
};

export const useDeleteDiagnostic = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('diagnostic_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic-stats'] });
      toast({
        title: 'Sucesso',
        description: 'Diagnóstico excluído com sucesso.'
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o diagnóstico.',
        variant: 'destructive'
      });
    }
  });
};
