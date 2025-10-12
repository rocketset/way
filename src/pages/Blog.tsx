import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthorCard from "@/components/AuthorCard";
import ColumnistsSection from "@/components/ColumnistsSection";
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
      <section className="pt-24 pb-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Blog da <span className="text-primary">Way</span>
            </h1>
            
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Conteúdo para mentes inquietas, estratégicas e focadas em performance.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6 max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Encontre no blog"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all duration-300 rounded-full"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categoriesLoading ? (
                <>
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full text-sm transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-card border-border text-foreground hover:bg-primary/10 hover:border-primary"
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
        <section className="pb-8 px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/10">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-5/12 relative overflow-hidden">
                        <div className="absolute top-3 right-1 z-10">
                          <Badge className="bg-yellow-100 text-yellow-900 border-yellow-200 text-xs">
                            {post.categorias[0] || 'Blog'}
                          </Badge>
                        </div>
                        <img
                          src={post.featured_image || '/placeholder.svg'}
                          alt={post.titulo}
                          className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="md:w-7/12 p-6 flex flex-col justify-center">
                        <div className="space-y-3">
                          <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {post.titulo}
                          </h2>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-primary/10 text-primary border-primary/20 text-xs hover:bg-primary/20 transition-colors duration-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(post.criado_em)}</span>
                            </div>
                            <span>•</span>
                            <span>{formatReadingTime(post.reading_time)} de leitura</span>
                          </div>

                          {/* CTA */}
                          <div className="pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary hover:bg-primary/10 group/btn p-0 h-auto"
                            >
                              <span className="mr-1 text-sm">Ler artigo</span>
                              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group"
                    >
                      <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-video">
                          <div className="absolute top-3 right-1 z-10">
                            <Badge className="bg-yellow-100 text-yellow-900 border-yellow-200 text-xs">
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
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="space-y-2 flex-1">
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                              {post.titulo}
                            </h3>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>

                            {/* Tags */}
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-primary/10 text-primary border-primary/20 text-xs hover:bg-primary/20 transition-colors duration-300"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 pt-3 border-t border-border mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
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

      {/* Columnists Section */}
      <ColumnistsSection />

      <Footer />
    </div>
  );
};

export default Blog;
