import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Heart,
  Plus,
  ArrowRight,
  Sparkles,
  Target,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCases } from "@/hooks/useCases";
import PartnersCarousel from "@/components/PartnersCarousel";

const WhyWay = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { data: casesData, isLoading: casesLoading } = useCases("", "Todos");
  
  // Placeholder para fotos da galeria - você pode adicionar fotos manualmente aqui
  const [galleryPhotos] = useState<string[]>([
    // Adicione URLs das fotos aqui conforme necessário
    // Exemplo: "/images/foto1.jpg", "/images/foto2.jpg"
  ]);

  const stats = [
    { number: "500+", label: "Projetos Entregues" },
    { number: "R$ 100M+", label: "Faturamento Gerado" },
    { number: "8 Anos", label: "de Mercado" },
    { number: "98%", label: "de Satisfação" }
  ];

  const featuredCases = casesData?.featured || [];
  const regularCases = casesData?.regular || [];
  const allCases = [...featuredCases, ...regularCases].slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Por que escolher a Way+ */}
      <section className="relative pt-32 py-20 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Por que escolher a Way+?
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-6xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nascemos para revolucionar */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Nascemos para revolucionar
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                o e-commerce
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Fundada por especialistas apaixonados por resultados, a Way+ nasceu com o propósito de transformar a forma como e-commerces crescem no Brasil. Combinamos expertise técnica, criatividade e análise de dados para entregar resultados que realmente importam.
            </p>
          </div>
        </div>
      </section>

      {/* Nosso DNA */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nosso DNA
            </h2>
            <p className="text-lg text-muted-foreground">
              Valores que definem quem somos e como trabalhamos
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                Foco em Resultados
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Cada estratégia é desenhada para gerar impacto mensurável e crescimento real para nossos clientes.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                Paixão pelo que Fazemos
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Trabalhamos com dedicação e entusiasmo, tratando cada projeto como se fosse nosso.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Rocket className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                Inovação Constante
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Sempre à frente, testando novas tecnologias e estratégias para manter nossos clientes na vanguarda.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                Parceria Verdadeira
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Não somos apenas fornecedores, somos parceiros comprometidos com o sucesso de longo prazo.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                Transparência Total
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Comunicação clara, relatórios detalhados e total acesso aos dados das campanhas.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                Execução Ágil
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Velocidade na implementação e otimização contínua para não perder oportunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quem está à frente da Way+ */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in order-2 md:order-1">
                <Badge className="mb-4">
                  <Award className="w-4 h-4 mr-2" />
                  Liderança
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Quem está à frente
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    da Way+
                  </span>
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    Nossa equipe é formada por especialistas certificados pelas principais plataformas do mercado, com anos de experiência em e-commerce e marketing digital.
                  </p>
                  <p>
                    Liderados por profissionais que vivem e respiram performance, cada membro do nosso time está comprometido em entregar resultados excepcionais e superar expectativas.
                  </p>
                  <p>
                    Combinamos expertise técnica, visão estratégica e paixão por inovação para criar soluções que realmente transformam negócios.
                  </p>
                </div>
              </div>

              <div className="relative animate-fade-in order-1 md:order-2" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Users className="w-32 h-32 text-primary/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground text-center px-8">
                        Adicione uma foto da equipe ou liderança aqui
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Fotos */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
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

      {/* Resultados que falam por si - Cases */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
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

      {/* Logos dos Clientes */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nossos Clientes
              </h2>
              <p className="text-lg text-muted-foreground">
                Marcas que confiam na Way+ para crescer
              </p>
            </div>
            <PartnersCarousel />
          </div>
        </div>
      </section>

      {/* Customer Success */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Customer Success
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Nosso time está sempre pronto para garantir seu sucesso em cada etapa da jornada. Desde o onboarding até o crescimento contínuo, estamos ao seu lado.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Pronto para crescer com a gente?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Somos para quem pensa grande e quer ir além.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                onClick={() => navigate('/contact')}
              >
                Fale com a gente
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group text-lg px-8 py-6"
                onClick={() => navigate('/cases')}
              >
                Ver nossos cases
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhyWay;
