import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ColumnistSummary {
  id: string;
  nome: string;
  email: string;
  avatar_url: string | null;
  cargo: string | null;
  bio: string | null;
  totalPosts: number;
}

export const useColumnists = () => {
  return useQuery({
    queryKey: ['columnists'],
    queryFn: async () => {
      // Buscar todos os colunistas ativos
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome, email, avatar_url, cargo, bio')
        .eq('is_colunista', true);

      if (profilesError) {
        console.error('Error fetching columnists:', profilesError);
        throw profilesError;
      }

      if (!profiles) return [];

      // Para cada colunista, contar quantos posts publicados ele tem
      const columnistsWithPosts = await Promise.all(
        profiles.map(async (profile) => {
          const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('autor_id', profile.id)
            .eq('publicado', true)
            .eq('status', 'published');

          return {
            ...profile,
            totalPosts: count || 0,
          };
        })
      );

      // Filtrar apenas colunistas que têm pelo menos 1 post publicado
      return columnistsWithPosts.filter(c => c.totalPosts > 0);
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
