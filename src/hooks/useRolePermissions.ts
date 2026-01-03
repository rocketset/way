import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface RolePermission {
  id: string;
  role: AppRole;
  modulo: string;
  permissao: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

// Todos os módulos e permissões disponíveis no sistema
export const ALL_MODULES = ['usuarios', 'blog', 'cases', 'academy', 'landing_pages', 'popups', 'briefings', 'carreiras', 'configuracoes', 'media'];
export const ALL_PERMISSIONS = ['visualizar', 'criar', 'editar', 'excluir'];

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

  const createPermission = useMutation({
    mutationFn: async ({ role, modulo, permissao, ativo }: { role: AppRole; modulo: string; permissao: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('role_permissions')
        .insert({ role, modulo, permissao, ativo });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast.success('Permissão criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar permissão');
      console.error(error);
    },
  });

  const deletePermission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('role_permissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast.success('Permissão removida com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover permissão');
      console.error(error);
    },
  });

  // Função para garantir que todas as permissões existam para um role
  const ensureAllPermissionsExist = async (role: AppRole) => {
    const existingPerms = permissions.filter(p => p.role === role);
    const existingKeys = new Set(existingPerms.map(p => `${p.modulo}-${p.permissao}`));
    
    const missingPermissions: Array<{ role: AppRole; modulo: string; permissao: string; ativo: boolean }> = [];
    
    for (const modulo of ALL_MODULES) {
      for (const permissao of ALL_PERMISSIONS) {
        const key = `${modulo}-${permissao}`;
        if (!existingKeys.has(key)) {
          missingPermissions.push({ role, modulo, permissao, ativo: false });
        }
      }
    }
    
    if (missingPermissions.length > 0) {
      const { error } = await supabase
        .from('role_permissions')
        .insert(missingPermissions);
      
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    }
  };

  return {
    permissions,
    isLoading,
    updatePermission: updatePermission.mutate,
    createPermission: createPermission.mutate,
    deletePermission: deletePermission.mutate,
    ensureAllPermissionsExist,
  };
};
