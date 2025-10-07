import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  titulo: string;
  excerpt: string;
  featured_image: string | null;
  slug: string;
  criado_em: string;
  reading_time: number;
  is_featured: boolean;
  categorias: string[];
  tags: string[];
  autor_nome: string;
  autor_id: string;
  autor_avatar: string | null;
}

export const useBlogPosts = (searchQuery?: string, selectedCategory?: string) => {
  return useQuery({
    queryKey: ['blog-posts', searchQuery, selectedCategory],
    queryFn: async () => {
      // Buscar posts publicados
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('publicado', true)
        .eq('status', 'published')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      if (!posts || posts.length === 0) {
        console.log('No posts found');
        return { featured: [], regular: [], all: [] };
      }

      console.log('Posts fetched:', posts.length);

      // Buscar detalhes adicionais para cada post
      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          // Buscar autor
          let autorNome = 'Autor';
          let autorAvatar = null;
          if (post.autor_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('nome, avatar_url')
              .eq('id', post.autor_id)
              .single();
            
            if (profile) {
              autorNome = profile.nome;
              autorAvatar = profile.avatar_url;
            }
          }

          // Buscar categorias
          const { data: postCategories } = await supabase
            .from('post_categories')
            .select(`
              categories (
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

          return {
            id: post.id,
            titulo: post.titulo,
            excerpt: post.excerpt || '',
            featured_image: post.featured_image,
            slug: post.slug,
            criado_em: post.criado_em,
            reading_time: post.reading_time || 5,
            is_featured: post.is_featured || false,
            categorias,
            tags,
            autor_nome: autorNome,
            autor_id: post.autor_id,
            autor_avatar: autorAvatar,
          };
        })
      );

      // Filtrar por busca
      let filtered = postsWithDetails;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.titulo.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query)
        );
      }

      // Filtrar por categoria
      if (selectedCategory && selectedCategory !== 'Todos') {
        filtered = filtered.filter((post) =>
          post.categorias.some((cat) => cat === selectedCategory)
        );
      }

      // Separar featured e regulares
      const featured = filtered.filter((p) => p.is_featured);
      const regular = filtered.filter((p) => !p.is_featured);

      console.log('Filtered posts - Featured:', featured.length, 'Regular:', regular.length);

      return { featured, regular, all: filtered };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
