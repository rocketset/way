import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthorCard from "@/components/AuthorCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlogPost";
import { formatDate, formatReadingTime } from "@/utils/dateUtils";
import { renderEditorBlock } from "@/utils/blockRenderer";
import { useToast } from "@/hooks/use-toast";

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const { data: post, isLoading, error } = useBlogPost(slug);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.titulo,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para a área de transferência.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-20">
          <div className="relative h-[500px] md:h-[600px]">
            <Skeleton className="w-full h-full" />
          </div>
        </section>
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Post não encontrado</h1>
            <p className="text-muted-foreground">
              O post que você está procurando não existe ou não está mais disponível.
            </p>
            <Button asChild>
              <Link to="/blog">Voltar ao Blog</Link>
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button - Mobile only acima da imagem */}
      <div className="md:hidden bg-background pt-24 pb-4 px-[10px]">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 bg-card backdrop-blur-sm border border-border text-foreground hover:text-primary hover:border-primary transition-all duration-300 px-4 py-2 rounded-full group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Voltar</span>
        </Link>
      </div>

      {/* Hero Image */}
      <section className="pt-0">
        <div className="relative h-auto md:h-[600px] overflow-hidden">
          <img
            src={post.featured_image || '/placeholder.svg'}
            alt={post.titulo}
            className="w-full h-auto md:h-full object-contain md:object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent hidden md:block" />
          
          {/* Back Button - Desktop only */}
          <div className="hidden md:block absolute top-8 left-4 md:left-8 z-10">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border text-foreground hover:text-primary hover:border-primary transition-all duration-300 px-4 py-2 rounded-full group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Voltar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Title Section */}
      <section className="py-12 px-[10px] md:px-4">
        <div className="md:container md:mx-auto">
          <div className="md:max-w-6xl md:mx-auto space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-primary text-primary-foreground">
                {post.categorias[0] || 'Blog'}
              </Badge>
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-border text-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              {post.titulo}
            </h1>

            <p className="text-xl text-muted-foreground">
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
              <AuthorCard
                authorId={post.autor_id}
                authorName={post.autor_nome}
                authorAvatar={post.autor_avatar}
                authorRole={post.autor_cargo}
                showRole={true}
              />
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.criado_em)}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatReadingTime(post.reading_time || 5)} de leitura</span>
              </div>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-16 px-0 md:px-4">
        <div className="md:container md:mx-auto">
          <div className="md:max-w-6xl md:mx-auto">
            <div className="bg-card md:rounded-3xl p-4 md:p-12 md:border md:border-border">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                  prose-h2:text-3xl prose-h2:text-primary
                  prose-h3:text-2xl
                  prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
                  prose-ul:text-foreground/80 prose-ul:my-6
                  prose-li:mb-2
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              >
                {Array.isArray(post.conteudo) && post.conteudo.length > 0 ? (
                  post.conteudo.map((block, index) => renderEditorBlock(block, index, post.id))
                ) : (
                  <p>Conteúdo não disponível</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {post.related && post.related.length > 0 && (
        <section className="py-16 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Outros posts relacionados
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {post.related.map((relatedPost: any) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative overflow-hidden aspect-video">
                        <Badge className="absolute top-4 left-4 z-10 bg-card text-foreground border-border">
                          {relatedPost.categoria}
                        </Badge>
                        <img
                          src={relatedPost.featured_image || '/placeholder.svg'}
                          alt={relatedPost.titulo}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                          {relatedPost.titulo}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4 flex-1">
                          {relatedPost.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                          <span>{formatDate(relatedPost.criado_em)}</span>
                          <span>•</span>
                          <span>{formatReadingTime(relatedPost.reading_time || 5)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
