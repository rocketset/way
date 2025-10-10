import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Cpu, CreditCard, Truck, Smile, ArrowRight, Check, Globe, MessageCircle, Bot, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
const Implementation = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  
  const servicesList = [{
    icon: ShoppingCart,
    label: "E-commerce"
  }, {
    icon: Globe,
    label: "Desenvolvimento Web"
  }, {
    icon: MessageCircle,
    label: "Automações de Whatsapp"
  }, {
    icon: Bot,
    label: "CRM e automações com I.A"
  }, {
    icon: Store,
    label: "Marketplaces"
  }];
  const services = [{
    icon: ShoppingCart,
    title: "E-commerce",
    subtitle: "Planejamos, desenvolvemos e gerenciamos toda a estratégia do seu e-commerce",
    description: "Desenvolvemos e gerenciamos e-commerce com atuação ampla e entrega. Oferecendo uma experiência de qualidade para seus clientes, com estratégias focadas em resultados. Atendemos diversos modelos de negócio, como B2B, B2C, B2E, D2C."
  }, {
    icon: Store,
    title: "Marketplace",
    subtitle: "Aqui o objetivo é conectar seus produtos às plataformas certas, com atuação em mais de 300 marketplaces",
    description: "Expandimos o alcance dos seus negócios, criando oportunidades lucrativas capazes de ativar a cada ponto específico para seus produtos. Além disso, apresentamos histórias que possam se beneficiar da expertise da sua negócio, celebrando cada atuação qualificando sua visibilidade na sua marca."
  }, {
    icon: Cpu,
    title: "Tecnologia",
    subtitle: "Plataformas de ERP, WMS e OMS avançadas, que facilitam a automação e a análise de dados em tempo real",
    description: "Nossa tecnologia integra APIs robustas que permitem gestão de pedidos, controle de estoque, emissão de notas fiscais automatizada, sincronização de catálogos, análises operacionais e agilidade na gestão, ajudando a transformar dados em resultados estratégicos."
  }, {
    icon: CreditCard,
    title: "Pagamentos",
    subtitle: "Pagamentos online integrados ao check-out com soluções livres de fraudes, tecnologias avançadas e equipe especializada",
    description: "Conte com um sistema seguro para garantir pagamentos integrados no check-out, reduzindo taxas e tempo de aprovação. Utilizamos APIs de plataformas líderes no mercado de pagamento (cartões, PIX, boleto, carteiras digitais). A solução é livre de fraudes, com tecnologias avançadas e uma equipe especializada em segurança e prevenção de ataques virtuais."
  }, {
    icon: Truck,
    title: "Logística",
    subtitle: "Operações automatizadas e rastreamento contínuo, soluções rápidas e seguras, desde o despacho até o transporte",
    description: "Uma logística eficiente é crucial para permitir a agilidade nos processos de entrega e reduzir custos operacionais, especialmente no e-commerce. Em nossa Central de Distribuição (CDA), nossos serviços operam de forma automatizada e conectada, oferecendo rastreamento de pedidos em tempo real, otimizando o picking e o packing de cada item. Com operações automatizadas e rastreamento contínuo, oferecemos soluções rápidas e seguras, desde o despacho até o transporte final. Isso economiza tempo e reduz custos, otimizando a eficiência e a satisfação do cliente."
  }, {
    icon: Smile,
    title: "Customer Experience",
    subtitle: "Soluções integradas de atendimento omnicanal que cobrem toda a jornada de compra",
    description: "Atuação ágil, estratégias personalizadas que impactam desde o pré-venda até o pós-venda. Na pré-venda, oferecemos um diagnóstico profundo para garantir a captura de leads relevantes. Durante a venda, otimizamos processos para maximizar conversões e, no pós-venda, fidelizamos clientes — através de consultas ou inteligência artificial para atender às necessidades do cliente. Entregamos experiências de automação e inteligência artificial com personalização para otimizar cada etapa, unindo tecnologia com estratégias competitivas para o seu negócio."
  }];
  return <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      <main className="pt-32 pb-0">
        {/* Hero Section */}
        <section className="mb-20 relative">
          {/* Decorative Plus Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <Plus className="absolute top-10 left-10 w-20 h-20 text-primary animate-pulse" />
            <Plus className="absolute top-32 right-20 w-32 h-32 text-primary animate-pulse" style={{animationDelay: '1s'}} />
            <Plus className="absolute bottom-20 left-1/4 w-16 h-16 text-primary animate-pulse" style={{animationDelay: '2s'}} />
            <Plus className="absolute top-1/2 right-1/3 w-24 h-24 text-primary animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
          
          <div className="container mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Plus className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Way Digital Solutions</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-primary leading-tight">
                  Implantação<br />
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    & Desenvolvimento
                  </span>
                </h1>
                
                <div className="grid grid-cols-1 gap-4">
                  {servicesList.map((service, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{service.label}</span>
                      <ArrowRight className="ml-auto w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl"></div>
                <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Plus className="w-48 h-48 text-primary/30 group-hover:rotate-90 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute top-10 right-10">
                    <Plus className="w-16 h-16 text-primary/20 animate-pulse" />
                  </div>
                  <div className="absolute bottom-10 left-10">
                    <Plus className="w-12 h-12 text-primary/20 animate-pulse" style={{animationDelay: '1s'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Banner Section */}
        <section className="py-20 mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Plus className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                    É aqui que estruturamos, migramos e desenvolvemos soluções personalizadas para que seu e-commerce nasça forte e já pronto para escalar.
                  </h2>
                </div>
              </div>
              <div className="flex items-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Do planejamento estratégico à integração com marketplaces, conectamos todos os seus canais de venda para impulsionar o crescimento do seu negócio. Nossas soluções integram sistemas de gestão, logística e meios de pagamento, simplificando toda a operação e garantindo uma jornada de compra fluida e completa.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {servicesList.map((service, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 px-5 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <service.icon className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-medium">{service.label}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="group shadow-lg hover:shadow-xl transition-all">
                <Link to="/contato">
                  <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Quer saber mais? Fale com um especialista agora mesmo
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Details */}
        <section className="mb-20">
          <div className="container mx-auto px-12">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl cursor-pointer"
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  {/* Decorative Plus */}
                  <Plus 
                    className={`absolute top-4 right-4 w-6 h-6 text-primary/20 transition-all duration-500 ${
                      hoveredService === index ? 'rotate-90 scale-125 text-primary/40' : ''
                    }`}
                  />
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20 ${
                    hoveredService === index ? 'shadow-lg' : ''
                  }`}>
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-primary font-semibold mb-4 text-sm">
                    {service.subtitle}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <ArrowRight 
                    className={`absolute bottom-8 right-8 w-6 h-6 text-primary transition-all duration-500 ${
                      hoveredService === index ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 mb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
          
          {/* Animated Plus Icons */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <Plus className="absolute top-10 left-10 w-24 h-24 text-primary-foreground animate-pulse" />
            <Plus className="absolute bottom-10 right-10 w-32 h-32 text-primary-foreground animate-pulse" style={{animationDelay: '1s'}} />
            <Plus className="absolute top-1/2 left-1/3 w-16 h-16 text-primary-foreground animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
          
          <div className="container mx-auto px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-6 flex-1">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Smile className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight mb-4">
                    Prontos para alcançar resultados surpreendentes com uma solução digital sob medida?
                  </h2>
                  <p className="text-primary-foreground/90 text-lg">
                    Nossa equipe está pronta para transformar suas ideias em realidade digital.
                  </p>
                </div>
              </div>
              
              <Button asChild size="lg" variant="secondary" className="flex-shrink-0 shadow-2xl hover:scale-105 transition-transform group">
                <Link to="/contato">
                  <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Converse com um especialista
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Implementation;