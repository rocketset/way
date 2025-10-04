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
}

export const useBlogPosts = (searchQuery?: string, selectedCategory?: string) => {
  return useQuery({
    queryKey: ['blog-posts', searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          id,
          titulo,
          excerpt,
          featured_image,
          slug,
          criado_em,
          reading_time,
          is_featured,
          autor_id,
          profiles!posts_autor_id_fkey(nome)
        `)
        .eq('publicado', true)
        .eq('status', 'published')
        .order('criado_em', { ascending: false });

      const { data: posts, error } = await query;

      if (error) throw error;

      // Buscar categorias e tags para cada post
      const postsWithDetails = await Promise.all(
        (posts || []).map(async (post) => {
          // Buscar categorias
          const { data: postCategories } = await supabase
            .from('post_categories')
            .select('category_id, categories!inner(nome)')
            .eq('post_id', post.id);

          // Buscar tags
          const { data: postTags } = await supabase
            .from('post_tags')
            .select('tag_id, tags!inner(nome)')
            .eq('post_id', post.id);

          const categorias = postCategories?.map((pc: any) => pc.categories.nome) || [];
          const tags = postTags?.map((pt: any) => pt.tags.nome) || [];

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
            autor_nome: (post.profiles as any)?.nome || 'Autor',
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

      return { featured, regular, all: filtered };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
