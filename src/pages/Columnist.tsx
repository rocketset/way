import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useColumnist } from "@/hooks/useColumnist";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram, Linkedin, Twitter, Globe, ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Columnist = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useColumnist(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <Skeleton className="w-48 h-48 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Colunista não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O colunista que você está procurando não existe ou não está disponível.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { columnist, posts } = data;

  const socialLinks = [
    { icon: Instagram, url: columnist.instagram, label: "Instagram" },
    { icon: Linkedin, url: columnist.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: columnist.twitter, label: "Twitter" },
    { icon: Globe, url: columnist.site_pessoal, label: "Site Pessoal" },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{columnist.nome} - Colunista Way Blog</title>
        <meta name="description" content={columnist.bio || `Artigos de ${columnist.nome}`} />
        <meta property="og:title" content={`${columnist.nome} - Colunista Way Blog`} />
        <meta property="og:description" content={columnist.bio || `Artigos de ${columnist.nome}`} />
        {columnist.avatar_url && <meta property="og:image" content={columnist.avatar_url} />}
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Blog
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
          <div className="w-48 h-48 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 border-4 border-primary/20">
            {columnist.avatar_url ? (
              <img 
                src={columnist.avatar_url} 
                alt={columnist.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-2">{columnist.nome}</h1>
            {columnist.cargo && (
              <p className="text-xl text-muted-foreground mb-4">{columnist.cargo}</p>
            )}
            {columnist.bio && (
              <p className="text-muted-foreground mb-6 leading-relaxed text-lg">{columnist.bio}</p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mb-6">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center hover:scale-110"
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{columnist.totalPosts}</p>
                <p className="text-sm text-muted-foreground">Artigos Publicados</p>
              </div>
              {columnist.categorias.length > 0 && (
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{columnist.categorias.length}</p>
                  <p className="text-sm text-muted-foreground">Categorias</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        {columnist.categorias.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-4">Categorias que escreve:</h2>
            <div className="flex flex-wrap gap-2">
              {columnist.categorias.map((categoria, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {categoria}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-card/50 rounded-2xl border-2 border-primary/10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-primary rounded-full"></div>
            <h2 className="text-3xl font-bold">Artigos em Destaque de {columnist.nome}</h2>
          </div>
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-16 text-lg">
              Nenhum artigo publicado ainda.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-background rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                >
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categorias.map((cat, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.titulo}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(post.criado_em).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span>{post.reading_time} min de leitura</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Columnist;
