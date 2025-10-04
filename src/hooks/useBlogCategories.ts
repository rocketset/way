import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nome')
        .eq('tipo', 'blog')
        .order('nome');

      if (error) throw error;
      
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};
