import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Store, Cpu, CreditCard, Truck, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Implementation = () => {
  const services = [
    {
      icon: ShoppingCart,
      title: "E-commerce",
      description: "Planejamos, desenvolvemos e gerenciamos E-commerce para diversos modelos de negócio, como B2B, B2C, B2E, D2C"
    },
    {
      icon: Store,
      title: "Marketplace",
      description: "Aqui o objetivo é conectar seus produtos às plataformas de marketplace, aumentando sua visibilidade"
    },
    {
      icon: Cpu,
      title: "Tecnologia",
      description: "Plataformas de ERP, WMS e OMS avançadas, que facilitam a gestão completa do seu negócio"
    },
    {
      icon: CreditCard,
      title: "Pagamentos",
      description: "Pagamentos online integrados ao check-out com soluções livres e seguras para seu cliente"
    },
    {
      icon: Truck,
      title: "Logística",
      description: "Operações automatizadas e rastreamento contínuo em tempo real, otimizando o picking e packing de cada item"
    },
    {
      icon: Users,
      title: "Customer Experience",
      description: "Soluções personalizadas de maximização da experiência do cliente em toda jornada de compra"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ShoppingCart className="w-4 h-4" />
              Digital Commerce
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Soluções integradas e uma jornada de compra
            </h1>
            <p className="text-xl text-muted-foreground">
              A omnicanalidade e o unified commerce como direcionadores estratégicos
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <service.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prontos para alcançar resultados surpreendentes<br />
              com uma solução digital sob medida?
            </h2>
            <Button asChild size="lg" className="group">
              <Link to="/contato">
                Converse com um especialista
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Implementation;
