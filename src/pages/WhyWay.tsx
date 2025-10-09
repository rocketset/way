import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Users, TrendingUp, Shield, Zap, Heart, Plus, ArrowRight, Sparkles, Target, Award, Grid3x3, Eye, Headphones } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCases } from "@/hooks/useCases";
import PartnersCarousel from "@/components/PartnersCarousel";
import whyWayHero from "@/assets/why-way-hero.jpeg";
import leadershipPhoto from "@/assets/leadership-photo.jpg";
import galleryTeam1 from "@/assets/gallery/team-1.jpg";
import galleryTeam2 from "@/assets/gallery/team-2.jpg";
import galleryTeam3 from "@/assets/gallery/team-3.jpg";
import galleryTeam4 from "@/assets/gallery/team-4.png";
import galleryTeam5 from "@/assets/gallery/team-5.png";
import galleryTeam6 from "@/assets/gallery/team-6.png";
import galleryTeam7 from "@/assets/gallery/team-7.png";
import galleryTeam8 from "@/assets/gallery/team-8.png";
import galleryTeam9 from "@/assets/gallery/team-9.png";
import galleryTeam10 from "@/assets/gallery/team-10.png";
const WhyWay = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const {
    data: casesData,
    isLoading: casesLoading
  } = useCases("", "Todos");
  const galleryPhotos = [galleryTeam1, galleryTeam2, galleryTeam3, galleryTeam4, galleryTeam5, galleryTeam6, galleryTeam7, galleryTeam8, galleryTeam9, galleryTeam10];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Duplicate photos for seamless infinite scroll
  const allPhotos = [...galleryPhotos, ...galleryPhotos];
  const stats = [{
    number: "+ de 190",
    label: "Lojas implantadas"
  }, {
    number: "+ de 1 ano",
    label: "com soluções de ponta a ponta"
  }, {
    number: "8 Anos",
    label: "de Mercado"
  }, {
    number: "98%",
    label: "de Satisfação"
  }];
  const featuredCases = casesData?.featured || [];
  const regularCases = casesData?.regular || [];
  const allCases = [...featuredCases, ...regularCases].slice(0, 6);
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Somos para quem pensa grande */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 overflow-hidden bg-background">
        {/* Floating Plus Symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <Plus 
              key={i}
              className="absolute text-primary/10 animate-float-delayed"
              style={{
                left: `${(i * 13 + 7) % 90}%`,
                top: `${(i * 17 + 11) % 90}%`,
                width: `${20 + (i % 3) * 15}px`,
                height: `${20 + (i % 3) * 15}px`,
                animationDelay: `${i * 0.5}s`,
                transform: `translateY(${scrollY * 0.1 * (i % 3)}px) rotate(${scrollY * 0.05 * (i % 2 ? 1 : -1)}deg)`
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            style={{
              left: `${20 + mousePosition.x * 0.02}px`,
              top: `${-100 + mousePosition.y * 0.02}px`,
              transition: 'all 0.3s ease-out'
            }}
          />
          <div 
            className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            style={{
              right: `${-50 - mousePosition.x * 0.015}px`,
              bottom: `${-50 - mousePosition.y * 0.015}px`,
              transition: 'all 0.3s ease-out'
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Texto */}
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight lg:text-5xl">
                  Somos para <span className="text-primary">quem pensa grande</span> e quer ir além.
                </h1>
                
                <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Ao longo da nossa trajetória, já aceleramos indústrias, redes de lojas e varejistas de diversos segmentos, sempre com foco em performance e crescimento sustentável.
                  </p>
                  <p>Com integrações robustas em tecnologias como TOTVS Modas, Whithor, Linx, Shopify, VTEX, Tray, WBuy, Magento 2 e Chianca, adquirimos um profundo entendimento do mercado e das particularidades de cada operação.</p>
                  <p>Nossa atuação também contempla a abertura e gestão de marketplaces, além da integração com hubs de marketplaces e centros de logística, conectando todo o ecossistema digital de forma inteligente e eficiente.</p>
                </div>
              </div>

              {/* Imagem principal */}
              <div className="relative animate-fade-in" style={{
              animationDelay: "0.2s"
            }}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                  <img src={whyWayHero} alt="Equipe Way+" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel de Fotos */}
      <section className="py-16 px-4 bg-background overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6 animate-gallery-scroll">
              {allPhotos.map((photo, index) => <div key={`${photo}-${index}`} className="flex-shrink-0 w-80 aspect-square">
                  <div className="relative group overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-500 h-full hover:shadow-2xl hover:scale-105">
                    <img src={photo} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Plus className="absolute top-4 right-4 w-8 h-8 text-white opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes gallery-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-gallery-scroll {
            animation: gallery-scroll 40s linear infinite;
            display: flex;
            width: max-content;
          }

          @keyframes float-delayed {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }

          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.05);
            }
          }

          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-gallery-scroll {
              animation-duration: 60s;
            }
            .animate-float-delayed,
            .animate-spin-slow,
            .animate-pulse-slow {
              animation: none;
            }
          }
        `}</style>
      </section>

      {/* Nascemos para revolucionar */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/5 animate-pulse-slow"
              style={{
                left: `${i * 15}%`,
                top: `${(i * 23) % 100}%`,
                width: `${100 + i * 30}px`,
                height: `${100 + i * 30}px`,
                animationDelay: `${i * 0.7}s`,
                transform: `translateY(${scrollY * 0.05 * (i % 2 ? 1 : -1)}px)`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-primary font-semibold">Nossa Missão</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 hover:scale-105 transition-transform duration-300">
              Nascemos para revolucionar
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent inline-flex items-center gap-3">
                o e-commerce
                <Plus className="inline-block w-12 h-12 text-primary animate-spin-slow" />
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Fundada por um Cientista da Computação apaixonado por tecnologia e resultados, a Way+ nasceu com o propósito de transformar a forma como os negócios crescem no Brasil. Unimos expertise técnica, criatividade e inteligência em dados para construir estratégias que geram crescimento real e mensurável.</p>
          </div>
        </div>
      </section>

      {/* Por que escolher a Way+ */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">
                Por que escolher <span className="text-primary">a Way+?</span>
              </h2>
              
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <div className="relative">
                      <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-125 transition-transform duration-500">
                        {stat.number}
                      </div>
                      <div className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                    <Plus className="absolute -top-2 -right-2 w-6 h-6 text-primary opacity-0 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500" />
                  </div>
                ))}
              </div>

              <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Estamos presentes em toda a jornada de compra, acompanhando a operação em cada etapa, da criação da loja até a evolução contínua. Nosso papel é simplificar a entrada no digital ou escalar negócios já existentes, transformando desafios em crescimento real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* Card 1 - Soluções Modulares */}
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 group-hover:rotate-90 transition-all duration-700" />
                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    <Grid3x3 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Soluções Modulares</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Customizamos cada projeto conforme a maturidade da operação. Co-criamos com nossos parceiros, sem perder ganhos de escala e eficiência.
                  </p>
                </div>
              </div>

              {/* Card 2 - Transparência */}
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 group-hover:rotate-90 transition-all duration-700" />
                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    <Eye className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Transparência</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Trabalhamos como parceiros de negócio. A rentabilidade precisa ser saudável para ambos os lados, e nossas metas estão sempre alinhadas às metas de venda do cliente.
                  </p>
                </div>
              </div>

              {/* Card 3 - Atendimento */}
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 group-hover:rotate-90 transition-all duration-700" />
                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    <Headphones className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Atendimento</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mais do que suporte, oferecemos direcionamento estratégico e acompanhamento próximo, garantindo evolução constante e decisões mais assertivas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos dos Parceiros */}
      <PartnersCarousel />

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

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/30 group-hover:rotate-180 group-hover:scale-150 transition-all duration-700" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300"> Transformar negócios em operações digitais reais</h3>
                <p className="text-muted-foreground leading-relaxed">Nosso propósito é tirar as empresas do amadorismo digital, estruturando operações de e-commerce que vendem de verdade — com base em processos, tecnologia e estratégia.</p>
              </div>
            </div>

            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/30 group-hover:rotate-180 group-hover:scale-150 transition-all duration-700" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Gerar performance com propósito</h3>
                <p className="text-muted-foreground leading-relaxed">Não vendemos promessas, entregamos resultados. Cada campanha, automação e integração é pensada para gerar impacto comercial mensurável e crescimento sustentável</p>
              </div>
            </div>

            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/30 group-hover:rotate-180 group-hover:scale-150 transition-all duration-700" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Rocket className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Construir com consistência e visão de longo prazo</h3>
                <p className="text-muted-foreground leading-relaxed">Acreditamos que escalar não é sorte, é método. Por isso, acompanhamos cada cliente em uma jornada estruturada, da implantação ao alto desempenho.</p>
              </div>
            </div>

            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/30 group-hover:rotate-180 group-hover:scale-150 transition-all duration-700" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Unir pessoas, tecnologia e estratégia</h3>
                <p className="text-muted-foreground leading-relaxed">Nosso diferencial está na união entre equipe, processos e tecnologia — criando um ecossistema digital completo que impulsiona o crescimento de quem confia na Way.</p>
              </div>
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
                  <p>Pablo Ramon Fabricio  – Especialista em E-commerce e Transformação Digital, com mais de 9 anos de experiência na implantação, evolução e escala de operações online em todo o Brasil. 
Com uma trajetória marcada pela execução de mais de 180 projetos de e-commerce, Pablo já ajudou indústrias, redes de lojas e grandes varejistas a migrarem e estruturarem suas vendas digitais com consistência, previsibilidade e performance. </p>
                  <p>Fundador e CEO da Way E-commerce, lidera um time multidisciplinar que atua desde o planejamento estratégico e integração tecnológica até a gestão de performance e automação de marketing, conectando tecnologia, processos e pessoas em uma metodologia própria e validada.</p>
                  <p>Além da atuação à frente da Way, Pablo é mentor de startups e consultor credenciado do Sebrae, apoiando empresas em jornadas de inovação, digitalização e crescimento sustentável.
Hoje, com presença nacional e foco em resultados reais, a Way transforma operações físicas em negócios digitais sólidos e escalávei</p>
                </div>
              </div>

              <div className="relative animate-fade-in order-1 md:order-2" style={{
              animationDelay: "0.2s"
            }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                  <img src={leadershipPhoto} alt="Liderança Way+" className="w-full h-full object-cover aspect-square" />
                </div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Os resultados falam por si
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça alguns dos projetos que transformamos em histórias de sucesso
              </p>
            </div>

            {casesLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-2xl h-64 mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>)}
              </div> : allCases.length > 0 ? <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {allCases.map((caseItem: any, index: number) => <div key={caseItem.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 cursor-pointer" onClick={() => navigate(`/cases/${caseItem.id}`)} onMouseEnter={() => setHoveredCard(100 + index)} onMouseLeave={() => setHoveredCard(null)}>
                      {/* Imagem */}
                      <div className="relative h-48 overflow-hidden">
                        {caseItem.imagem_url ? <img src={caseItem.imagem_url} alt={caseItem.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-primary/50" />
                          </div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6">
                        {caseItem.categoria_nome && <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                            {caseItem.categoria_nome}
                          </Badge>}
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
                      <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 ${hoveredCard === 100 + index ? 'opacity-100' : ''}`} />
                    </div>)}
                </div>

                <div className="text-center">
                  <Button onClick={() => navigate('/cases')} size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                    Ver todos os cases
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </> : <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhum case disponível no momento
                </p>
              </div>}
          </div>
        </div>
      </section>

      {/* Customer Success */}
      

      {/* CTA Final */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">A Way está preparada e equipada para te receber.</h2>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="group bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6" onClick={() => navigate('/contact')}>
                Fale com a gente
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default WhyWay;