import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Rocket, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Heart,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Clock,
  Plus,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCases } from "@/hooks/useCases";
import teamImage from "@/assets/why-way-team.png";
import innovationImage from "@/assets/why-way-innovation.png";
import differentialsImage from "@/assets/why-way-differentials.png";
import successImage from "@/assets/why-way-success.png";

const WhyWay = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { data: casesData, isLoading: casesLoading } = useCases("", "Todos");
  
  // Placeholder para fotos da galeria - você pode adicionar fotos manualmente aqui
  const [galleryPhotos] = useState<string[]>([
    // Adicione URLs das fotos aqui conforme necessário
    // Exemplo: "/images/foto1.jpg", "/images/foto2.jpg"
  ]);

  const values = [
    {
      icon: Heart,
      title: "Paixão pelo Cliente",
      description: "Colocamos nossos clientes no centro de tudo. Seu sucesso é nossa missão.",
      color: "from-red-500 to-pink-500",
      bgGlow: "bg-red-500/20"
    },
    {
      icon: Rocket,
      title: "Inovação Constante",
      description: "Sempre evoluindo com as melhores tecnologias e estratégias do mercado.",
      color: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/20"
    },
    {
      icon: Users,
      title: "Time de Especialistas",
      description: "Profissionais certificados e experientes dedicados ao seu crescimento.",
      color: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/20"
    },
    {
      icon: TrendingUp,
      title: "Resultados Comprovados",
      description: "Histórico consistente de crescimento e ROI positivo para nossos clientes.",
      color: "from-green-500 to-emerald-500",
      bgGlow: "bg-green-500/20"
    }
  ];

  const differentials = [
    {
      icon: Shield,
      title: "Transparência Total",
      description: "Relatórios detalhados e acesso completo aos dados das suas campanhas."
    },
    {
      icon: Zap,
      title: "Agilidade",
      description: "Implementação rápida e otimizações constantes para máxima performance."
    },
    {
      icon: Award,
      title: "Certificações",
      description: "Parceiros oficiais das principais plataformas de e-commerce e marketing."
    },
    {
      icon: BarChart3,
      title: "Data-Driven",
      description: "Decisões baseadas em dados e análises aprofundadas do mercado."
    }
  ];

  const stats = [
    { number: "500+", label: "Clientes Ativos", icon: Users },
    { number: "R$ 100M+", label: "Faturamento Gerado", icon: TrendingUp },
    { number: "8 Anos", label: "de Experiência", icon: Clock },
    { number: "98%", label: "Satisfação", icon: Award }
  ];

  const featuredCases = casesData?.featured || [];
  const regularCases = casesData?.regular || [];
  const allCases = [...featuredCases, ...regularCases].slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-6 py-2 text-base animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              Conheça a Way+
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                Por que escolher
              </span>
              <br />
              <span className="text-foreground">a Way+?</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
              Somos mais do que uma agência de marketing digital. Somos seu parceiro estratégico 
              para transformar seu e-commerce em uma máquina de vendas.
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-primary via-yellow-500 to-primary hover:shadow-2xl transition-all duration-300"
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Começar Agora
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group"
                onClick={() => document.getElementById('nossa-historia')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Nossa História
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria de Fotos */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Galeria
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Nossos Momentos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça nossa equipe e os bastidores dos nossos projetos
              </p>
            </div>

            {galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryPhotos.map((photo, index) => (
                  <div 
                    key={index}
                    className="relative group overflow-hidden rounded-2xl aspect-square bg-card border border-border hover:border-primary/50 transition-all duration-500"
                  >
                    <img 
                      src={photo} 
                      alt={`Galeria ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                <Plus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Nenhuma foto adicionada ainda
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Adicione fotos editando o array <code className="bg-muted px-2 py-1 rounded">galleryPhotos</code> no código
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section id="nossa-historia" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-4">
                <Target className="w-4 h-4 mr-2" />
                Nossa História
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Nascemos para
                <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent"> revolucionar </span>
                o e-commerce
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Fundada em 2016, a Way+ nasceu da visão de criar uma agência que realmente 
                  entendesse as necessidades dos e-commerces brasileiros.
                </p>
                <p>
                  Começamos pequenos, mas com grandes sonhos. Hoje, somos referência em 
                  marketing digital para e-commerce, tendo ajudado centenas de empresas a 
                  alcançarem resultados extraordinários.
                </p>
                <p>
                  Nossa jornada é marcada por inovação, dedicação e, principalmente, pelo 
                  sucesso dos nossos clientes. Cada resultado conquistado é uma vitória compartilhada.
                </p>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-yellow-500/20 rounded-3xl blur-3xl" />
              <img 
                src={teamImage}
                alt="Time Way+"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(45 100% 50% / 0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Nossos Valores
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O que nos move
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Princípios que guiam cada decisão e ação da Way+
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card glow effect */}
                <div className={`absolute inset-0 ${value.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} group-hover:scale-110 transition-transform duration-500`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative animate-fade-in order-2 md:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-yellow-500/20 rounded-3xl blur-3xl" />
              <img 
                src={differentialsImage}
                alt="Equipe E-commerce Way+"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="animate-fade-in order-1 md:order-2" style={{ animationDelay: "0.2s" }}>
              <Badge className="mb-4">
                <Award className="w-4 h-4 mr-2" />
                Diferenciais
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Por que somos
                <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent"> diferentes?</span>
              </h2>
              
              <div className="space-y-6">
                {differentials.map((diff, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 p-4 rounded-xl hover:bg-background/50 transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <diff.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {diff.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {diff.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados que falam por si - Cases */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                Resultados
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Os resultados falam por si
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça alguns dos projetos que transformamos em histórias de sucesso
              </p>
            </div>

            {casesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-2xl h-64 mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            ) : allCases.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {allCases.map((caseItem: any, index: number) => (
                    <div
                      key={caseItem.id}
                      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 cursor-pointer"
                      onClick={() => navigate(`/cases/${caseItem.id}`)}
                      onMouseEnter={() => setHoveredCard(100 + index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Imagem */}
                      <div className="relative h-48 overflow-hidden">
                        {caseItem.imagem_url ? (
                          <img 
                            src={caseItem.imagem_url} 
                            alt={caseItem.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-primary/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6">
                        {caseItem.categoria_nome && (
                          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                            {caseItem.categoria_nome}
                          </Badge>
                        )}
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                          {caseItem.titulo}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {caseItem.descricao}
                        </p>
                        
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
                          Ver case completo
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Efeito de hover */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 ${
                          hoveredCard === 100 + index ? 'opacity-100' : ''
                        }`} 
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => navigate('/cases')}
                    size="lg"
                    className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Ver todos os cases
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhum case disponível no momento
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-yellow-500/10 to-primary/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Pronto para
              <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent"> crescer com a gente?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Vamos conversar sobre como podemos transformar seu e-commerce
            </p>
            <Button 
              size="lg"
              className="group bg-gradient-to-r from-primary via-yellow-500 to-primary hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
              onClick={() => window.location.href = '/#contato'}
            >
              Falar com Especialista
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default WhyWay;