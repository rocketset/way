import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/types/editor';
import { renderEditorBlock } from '@/utils/blockRenderer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BlogPostPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID do post não encontrado');
      setLoading(false);
      return;
    }

    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar post com dados relacionados
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          categories (nome),
          profiles (nome)
        `)
        .eq('id', id)
        .single();

      if (postError) throw postError;
      if (!postData) throw new Error('Post não encontrado');

      // Verificar permissão para ver rascunhos
      if (postData.status !== 'published' && !user) {
        setError('Preview de rascunhos disponível apenas para usuários autenticados');
        setLoading(false);
        return;
      }

      setPost(postData);

      // Buscar tags do post
      const { data: postTags, error: tagsError } = await supabase
        .from('post_tags')
        .select('tags (id, nome)')
        .eq('post_id', id);

      if (!tagsError && postTags) {
        setTags(postTags.map(pt => pt.tags).filter(Boolean));
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Erro ao carregar post:', err);
      setError(err.message || 'Erro ao carregar post');
      setLoading(false);
    }
  };

  const handleBackToEditor = () => {
    navigate(`/admin/blog/posts/edit/${id}`);
  };

  const handleClose = () => {
    window.close();
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Erro ao Carregar Preview</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/admin/blog/posts')} variant="outline">
            Voltar para Lista de Posts
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse content from JSON string
  let contentBlocks: any[] = [];
  try {
    contentBlocks = JSON.parse(post.conteudo);
  } catch (err) {
    console.error('Erro ao parsear conteúdo:', err);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-yellow-500 text-yellow-950 py-3 px-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Modo Preview</span>
            <Badge variant="outline" className="bg-yellow-400 text-yellow-950 border-yellow-600">
              {post.status === 'published' ? 'Publicado' : 'Rascunho'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleBackToEditor}
              size="sm"
              variant="secondary"
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Editor
            </Button>
            <Button
              onClick={handleClose}
              size="sm"
              variant="ghost"
              className="text-yellow-950 hover:bg-yellow-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Header />

      {/* Hero Image */}
      {post.featured_image && (
        <div className="w-full h-[400px] overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Title Section */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.categories && (
              <Badge variant="default" className="bg-primary text-primary-foreground">
                {post.categories.nome}
              </Badge>
            )}
            {tags.map((tag: any) => (
              <Badge key={tag.id} variant="outline">
                {tag.nome}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.titulo}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              {format(new Date(post.criado_em), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
            {post.reading_time > 0 && (
              <>
                <span>•</span>
                <span>{post.reading_time} min de leitura</span>
              </>
            )}
            {post.profiles && (
              <>
                <span>•</span>
                <span>Por {post.profiles.nome}</span>
              </>
            )}
          </div>
        </header>

        {/* Post Content Blocks */}
        <div className="prose prose-lg max-w-none
          prose-headings:text-foreground prose-headings:font-bold
          prose-h2:text-3xl prose-h2:text-primary
          prose-p:text-foreground/80 prose-p:leading-relaxed
          prose-ul:text-foreground/80
          prose-a:text-primary prose-a:underline
          [&_a]:text-primary [&_a]:underline [&_a]:cursor-pointer">
          {contentBlocks.length > 0 ? (
            contentBlocks.map((block, index) => renderEditorBlock(block, index))
          ) : (
            <p className="text-muted-foreground italic">
              Este post ainda não possui conteúdo.
            </p>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
