import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/editor';

/**
 * Hook para buscar todas as tags do tipo 'blog'
 * Retorna array de tags ordenado por nome
 * Usa React Query para cache (5 minutos)
 */
export const useBlogTags = () => {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('tipo', 'blog')
        .order('nome');
      
      if (error) throw error;
      return (data || []) as Tag[];
    },
    staleTime: 300000, // 5 minutos
  });
};
