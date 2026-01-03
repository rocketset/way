import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Candidatura {
  id: string;
  vaga_id: string | null;
  nome: string;
  email: string;
  telefone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  curriculo_url: string | null;
  mensagem: string | null;
  nivel_experiencia: string | null;
  pretensao_salarial: string | null;
  status: string;
  lido: boolean | null;
  notas_internas: string | null;
  criado_em: string;
  atualizado_em: string;
  vaga?: {
    titulo: string;
  } | null;
}

export const useCandidaturas = (vagaId?: string) => {
  return useQuery({
    queryKey: ["candidaturas", vagaId],
    queryFn: async () => {
      let query = supabase
        .from("candidaturas")
        .select(`
          *,
          vaga:vagas(titulo)
        `)
        .order("criado_em", { ascending: false });

      if (vagaId) {
        query = query.eq("vaga_id", vagaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Candidatura[];
    },
  });
};

export const useCandidatura = (id: string | undefined) => {
  return useQuery({
    queryKey: ["candidatura", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("candidaturas")
        .select(`
          *,
          vaga:vagas(titulo)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Candidatura;
    },
    enabled: !!id,
  });
};

export const useCreateCandidatura = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (candidatura: Omit<Partial<Candidatura>, 'id' | 'criado_em' | 'atualizado_em' | 'vaga'> & { nome: string; email: string }) => {
      const { data, error } = await supabase
        .from("candidaturas")
        .insert([candidatura])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Candidatura enviada!",
        description: "Recebemos sua candidatura. Entraremos em contato em breve.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar candidatura",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCandidatura = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...candidatura }: Partial<Candidatura> & { id: string }) => {
      const { data, error } = await supabase
        .from("candidaturas")
        .update(candidatura)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidaturas"] });
      toast({
        title: "Candidatura atualizada",
        description: "A candidatura foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar candidatura",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCandidatura = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("candidaturas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidaturas"] });
      toast({
        title: "Candidatura excluída",
        description: "A candidatura foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir candidatura",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const uploadCurriculo = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("curriculos")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("curriculos")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
