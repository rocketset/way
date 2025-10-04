import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBlogPost = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');

      const { data: post, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_autor_id_fkey(nome, email)
        `)
        .eq('slug', slug)
        .eq('publicado', true)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      if (!post) throw new Error('Post not found');

      // Buscar categorias
      const { data: postCategories } = await supabase
        .from('post_categories')
        .select('category_id, categories!inner(id, nome)')
        .eq('post_id', post.id);

      // Buscar tags
      const { data: postTags } = await supabase
        .from('post_tags')
        .select('tag_id, tags!inner(nome)')
        .eq('post_id', post.id);

      const categorias = postCategories?.map((pc: any) => pc.categories.nome) || [];
      const tags = postTags?.map((pt: any) => pt.tags.nome) || [];
      const categoryIds = postCategories?.map((pc: any) => pc.categories.id) || [];

      // Buscar posts relacionados (mesma categoria, excluindo o atual)
      const { data: relatedPosts } = await supabase
        .from('post_categories')
        .select(`
          post_id,
          posts!inner(
            id,
            titulo,
            slug,
            excerpt,
            featured_image,
            criado_em,
            reading_time
          )
        `)
        .in('category_id', categoryIds)
        .neq('post_id', post.id)
        .limit(3);

      const related = relatedPosts
        ?.map((rp: any) => ({
          ...rp.posts,
          categoria: categorias[0] || 'Blog',
        }))
        .slice(0, 3) || [];

      return {
        ...post,
        categorias,
        tags,
        autor_nome: (post.profiles as any)?.nome || 'Autor',
        autor_email: (post.profiles as any)?.email || '',
        conteudo: typeof post.conteudo === 'string' ? JSON.parse(post.conteudo) : post.conteudo,
        related,
      };
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
