import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClientLogo {
  id: string;
  nome: string;
  logo_url: string;
  case_id: string | null;
  ordem: number | null;
  ativo: boolean | null;
  criado_em: string;
  atualizado_em: string;
}

export const useClientLogos = (onlyActive = true) => {
  return useQuery({
    queryKey: ["client-logos", onlyActive],
    queryFn: async () => {
      let query = supabase
        .from("client_logos")
        .select("*")
        .order("ordem", { ascending: true });

      if (onlyActive) {
        query = query.eq("ativo", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ClientLogo[];
    },
  });
};

export const useCreateClientLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: Omit<ClientLogo, "id" | "criado_em" | "atualizado_em">) => {
      const { data, error } = await supabase
        .from("client_logos")
        .insert(logo)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-logos"] });
      toast.success("Logo do cliente adicionada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar logo: " + error.message);
    },
  });
};

export const useUpdateClientLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<ClientLogo> & { id: string }) => {
      const { data, error } = await supabase
        .from("client_logos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-logos"] });
      toast.success("Logo atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar logo: " + error.message);
    },
  });
};

export const useDeleteClientLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("client_logos").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-logos"] });
      toast.success("Logo removida com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover logo: " + error.message);
    },
  });
};
