import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string | null;
  beneficios: string | null;
  tipo_contratacao: string;
  modalidade: string;
  area: string | null;
  nivel: string | null;
  salario_visivel: boolean | null;
  faixa_salarial: string | null;
  ativo: boolean | null;
  ordem: number | null;
  criado_em: string;
  atualizado_em: string;
}

export const useVagas = (apenasAtivas = false) => {
  return useQuery({
    queryKey: ["vagas", apenasAtivas],
    queryFn: async () => {
      let query = supabase
        .from("vagas")
        .select("*")
        .order("ordem", { ascending: true })
        .order("criado_em", { ascending: false });

      if (apenasAtivas) {
        query = query.eq("ativo", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Vaga[];
    },
  });
};

export const useVaga = (id: string | undefined) => {
  return useQuery({
    queryKey: ["vaga", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("vagas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Vaga;
    },
    enabled: !!id,
  });
};

export const useCreateVaga = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vaga: Omit<Partial<Vaga>, 'id' | 'criado_em' | 'atualizado_em'> & { titulo: string; descricao: string }) => {
      const { data, error } = await supabase
        .from("vagas")
        .insert([vaga])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      toast({
        title: "Vaga criada",
        description: "A vaga foi criada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar vaga",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVaga = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...vaga }: Partial<Vaga> & { id: string }) => {
      const { data, error } = await supabase
        .from("vagas")
        .update(vaga)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      toast({
        title: "Vaga atualizada",
        description: "A vaga foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar vaga",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteVaga = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vagas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas"] });
      toast({
        title: "Vaga excluída",
        description: "A vaga foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir vaga",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
