import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface ConfiguredRole {
  id: AppRole;
  label: string;
  permissionsCount: number;
}

const roleLabels: Record<string, string> = {
  administrador: 'Administrador',
  gestor_conteudo: 'Gestor de Conteúdo',
  colunista: 'Colunista',
  cliente: 'Cliente',
  membro: 'Membro',
};

// Roles que sempre devem aparecer (base do sistema)
const BASE_ROLES: AppRole[] = ['administrador'];

export const useConfiguredRoles = () => {
  return useQuery({
    queryKey: ['configured-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('role');

      if (error) throw error;

      // Conta permissões por role
      const roleCounts: Record<string, number> = {};
      data?.forEach(item => {
        roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
      });

      // Retorna apenas roles que têm permissões configuradas + roles base
      const configuredRoles: ConfiguredRole[] = [];
      
      // Adiciona roles base primeiro
      BASE_ROLES.forEach(role => {
        configuredRoles.push({
          id: role,
          label: roleLabels[role] || role,
          permissionsCount: roleCounts[role] || 0,
        });
      });

      // Adiciona outras roles que têm permissões
      Object.entries(roleCounts).forEach(([role, count]) => {
        if (!BASE_ROLES.includes(role as AppRole) && count > 0) {
          configuredRoles.push({
            id: role as AppRole,
            label: roleLabels[role] || role,
            permissionsCount: count,
          });
        }
      });

      return configuredRoles;
    },
  });
};

// Todos os roles do enum (para mostrar no dialog de gerenciamento)
export const ALL_ENUM_ROLES: AppRole[] = ['administrador', 'gestor_conteudo', 'colunista', 'cliente', 'membro'];

export const getRoleLabel = (role: string): string => roleLabels[role] || role;
