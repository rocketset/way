import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthorCard from "@/components/AuthorCard";
import ShareButtons from "@/components/ShareButtons";
import Comments from "@/components/Comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlogPost";
import { formatDate, formatReadingTime } from "@/utils/dateUtils";
import { renderEditorBlock } from "@/utils/blockRenderer";

const BlogPost = () => {
  const { slug } = useParams();
  const { data: post, isLoading, error } = useBlogPost(slug);

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
      <div className="md:hidden bg-background pt-24 pb-4 px-4">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 bg-card backdrop-blur-sm border border-border text-foreground hover:text-primary hover:border-primary transition-all duration-300 px-4 py-2 rounded-full group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Voltar</span>
        </Link>
      </div>

      {/* Hero Image */}
      <section className="pt-24 md:pt-28 pb-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Back Button - Desktop only */}
            <div className="hidden md:block mb-6">
              <Link 
                to="/blog"
                className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border text-foreground hover:text-primary hover:border-primary transition-all duration-300 px-4 py-2 rounded-full group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Voltar</span>
              </Link>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-border">
              <img
                src={post.featured_image || '/placeholder.svg'}
                alt={post.titulo}
                className="w-full h-auto object-cover"
              />
            </div>
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
            </div>

            {/* Share Buttons */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Compartilhar:</h3>
              <ShareButtons 
                title={post.titulo}
                excerpt={post.excerpt}
                url={window.location.href}
              />
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

      {/* Author Bio Section */}
      {post.autor_bio && (
        <section className="pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/50 border border-border rounded-3xl p-8 md:p-12 group hover:border-primary/50 transition-all duration-500">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  {/* Avatar */}
                  <Link 
                    to={`/colunista/${post.autor_id}`}
                    className="flex-shrink-0 group/avatar"
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-muted ring-4 ring-primary/20 group-hover/avatar:ring-primary/40 transition-all duration-300">
                      {post.autor_avatar ? (
                        <img 
                          src={post.autor_avatar} 
                          alt={post.autor_nome}
                          className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Bio Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <Link 
                        to={`/colunista/${post.autor_id}`}
                        className="inline-block"
                      >
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {post.autor_nome}
                        </h3>
                      </Link>
                      {post.autor_cargo && (
                        <p className="text-sm text-primary font-medium mt-1">
                          {post.autor_cargo}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {post.autor_bio}
                    </p>

                    <Link 
                      to={`/colunista/${post.autor_id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-300"
                    >
                      Ver todos os artigos
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border">
              <Comments postId={post.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Comments postId={post.id} />
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Comments postId={post.id} />
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
