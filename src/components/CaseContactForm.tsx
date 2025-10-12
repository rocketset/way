import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CaseContactForm = () => {

  return (
    <section className="bg-background py-24 px-4">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Vamos iniciar o seu projeto?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Entre em contato com nosso time de especialistas e coloque seu negócio no topo da página.
              </p>
            </div>

            {/* Right CTA */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-card border border-border rounded-2xl p-8 shadow-xl flex items-center justify-center min-h-[200px]">
                <Link to="/contato">
                  <Button size="lg" className="h-14 px-8 text-lg font-semibold group">
                    Entre em contato
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseContactForm;
