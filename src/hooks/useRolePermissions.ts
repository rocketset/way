import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RolePermission {
  id: string;
  role: string;
  modulo: string;
  permissao: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const useRolePermissions = () => {
  const queryClient = useQueryClient();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .order('role', { ascending: true })
        .order('modulo', { ascending: true });

      if (error) throw error;
      return data as RolePermission[];
    },
  });

  const updatePermission = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('role_permissions')
        .update({ ativo })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast.success('Permissão atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar permissão');
      console.error(error);
    },
  });

  return {
    permissions,
    isLoading,
    updatePermission: updatePermission.mutate,
  };
};
