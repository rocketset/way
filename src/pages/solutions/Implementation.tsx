import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Cpu, CreditCard, Truck, Smile, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Implementation = () => {
  const servicesList = [
    { icon: ShoppingCart, label: "E-commerce" },
    { icon: CreditCard, label: "Pagamentos" },
    { icon: Store, label: "Marketplace" },
    { icon: Truck, label: "Logística" },
    { icon: Cpu, label: "Tecnologia" },
    { icon: Smile, label: "Customer Experience" }
  ];

  const services = [
    {
      icon: ShoppingCart,
      title: "E-commerce",
      subtitle: "Planejamos, desenvolvemos e gerenciamos toda a estratégia do seu e-commerce",
      description: "Desenvolvemos e gerenciamos e-commerce com atuação ampla e entrega. Oferecendo uma experiência de qualidade para seus clientes, com estratégias focadas em resultados. Atendemos diversos modelos de negócio, como B2B, B2C, B2E, D2C."
    },
    {
      icon: Store,
      title: "Marketplace",
      subtitle: "Aqui o objetivo é conectar seus produtos às plataformas certas, com atuação em mais de 300 marketplaces",
      description: "Expandimos o alcance dos seus negócios, criando oportunidades lucrativas capazes de ativar a cada ponto específico para seus produtos. Além disso, apresentamos histórias que possam se beneficiar da expertise da sua negócio, celebrando cada atuação qualificando sua visibilidade na sua marca."
    },
    {
      icon: Cpu,
      title: "Tecnologia",
      subtitle: "Plataformas de ERP, WMS e OMS avançadas, que facilitam a automação e a análise de dados em tempo real",
      description: "Nossa tecnologia integra APIs robustas que permitem gestão de pedidos, controle de estoque, emissão de notas fiscais automatizada, sincronização de catálogos, análises operacionais e agilidade na gestão, ajudando a transformar dados em resultados estratégicos."
    },
    {
      icon: CreditCard,
      title: "Pagamentos",
      subtitle: "Pagamentos online integrados ao check-out com soluções livres de fraudes, tecnologias avançadas e equipe especializada",
      description: "Conte com um sistema seguro para garantir pagamentos integrados no check-out, reduzindo taxas e tempo de aprovação. Utilizamos APIs de plataformas líderes no mercado de pagamento (cartões, PIX, boleto, carteiras digitais). A solução é livre de fraudes, com tecnologias avançadas e uma equipe especializada em segurança e prevenção de ataques virtuais."
    },
    {
      icon: Truck,
      title: "Logística",
      subtitle: "Operações automatizadas e rastreamento contínuo, soluções rápidas e seguras, desde o despacho até o transporte",
      description: "Uma logística eficiente é crucial para permitir a agilidade nos processos de entrega e reduzir custos operacionais, especialmente no e-commerce. Em nossa Central de Distribuição (CDA), nossos serviços operam de forma automatizada e conectada, oferecendo rastreamento de pedidos em tempo real, otimizando o picking e o packing de cada item. Com operações automatizadas e rastreamento contínuo, oferecemos soluções rápidas e seguras, desde o despacho até o transporte final. Isso economiza tempo e reduz custos, otimizando a eficiência e a satisfação do cliente."
    },
    {
      icon: Smile,
      title: "Customer Experience",
      subtitle: "Soluções integradas de atendimento omnicanal que cobrem toda a jornada de compra",
      description: "Atuação ágil, estratégias personalizadas que impactam desde o pré-venda até o pós-venda. Na pré-venda, oferecemos um diagnóstico profundo para garantir a captura de leads relevantes. Durante a venda, otimizamos processos para maximizar conversões e, no pós-venda, fidelizamos clientes — através de consultas ou inteligência artificial para atender às necessidades do cliente. Entregamos experiências de automação e inteligência artificial com personalização para otimizar cada etapa, unindo tecnologia com estratégias competitivas para o seu negócio."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-0">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="container mx-auto px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-primary">
                Digital Commerce
              </h1>
              <p className="text-lg text-foreground mb-8">
                Soluções integradas e uma jornada de compra totalmente otimizada. 
                Tudo o que você precisa para crescer no digital, em um só lugar.
              </p>
              <div className="space-y-3">
                {servicesList.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <service.icon className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{service.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <ShoppingCart className="w-32 h-32 text-primary/30" />
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Purple Banner Section */}
        <section className="py-20 mb-20">
          <div className="container mx-auto px-12">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Nossa abordagem de gestão digital tem a omnicanalidade e o unified commerce como direcionadores estratégicos.
                </h2>
              </div>
              <div>
                <p className="leading-relaxed">
                  Desde o planejamento do e-commerce até a integração com marketplaces, conectando todos os seus canais de vendas, oferecemos uma estratégia completa para o crescimento do seu negócio. Com integrações integradas com sistemas de gestão, logística e pagamento, facilitamos toda a operação do processo de vendas e entregamos uma experiência completa.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {servicesList.map((service, index) => (
                <div key={index} className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-lg">
                  <service.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{service.label}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="secondary" className="group">
                <Link to="/contato">
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
            <div className="space-y-20">
            {services.map((service, index) => (
              <div key={index} className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-primary font-semibold mb-4">{service.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 mb-20">
          <div className="container mx-auto px-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Smile className="w-12 h-12" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  Prontos para alcançar resultados surpreendentes<br className="hidden md:block" />
                  com uma solução digital sob medida?
                </h2>
              </div>
              <Button asChild size="lg" variant="secondary" className="flex-shrink-0">
                <Link to="/contato">
                  Converse com um especialista
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Implementation;
