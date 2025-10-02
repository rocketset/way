import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowLeft, Share2, User, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import catfishCase from "@/assets/catfish-case.png";

const BlogPost = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");

  // Mock data for the blog post
  const post = {
    id: 1,
    title: "Catfish",
    subtitle: "Como a Way+ transformou as operações da Catfish em resultados extraordinários",
    image: catfishCase,
    category: "E-commerce",
    tags: ["High-Ticket", "Tráfego", "E-commerce", "Shopify"],
    date: "15 Mar 2024",
    readTime: "10 min",
    author: {
      name: "Way+ Team",
      avatar: "",
    },
    content: `
      <h2>Introdução ao Projeto</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      
      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>O Desafio</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

      <h2>Nossa Solução</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

      <ul>
        <li>Implementação de estratégia de tráfego qualificado</li>
        <li>Otimização da taxa de conversão</li>
        <li>Automação de processos de vendas</li>
        <li>Integração com plataformas de e-commerce</li>
      </ul>

      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>Resultados Alcançados</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

      <h2>Conclusão</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `
  };

  // Mock related posts
  const relatedPosts = [
    {
      id: 2,
      title: "Verona",
      subtitle: "Moda íntima masculina com design diferenciado",
      image: catfishCase,
      category: "E-commerce",
      date: "12 Mar 2024",
      readTime: "5 min",
    },
    {
      id: 3,
      title: "Loja de Roupas Premium",
      subtitle: "Aumentando vendas através de estratégias digitais",
      image: catfishCase,
      category: "E-commerce",
      date: "10 Mar 2024",
      readTime: "6 min",
    },
    {
      id: 4,
      title: "E-commerce de Luxo",
      subtitle: "Transformação digital em alto padrão",
      image: catfishCase,
      category: "E-commerce",
      date: "08 Mar 2024",
      readTime: "4 min",
    },
  ];

  // Mock comments
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "João Silva",
      date: "14 Mar 2024",
      text: "Excelente conteúdo! A Way+ realmente faz um trabalho incrível. Estou impressionado com os resultados apresentados.",
    },
    {
      id: 2,
      name: "Maria Santos",
      date: "13 Mar 2024",
      text: "Muito bom o case! Gostaria de saber mais sobre como vocês implementaram essa estratégia.",
    },
  ]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentName || !commentEmail || !commentText) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const newComment = {
      id: comments.length + 1,
      name: commentName,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      text: commentText,
    };

    setComments([...comments, newComment]);
    setCommentName("");
    setCommentEmail("");
    setCommentText("");

    toast({
      title: "Comentário enviado!",
      description: "Seu comentário foi publicado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Image */}
      <section className="pt-20">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-8 left-4 md:left-8 z-10">
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
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-primary text-primary-foreground">
                {post.category}
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
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground">
              {post.subtitle}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} de leitura</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
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
      </section>

      {/* Content Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border">
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
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Outros posts relacionados
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-video">
                      <Badge className="absolute top-4 left-4 z-10 bg-card text-foreground border-border">
                        {relatedPost.category}
                      </Badge>
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {relatedPost.subtitle}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                        <span>{relatedPost.date}</span>
                        <span>•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-foreground">
              Comentários ({comments.length})
            </h2>

            {/* Comment Form */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Deixe seu comentário
              </h3>
              
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Nome *</label>
                    <Input
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Seu nome"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Email *</label>
                    <Input
                      type="email"
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Comentário *</label>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escreva seu comentário..."
                    rows={4}
                    className="bg-background border-border text-foreground resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar comentário
                </Button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div 
                  key={comment.id}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-lg">
                        {comment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">
                          {comment.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {comment.date}
                        </span>
                      </div>
                      
                      <p className="text-foreground/80 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
