import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useColumnist } from "@/hooks/useColumnist";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram, Linkedin, Twitter, Globe, User } from "lucide-react";
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

        {/* Hero Section - Social Media Style Profile */}
        <div className="relative mb-16">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl -z-10" />
          
          <div className="flex flex-col items-center text-center py-12 px-8 animate-fade-in">
            {/* Avatar with animation */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-background shadow-2xl transform transition-transform duration-500 group-hover:scale-110">
                {columnist.avatar_url ? (
                  <img 
                    src={columnist.avatar_url} 
                    alt={columnist.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-20 h-20 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Name and Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-scale-in">
              {columnist.nome}
            </h1>
            {columnist.cargo && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in">
                {columnist.cargo}
              </p>
            )}

            {/* Stats Row */}
            <div className="flex gap-12 mb-8 animate-fade-in">
              <div className="group cursor-default">
                <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {columnist.totalPosts}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Artigos Publicados</p>
              </div>
              {columnist.categorias.length > 0 && (
                <div className="group cursor-default">
                  <p className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {columnist.categorias.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Categorias</p>
                </div>
              )}
            </div>

            {/* Bio */}
            {columnist.bio && (
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg max-w-2xl animate-fade-in">
                {columnist.bio}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4 mb-8 animate-fade-in">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900/50 hover:from-primary hover:to-accent transition-all duration-500 flex items-center justify-center hover:scale-125 hover:rotate-12 shadow-lg hover:shadow-2xl hover:shadow-primary/50"
                    aria-label={link.label}
                  >
                    <link.icon className="w-6 h-6 text-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        {columnist.categorias.length > 0 && (
          <div className="mb-16 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full"></div>
              <h2 className="text-2xl font-bold">Categorias que escreve</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {columnist.categorias.map((categoria, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-base py-2 px-5 hover:scale-110 hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default shadow-lg hover:shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {categoria}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Section */}
        <div className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10 animate-pulse" style={{ animationDuration: '3s' }} />
          
          <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-3xl border-2 border-primary/30 p-8 md:p-12 shadow-2xl hover:shadow-primary/20 transition-all duration-700">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-2 w-20 bg-gradient-to-r from-primary via-accent to-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
                Artigos de {columnist.nome}
              </h2>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900/50 flex items-center justify-center animate-bounce">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xl">
                  Nenhum artigo publicado ainda.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Posts */}
                {posts.filter(post => post.destaque).length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-1.5 w-12 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                      <h3 className="text-2xl font-bold text-foreground/90">Em Destaque</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.filter(post => post.destaque).map((post, index) => (
                        <Link
                          key={post.id}
                          to={`/blog/${post.slug}`}
                          className="group relative bg-background/95 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-accent/50 hover:border-accent shadow-xl hover:shadow-2xl hover:shadow-accent/30 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {post.featured_image && (
                            <div className="aspect-video overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                              <img
                                src={post.featured_image}
                                alt={post.titulo}
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                              />
                            </div>
                          )}
                          <div className="p-6 relative z-10">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.categorias.map((cat, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-accent/50 text-accent">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
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
                  </div>
                )}

                {/* All Posts */}
                {posts.filter(post => !post.destaque).length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-1.5 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                      <h3 className="text-2xl font-bold text-foreground/90">Todos os Artigos</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.filter(post => !post.destaque).map((post, index) => (
                        <Link
                          key={post.id}
                          to={`/blog/${post.slug}`}
                          className="group relative bg-background/95 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary/60 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {post.featured_image && (
                            <div className="aspect-video overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                              <img
                                src={post.featured_image}
                                alt={post.titulo}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                          )}
                          <div className="p-6 relative z-10">
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Columnist;
