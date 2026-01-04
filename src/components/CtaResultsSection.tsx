import { Plus } from "lucide-react";
import DynamicContactForm from "@/components/DynamicContactForm";

const CtaResultsSection = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
      {/* Animated Plus Icons Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <Plus
            key={i}
            className="absolute text-primary/10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Plus className="w-6 h-6 text-primary plus-rotate" />
              <span className="text-sm font-bold text-primary tracking-wider">PRONTO PARA CRESCER?</span>
              <Plus className="w-6 h-6 text-primary plus-rotate" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Agende um diagnóstico{" "}
              <span className="text-primary">gratuito</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Fale com a Way e acelere seu crescimento digital.
            </p>
          </div>

          {/* Dynamic Contact Form */}
          <DynamicContactForm formSlug="home" />
        </div>
      </div>
    </section>
  );
};

export default CtaResultsSection;