import { Button } from "@/components/ui/button";
import { Smile, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const CtaResultsSection = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-background to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <Plus className="w-6 h-6 text-primary plus-rotate" />
            <span className="text-sm font-bold text-primary tracking-wider">PRONTO PARA CRESCER?</span>
            <Plus className="w-6 h-6 text-primary plus-rotate" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Transforme seu e-commerce em uma{" "}
            <span className="gradient-text">máquina de vendas</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Converse com nossos especialistas e descubra como podemos impulsionar seus resultados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contato">
              <Button size="lg" className="group hover-lift">
                <Smile className="mr-2 h-5 w-5" />
                Falar com especialista
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CtaResultsSection;