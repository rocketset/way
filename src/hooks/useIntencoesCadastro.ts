import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FormularioTipo = 'home' | 'contato' | 'consulting' | 'implementation' | 'performance' | 'journey' | 'todos';

export interface IntencaoCadastro {
  id: string;
  nome: string;
  valor_slug: string | null;
  descricao: string | null;
  exibir_em: string[] | null;
  icone: string | null;
  cor_destaque: string | null;
  ativo: boolean;
  ordem: number;
  criado_em: string;
  atualizado_em: string;
}

export const FORMULARIOS_DISPONIVEIS: { value: FormularioTipo; label: string }[] = [
  { value: 'todos', label: 'Todos os Formulários' },
  { value: 'home', label: 'Home (CTA Results)' },
  { value: 'contato', label: 'Página de Contato' },
  { value: 'consulting', label: 'Consultoria' },
  { value: 'implementation', label: 'Implantação' },
  { value: 'performance', label: 'Performance' },
  { value: 'journey', label: 'Jornada' },
];

export const useIntencoesCadastro = (formulario?: FormularioTipo) => {
  return useQuery({
    queryKey: ['intencoes-cadastro', formulario],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intencoes_cadastro')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;

      // Filtrar por formulário se especificado
      if (formulario && formulario !== 'todos') {
        return (data as IntencaoCadastro[]).filter(item => {
          const exibirEm = item.exibir_em || ['todos'];
          return exibirEm.includes('todos') || exibirEm.includes(formulario);
        });
      }

      return data as IntencaoCadastro[];
    },
  });
};

export const useAllIntencoesCadastro = () => {
  return useQuery({
    queryKey: ['intencoes-cadastro-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intencoes_cadastro')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as IntencaoCadastro[];
    },
  });
};

export const useCreateIntencao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Partial<IntencaoCadastro>, 'id' | 'criado_em' | 'atualizado_em'> & { nome: string }) => {
      const { error } = await supabase
        .from('intencoes_cadastro')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intencoes-cadastro'] });
      queryClient.invalidateQueries({ queryKey: ['intencoes-cadastro-all'] });
    },
  });
};

export const useUpdateIntencao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<IntencaoCadastro> & { id: string }) => {
      const { error } = await supabase
        .from('intencoes_cadastro')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intencoes-cadastro'] });
      queryClient.invalidateQueries({ queryKey: ['intencoes-cadastro-all'] });
    },
  });
};

export const useDeleteIntencao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('intencoes_cadastro')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intencoes-cadastro'] });
      queryClient.invalidateQueries({ queryKey: ['intencoes-cadastro-all'] });
    },
  });
};
