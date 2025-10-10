import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="py-16 mb-20" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="container mx-auto px-12">
        <div className="max-w-6xl mx-auto rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 animate-fade-in" style={{ backgroundColor: '#F2F2F2' }}>
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating Plus decorations */}
          <Plus className="absolute top-4 right-4 w-8 h-8 text-primary/10 animate-[spin_15s_linear_infinite]" />
          <Plus className="absolute bottom-4 left-4 w-6 h-6 text-primary/10 animate-[spin_20s_linear_infinite_reverse]" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-3 group-hover:text-primary transition-colors duration-300">
                Newsletter
              </h2>
              <p className="text-black text-lg">
                Receba insights exclusivos e as últimas novidades diretamente no seu e-mail.
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto md:min-w-[400px]">
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                className="flex-1 px-6 py-3 rounded-lg bg-white text-black border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-300 hover:shadow-md" 
              />
              <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold px-8 shadow-lg hover:shadow-2xl transition-all hover:scale-110 relative overflow-hidden group/btn">
                <span className="relative z-10">Cadastrar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
