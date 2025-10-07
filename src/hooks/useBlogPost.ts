import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBlogPost = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');

      // Buscar o post
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        throw error;
      }
      
      if (!post) throw new Error('Post not found');

      // Buscar autor
      let autorNome = 'Autor';
      let autorEmail = '';
      let autorAvatar = null;
      let autorCargo = null;
      if (post.autor_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nome, email, avatar_url, cargo')
          .eq('id', post.autor_id)
          .single();
        
        if (profile) {
          autorNome = profile.nome;
          autorEmail = profile.email;
          autorAvatar = profile.avatar_url;
          autorCargo = profile.cargo;
        }
      }

      // Buscar categorias
      const { data: postCategories } = await supabase
        .from('post_categories')
        .select(`
          category_id,
          categories (
            id,
            nome
          )
        `)
        .eq('post_id', post.id);

      // Buscar tags
      const { data: postTags } = await supabase
        .from('post_tags')
        .select(`
          tags (
            nome
          )
        `)
        .eq('post_id', post.id);

      const categorias = postCategories?.map((pc: any) => pc.categories?.nome).filter(Boolean) || [];
      const tags = postTags?.map((pt: any) => pt.tags?.nome).filter(Boolean) || [];
      const categoryIds = postCategories?.map((pc: any) => pc.categories?.id).filter(Boolean) || [];

      // Buscar posts relacionados (mesma categoria, excluindo o atual)
      let related: any[] = [];
      if (categoryIds.length > 0) {
        const { data: relatedPostCategories } = await supabase
          .from('post_categories')
          .select('post_id')
          .in('category_id', categoryIds)
          .neq('post_id', post.id)
          .limit(10);

        if (relatedPostCategories && relatedPostCategories.length > 0) {
          const relatedPostIds = relatedPostCategories.map((rpc: any) => rpc.post_id);
          
          const { data: relatedPosts } = await supabase
            .from('posts')
            .select('id, titulo, slug, excerpt, featured_image, criado_em, reading_time')
            .in('id', relatedPostIds)
            .eq('publicado', true)
            .eq('status', 'published')
            .limit(3);

          related = relatedPosts?.map((rp: any) => ({
            ...rp,
            categoria: categorias[0] || 'Blog',
          })) || [];
        }
      }

      return {
        ...post,
        categorias,
        tags,
        autor_nome: autorNome,
        autor_email: autorEmail,
        autor_avatar: autorAvatar,
        autor_cargo: autorCargo,
        conteudo: typeof post.conteudo === 'string' ? JSON.parse(post.conteudo) : post.conteudo,
        related,
      };
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
