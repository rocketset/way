// Hook para carregar e transformar menu dinâmico do banco de dados

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mail,
  Users,
  Eye,
  GraduationCap,
  HeadphonesIcon,
  CheckSquare,
  Heart,
  Settings,
  type LucideIcon,
} from 'lucide-react';

// Mapa de ícones string -> componente
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mail,
  Users,
  Eye,
  GraduationCap,
  HeadphonesIcon,
  CheckSquare,
  Heart,
  Settings,
};

interface DbMenuItem {
  id: string;
  menu_key: string;
  menu_label: string;
  menu_path: string | null;
  menu_icon: string | null;
  roles: string[];
  parent_key: string | null;
  ordem: number;
  is_separator: boolean;
  ativo: boolean;
}

export interface DynamicMenuItem {
  icon?: LucideIcon;
  label: string;
  path: string;
  roles: string[];
  separator?: boolean;
  hasCategories?: boolean;
  subItems?: Array<{
    label: string;
    path: string;
    roles?: string[];
    badge?: string;
  }>;
}

// Itens especiais que precisam de configurações extras
const SPECIAL_ITEMS: Record<string, Partial<DynamicMenuItem>> = {
  way_academy: { hasCategories: true },
};

export function useDynamicMenu() {
  const { data: dbMenuItems, isLoading, error } = useQuery({
    queryKey: ['dynamic-menu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_visibility')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as DbMenuItem[];
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    gcTime: 1000 * 60 * 10,
  });

  const menuItems = useMemo(() => {
    if (!dbMenuItems) return [];

    // Separa itens principais dos subitens
    const mainItems = dbMenuItems.filter(item => !item.parent_key);
    const subItemsMap = dbMenuItems
      .filter(item => item.parent_key)
      .reduce((acc, item) => {
        if (!acc[item.parent_key!]) acc[item.parent_key!] = [];
        acc[item.parent_key!].push(item);
        return acc;
      }, {} as Record<string, DbMenuItem[]>);

    // Transforma para o formato esperado
    return mainItems.map((item): DynamicMenuItem => {
      const Icon = item.menu_icon ? ICON_MAP[item.menu_icon] : undefined;
      const subItems = subItemsMap[item.menu_key];
      const specialConfig = SPECIAL_ITEMS[item.menu_key];

      if (item.is_separator) {
        return {
          label: item.menu_label,
          path: '',
          roles: item.roles || [],
          separator: true,
        };
      }

      const menuItem: DynamicMenuItem = {
        icon: Icon,
        label: item.menu_label,
        path: item.menu_path || '',
        roles: item.roles || [],
        ...specialConfig,
      };

      if (subItems && subItems.length > 0) {
        menuItem.subItems = subItems
          .sort((a, b) => a.ordem - b.ordem)
          .map(sub => {
            const subSpecial = SPECIAL_ITEMS[sub.menu_key];
            return {
              label: sub.menu_label,
              path: sub.menu_path || '',
              roles: sub.roles,
              ...(subSpecial?.subItems?.[0]?.badge ? { badge: subSpecial.subItems[0].badge } : {}),
            };
          });
      }

      return menuItem;
    });
  }, [dbMenuItems]);

  return {
    menuItems,
    isLoading,
    error,
  };
}
