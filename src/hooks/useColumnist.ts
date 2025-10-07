import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Columnist {
  id: string;
  nome: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  cargo: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  site_pessoal: string | null;
  totalPosts: number;
  categorias: string[];
}

export interface ColumnistPost {
  id: string;
  titulo: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  criado_em: string;
  reading_time: number;
  categorias: string[];
}

export const useColumnist = (columnistId: string | undefined) => {
  return useQuery({
    queryKey: ['columnist', columnistId],
    queryFn: async () => {
      if (!columnistId) throw new Error('Columnist ID is required');

      // Buscar dados do colunista
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', columnistId)
        .eq('is_colunista', true)
        .single();

      if (profileError || !profile) {
        throw new Error('Colunista não encontrado');
      }

      // Buscar posts do colunista
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, titulo, slug, excerpt, featured_image, criado_em, reading_time')
        .eq('autor_id', columnistId)
        .eq('publicado', true)
        .eq('status', 'published')
        .order('criado_em', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
      }

      const postsData = posts || [];

      // Buscar categorias dos posts
      const postsWithCategories: ColumnistPost[] = await Promise.all(
        postsData.map(async (post) => {
          const { data: postCategories } = await supabase
            .from('post_categories')
            .select(`
              category_id,
              categories (
                nome
              )
            `)
            .eq('post_id', post.id);

          const categorias = postCategories?.map((pc: any) => pc.categories?.nome).filter(Boolean) || [];

          return {
            ...post,
            categorias,
          };
        })
      );

      // Calcular categorias únicas
      const allCategories = postsWithCategories.flatMap(post => post.categorias);
      const uniqueCategories = [...new Set(allCategories)];

      const columnist: Columnist = {
        id: profile.id,
        nome: profile.nome,
        email: profile.email,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        cargo: profile.cargo,
        instagram: profile.instagram,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        site_pessoal: profile.site_pessoal,
        totalPosts: postsData.length,
        categorias: uniqueCategories,
      };

      return {
        columnist,
        posts: postsWithCategories,
      };
    },
    enabled: !!columnistId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
