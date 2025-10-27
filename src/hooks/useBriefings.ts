import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BriefingData {
  id?: string;
  nome_empresa: string;
  cnpj: string;
  segmento: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  site_atual?: string;
  responsavel_projeto: string;
  cargo_funcao?: string;
  contato: string;
  data_inicio_projeto?: string;
  forma_juridica?: string;
  estrutura_organizacao: Record<string, string>;
  sistemas_integracoes: Record<string, string>;
  produtos_fornecimento: Record<string, string>;
  mercado_estrategia: Record<string, string>;
  comunicacao_relacionamento: Record<string, string>;
  operacao_logistica: Record<string, string>;
  observacoes_gerais?: string;
  status?: string;
  lido?: boolean;
  criado_em?: string;
}

export function useBriefings() {
  return useQuery({
    queryKey: ["briefings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("briefings")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as BriefingData[];
    },
  });
}

export function useBriefing(id: string | undefined) {
  return useQuery({
    queryKey: ["briefing", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("briefings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as BriefingData | null;
    },
    enabled: !!id,
  });
}

export function useCreateBriefing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (briefing: BriefingData) => {
      const { data, error } = await supabase
        .from("briefings")
        .insert([briefing])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
      toast.success("Briefing enviado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao enviar briefing: " + error.message);
    },
  });
}

export function useUpdateBriefing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BriefingData> & { id: string }) => {
      const { data, error } = await supabase
        .from("briefings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
      toast.success("Briefing atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar briefing: " + error.message);
    },
  });
}

export function useDeleteBriefing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("briefings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
      toast.success("Briefing deletado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao deletar briefing: " + error.message);
    },
  });
}
