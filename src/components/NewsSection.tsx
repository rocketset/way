import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const blogPosts = posts?.all?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section id="noticias" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-foreground">Conteúdos Way</h2>
          </div>
          <div className="text-center text-muted-foreground">Carregando...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="noticias" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 animate-fade-in text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Conteúdos Way</h2>
          <p className="text-muted-foreground">
            As novidades que estão virando o jogo no digital
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full animate-fade-in"
        >
          <CarouselContent className="-ml-4">
            {blogPosts.map((post) => (
              <CarouselItem key={post.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Link to={`/blog/${post.slug}`} className="block group">
                  <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 h-full">
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl text-primary/30">📰</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-bold text-primary">
                          {format(new Date(post.criado_em), "dd MMM", { locale: ptBR }).toUpperCase()}
                        </span>
                        {post.categorias && post.categorias.length > 0 && (
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {post.categorias[0].nome}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.titulo}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                      <span className="text-primary font-semibold group-hover:underline inline-flex items-center gap-2">
                        Ler artigo
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
            <CarouselNext className="relative right-0 top-0 translate-y-0" />
          </div>
        </Carousel>

        <div className="text-center mt-12 animate-fade-in">
          <Link to="/blog">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              Ir para o Blog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;