// Página Blog Way - Posts do blog visíveis para membros
// Exibe os posts publicados do blog dentro da área de membros

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, User, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type BlogPost = {
  id: string;
  titulo: string;
  excerpt: string | null;
  featured_image: string | null;
  slug: string;
  criado_em: string;
  reading_time: number;
  autor: {
    nome: string;
    avatar_url: string | null;
  } | null;
  categories: Array<{ nome: string }>;
};

type Category = {
  id: string;
  nome: string;
};

export default function BlogWay() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchPosts(), fetchCategories()]);
    setLoading(false);
  };

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          id,
          titulo,
          excerpt,
          featured_image,
          slug,
          criado_em,
          reading_time,
          autor_id
        `)
        .eq('publicado', true)
        .order('criado_em', { ascending: false });

      if (error) throw error;

      // Busca informações do autor e categorias para cada post
      const postsWithDetails = await Promise.all(
        (postsData || []).map(async (post) => {
          // Busca autor
          const { data: autorData } = await supabase
            .from('profiles')
            .select('nome, avatar_url')
            .eq('id', post.autor_id)
            .single();

          // Busca categorias
          const { data: categoriesData } = await supabase
            .from('post_categories')
            .select(`
              category:categories(nome)
            `)
            .eq('post_id', post.id);

          return {
            ...post,
            autor: autorData,
            categories: categoriesData?.map((c: any) => ({ nome: c.category.nome })) || []
          };
        })
      );

      setPosts(postsWithDetails as BlogPost[]);
    } catch (error: any) {
      console.error('Erro ao carregar posts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nome')
        .eq('tipo', 'blog')
        .order('nome');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.categories.some(cat => cat.nome === categories.find(c => c.id === selectedCategory)?.nome);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com gradiente */}
      <div className="relative h-[200px] rounded-lg overflow-hidden bg-gradient-to-r from-primary to-primary/80 flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog Way
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Conteúdos, insights e novidades sobre e-commerce e marketing digital
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Posts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id}
            className="hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
          >
            {post.featured_image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {post.categories.slice(0, 2).map((cat, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {cat.nome}
                  </Badge>
                ))}
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                {post.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-4">
                  {post.autor && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.autor.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {post.autor.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.autor.nome}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(post.criado_em).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum post encontrado com os filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
