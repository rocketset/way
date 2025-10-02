import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2, TrendingUp, Target, Zap } from "lucide-react";
import catfishCase from "@/assets/catfish-case.png";

const BlogPost = () => {
  const { id } = useParams();

  // Mock data for the blog post
  const post = {
    id: 1,
    title: "Catfish",
    subtitle: "Catfish é uma loja de roupas que você vai Way transformou suas operações em resultados.",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: catfishCase,
    category: "E-commerce",
    tags: ["High-Ticket", "Tráfego", "E-commerce", "Shopify"],
    date: "15 Mar 2024",
    readTime: "10 min",
    author: {
      name: "Way+ Team",
      avatar: "",
    }
  };

  const projectDetails = [
    { label: "Objetivo", value: "Aumentar conversão" },
    { label: "Plataforma", value: "Shopify" },
    { label: "Categoria", value: "High-Ticket" },
  ];

  const solutions = [
    { label: "High-Ticket", icon: TrendingUp },
    { label: "Tráfego", icon: Target },
  ];

  const technologies = [
    { label: "High-Ticket", icon: Zap },
    { label: "Tráfego", icon: Target },
  ];

  const results = [
    { metric: "185%", label: "Aumento em vendas", trend: "+15%" },
    { metric: "145%", label: "ROI melhorado", trend: "+20%" },
    { metric: "265%", label: "Conversão otimizada", trend: "+12%" },
    { metric: "85%", label: "Redução de custos", trend: "+8%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Voltar para o blog</span>
            </Link>

            {/* Hero Content */}
            <div className="bg-card rounded-3xl overflow-hidden border border-border">
              <div className="p-8 md:p-12 space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className="bg-card text-foreground border-border">
                    {post.category}
                  </Badge>
                  <span className="text-primary">Un voluptatem fugiat il dinunc da molestiae blanditits.</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                  {post.title}
                </h1>

                <p className="text-xl text-foreground">
                  {post.subtitle}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary text-primary-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-border">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              
              {/* Meta Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 border border-border">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} de leitura</span>
                    </div>
                    <div className="ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border">
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Detalhes do projeto */}
              <div className="bg-card rounded-3xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Detalhes do projeto</h2>
                <div className="space-y-4">
                  {projectDetails.map((detail) => (
                    <div key={detail.label} className="space-y-2">
                      <h3 className="text-sm text-muted-foreground">{detail.label}</h3>
                      <p className="text-lg font-medium text-foreground">{detail.value}</p>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        High-Ticket
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desafios */}
              <div className="bg-card rounded-3xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Desafios</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Soluções utilizadas */}
              <div className="bg-card rounded-3xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Soluções utilizadas</h2>
                <div className="flex flex-wrap gap-2">
                  {solutions.map((solution) => (
                    <Badge
                      key={solution.label}
                      variant="secondary"
                      className="bg-primary text-primary-foreground"
                    >
                      {solution.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Soluções */}
              <div className="bg-card rounded-3xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Soluções</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Tecnologias utilizadas</h2>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge
                    key={tech.label}
                    variant="secondary"
                    className="bg-primary text-primary-foreground"
                  >
                    {tech.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border">
              <h2 className="text-2xl font-bold mb-8 text-foreground">Números</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((result) => (
                  <div key={result.label} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">{result.metric}</span>
                      <span className="text-sm text-green-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {result.trend}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border mt-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Resultados</h2>
              <p className="text-foreground/80 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border border-l-4 border-l-primary">
              <p className="text-xl text-foreground/80 leading-relaxed mb-6 italic">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary flex items-center justify-center">
                  <span className="text-primary font-bold">W</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Cliente Way+</p>
                  <p className="text-sm text-muted-foreground">CEO, {post.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
