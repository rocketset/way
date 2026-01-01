import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PartnerLogo {
  id: string;
  nome: string;
  logo_url: string;
  ordem: number | null;
  ativo: boolean | null;
  criado_em: string;
  atualizado_em: string;
}

export const usePartnerLogos = (onlyActive = true) => {
  return useQuery({
    queryKey: ["partner-logos", onlyActive],
    queryFn: async () => {
      let query = supabase
        .from("partner_logos")
        .select("*")
        .order("ordem", { ascending: true });

      if (onlyActive) {
        query = query.eq("ativo", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PartnerLogo[];
    },
  });
};

export const useCreatePartnerLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: Omit<PartnerLogo, "id" | "criado_em" | "atualizado_em">) => {
      const { data, error } = await supabase
        .from("partner_logos")
        .insert(logo)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-logos"] });
      toast.success("Logo do parceiro adicionada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar logo: " + error.message);
    },
  });
};

export const useUpdatePartnerLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<PartnerLogo> & { id: string }) => {
      const { data, error } = await supabase
        .from("partner_logos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-logos"] });
      toast.success("Logo atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar logo: " + error.message);
    },
  });
};

export const useDeletePartnerLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partner_logos").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-logos"] });
      toast.success("Logo removida com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover logo: " + error.message);
    },
  });
};
