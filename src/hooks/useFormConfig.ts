import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FormField {
  id: string;
  form_config_id: string;
  nome_campo: string;
  label: string;
  placeholder: string | null;
  tipo_campo: string;
  obrigatorio: boolean;
  ordem: number;
  largura: string;
  opcoes: { value: string; label: string }[] | null;
  validacao: { min?: number; max?: number; pattern?: string; minLength?: number; maxLength?: number } | null;
  valor_padrao: string | null;
  dica: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface FormConfig {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  titulo_formulario: string | null;
  subtitulo_formulario: string | null;
  texto_botao_enviar: string | null;
  mostrar_whatsapp: boolean;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  fields?: FormField[];
}

export const FIELD_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'E-mail' },
  { value: 'tel', label: 'Telefone' },
  { value: 'textarea', label: 'Área de Texto' },
  { value: 'select', label: 'Seleção (dropdown)' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio (opções)' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'url', label: 'URL/Site' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'cpf', label: 'CPF' },
];

export const FIELD_WIDTHS = [
  { value: 'full', label: 'Largura total' },
  { value: 'half', label: 'Metade (50%)' },
  { value: 'third', label: 'Um terço (33%)' },
];

// Hook para buscar configuração de um formulário específico com seus campos
export const useFormConfig = (slug: string) => {
  return useQuery({
    queryKey: ['form-config', slug],
    queryFn: async () => {
      // Buscar configuração do formulário
       const { data: config, error: configError } = await supabase
         .from('form_configs')
         .select('*')
         .eq('slug', slug)
         .eq('ativo', true)
         .maybeSingle();

       if (configError) throw configError;
       if (!config) return null;

      // Buscar campos do formulário
      const { data: fields, error: fieldsError } = await supabase
        .from('form_fields')
        .select('*')
        .eq('form_config_id', config.id)
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (fieldsError) throw fieldsError;

      return {
        ...config,
        fields: fields as FormField[],
      } as FormConfig;
    },
    enabled: !!slug,
  });
};

// Hook para listar todas as configurações de formulários
export const useAllFormConfigs = () => {
  return useQuery({
    queryKey: ['form-configs-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_configs')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      return data as FormConfig[];
    },
  });
};

// Hook para buscar campos de um formulário específico (admin)
export const useFormFields = (formConfigId: string) => {
  return useQuery({
    queryKey: ['form-fields', formConfigId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .eq('form_config_id', formConfigId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as FormField[];
    },
    enabled: !!formConfigId,
  });
};

// Mutation para atualizar configuração do formulário
export const useUpdateFormConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<FormConfig> & { id: string }) => {
      const { error } = await supabase
        .from('form_configs')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-config'] });
      queryClient.invalidateQueries({ queryKey: ['form-configs-all'] });
    },
  });
};

// Mutation para criar campo
export const useCreateFormField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<FormField, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { error } = await supabase
        .from('form_fields')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      queryClient.invalidateQueries({ queryKey: ['form-config'] });
    },
  });
};

// Mutation para atualizar campo
export const useUpdateFormField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<FormField> & { id: string }) => {
      const { error } = await supabase
        .from('form_fields')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      queryClient.invalidateQueries({ queryKey: ['form-config'] });
    },
  });
};

// Mutation para excluir campo
export const useDeleteFormField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      queryClient.invalidateQueries({ queryKey: ['form-config'] });
    },
  });
};
