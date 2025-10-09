import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Users, TrendingUp, Shield, Zap, Heart, Plus, ArrowRight, Sparkles, Target, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCases } from "@/hooks/useCases";
import PartnersCarousel from "@/components/PartnersCarousel";
import whyWayHero from "@/assets/why-way-hero.jpeg";
import leadershipPhoto from "@/assets/leadership-photo.jpg";
import galleryTeam1 from "@/assets/gallery/team-1.jpg";
import galleryTeam2 from "@/assets/gallery/team-2.jpg";
import galleryTeam3 from "@/assets/gallery/team-3.jpg";
const WhyWay = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const {
    data: casesData,
    isLoading: casesLoading
  } = useCases("", "Todos");
  const [galleryPhotos] = useState<string[]>([galleryTeam1, galleryTeam2, galleryTeam3]);
  const stats = [{
    number: "500+",
    label: "Projetos Entregues"
  }, {
    number: "R$ 100M+",
    label: "Faturamento Gerado"
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-background">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Texto */}
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight lg:text-5xl">
                  Somos para <span className="text-[#F5A623]">quem pensa grande</span> e quer ir além.
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

      {/* Stats Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => <div key={index} className="text-center group animate-fade-in" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="text-4xl md:text-6xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>)}
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
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300"> Transformar negócios em operações digitais reais</h3>
              <p className="text-muted-foreground leading-relaxed">Nosso propósito é tirar as empresas do amadorismo digital, estruturando operações de e-commerce que vendem de verdade — com base em processos, tecnologia e estratégia.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Gerar performance com propósito</h3>
              <p className="text-muted-foreground leading-relaxed">Não vendemos promessas, entregamos resultados. Cada campanha, automação e integração é pensada para gerar impacto comercial mensurável e crescimento sustentável</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Rocket className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Construir com consistência e visão de longo prazo</h3>
              <p className="text-muted-foreground leading-relaxed">Acreditamos que escalar não é sorte, é método. Por isso, acompanhamos cada cliente em uma jornada estruturada, da implantação ao alto desempenho.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Unir pessoas, tecnologia e estratégia</h3>
              <p className="text-muted-foreground leading-relaxed">Nosso diferencial está na união entre equipe, processos e tecnologia — criando um ecossistema digital completo que impulsiona o crescimento de quem confia na Way.</p>
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
                  <img 
                    src={leadershipPhoto} 
                    alt="Liderança Way+" 
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel de Fotos */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {galleryPhotos.map((photo, index) => <div key={index} className="flex-shrink-0 w-80 h-80 relative group overflow-hidden rounded-xl border border-border hover:border-primary/50 transition-all duration-500">
                  <img src={photo} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>)}
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

      {/* Logos dos Clientes */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            
            <PartnersCarousel />
          </div>
        </div>
      </section>

      {/* Customer Success */}
      

      {/* CTA Final */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto relative z-10">
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