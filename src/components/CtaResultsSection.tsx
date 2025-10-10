import { Button } from "@/components/ui/button";
import { Smile, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CtaResultsSection = () => {
  return (
    <section className="relative py-20 mb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
      
      {/* Animated Plus Icons */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <Plus className="absolute top-10 left-10 w-24 h-24 text-primary-foreground animate-[spin_20s_linear_infinite]" />
        <Plus className="absolute bottom-10 right-10 w-32 h-32 text-primary-foreground animate-[spin_25s_linear_infinite_reverse]" />
        <Plus className="absolute top-1/2 left-1/3 w-16 h-16 text-primary-foreground animate-[spin_15s_linear_infinite]" />
        <Plus className="absolute bottom-1/3 right-1/4 w-20 h-20 text-primary-foreground animate-[spin_18s_linear_infinite_reverse]" />
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
          
          <Button asChild size="lg" variant="secondary" className="flex-shrink-0 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group relative overflow-hidden">
            <Link to="/contato" className="relative z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Plus className="mr-2 w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-500" />
              Converse com um especialista
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaResultsSection;
