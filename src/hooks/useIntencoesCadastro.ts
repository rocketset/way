import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface IntencaoCadastro {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  ordem: number;
}

export const useIntencoesCadastro = () => {
  return useQuery({
    queryKey: ['intencoes-cadastro'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intencoes_cadastro')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as IntencaoCadastro[];
    },
  });
};
