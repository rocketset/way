import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { formatDate, formatReadingTime } from "@/utils/dateUtils";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [visiblePosts, setVisiblePosts] = useState(6);

  const { data: categoriesData, isLoading: categoriesLoading } = useBlogCategories();
  const { data: postsData, isLoading: postsLoading } = useBlogPosts(searchQuery, selectedCategory);

  const categories = ["Todos", ...(categoriesData?.map((c) => c.nome) || [])];
  const featuredPosts = postsData?.featured || [];
  const regularPosts = postsData?.regular.slice(0, visiblePosts) || [];
  const hasMorePosts = (postsData?.regular.length || 0) > visiblePosts;

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <Badge className="bg-card text-muted-foreground border-border px-4 py-2 text-sm font-medium">
                Insights, estratégias e novidades do mundo digital
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold">
              Blog da <span className="text-primary">Way</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acompanhe artigos sobre e-commerce, marketing digital, tecnologia e 
              as melhores práticas para crescer seu negócio online.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all duration-300"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categoriesLoading ? (
                <>
                  <Skeleton className="h-10 w-24 rounded-full" />
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`rounded-full transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                        : "bg-card border-border text-foreground hover:bg-card/80 hover:border-primary"
                    }`}
                  >
                    {category}
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <div className="relative bg-card rounded-3xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-2/5 relative overflow-hidden">
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-card text-foreground border-border">
                            {post.categorias[0] || 'Blog'}
                          </Badge>
                        </div>
                        <img
                          src={post.featured_image || '/placeholder.svg'}
                          alt={post.titulo}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent md:hidden" />
                      </div>

                      {/* Content */}
                      <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                        <div className="space-y-4">
                          <h2 className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {post.titulo}
                          </h2>
                          
                          <p className="text-lg text-muted-foreground">
                            {post.excerpt}
                          </p>
                          
                          <p className="text-foreground/80 line-clamp-2">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-300"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.criado_em)}</span>
                            </div>
                            <span>•</span>
                            <span>{formatReadingTime(post.reading_time)} de leitura</span>
                          </div>

                          {/* CTA */}
                          <div className="pt-4">
                            <Button
                              variant="ghost"
                              className="text-primary hover:text-primary hover:bg-primary/10 group/btn p-0"
                            >
                              <span className="mr-2">Ver post completo</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {postsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : regularPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhum post encontrado. Ajuste os filtros ou volte em breve para novos conteúdos!
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group"
                    >
                      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-video">
                          <div className="absolute top-4 left-4 z-10">
                            <Badge className="bg-card text-foreground border-border">
                              {post.categorias[0] || 'Blog'}
                            </Badge>
                          </div>
                          <img
                            src={post.featured_image || '/placeholder.svg'}
                            alt={post.titulo}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="space-y-3 flex-1">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                              {post.titulo}
                            </h3>
                            
                            <p className="text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-primary/10 text-primary border-primary/20 text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground border-t border-border mt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.criado_em)}</span>
                            </div>
                            <span>•</span>
                            <span>{formatReadingTime(post.reading_time)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMorePosts && (
                  <div className="text-center mt-12">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary px-8 py-6 text-lg rounded-full"
                    >
                      Ver mais cases
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
