import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "João Silva",
      role: "CEO, Loja Online",
      rating: 5,
      text: "A Way+ transformou completamente nosso e-commerce. Vendas aumentaram 300% em 6 meses!"
    },
    {
      name: "Maria Santos",
      role: "Gerente, Fashion Store",
      rating: 5,
      text: "Plataforma completa e suporte excepcional. Recomendo para qualquer negócio digital."
    },
    {
      name: "Pedro Costa",
      role: "Diretor, Tech Shop",
      rating: 5,
      text: "Integração perfeita e ferramentas poderosas. Nossa operação nunca foi tão eficiente."
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 bg-card/50 backdrop-blur-sm px-8 py-4 rounded-full border border-primary/20 shadow-lg">
            <span className="text-5xl font-bold text-foreground">Excelente</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-7 h-7 fill-primary text-primary animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-lg">Baseado em mais de 1000 avaliações</p>
        </div>

        <h2 className="text-5xl font-bold text-center mb-16 text-foreground animate-fade-in bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          Depoimentos dos nossos clientes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-card via-card to-card/50 p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 animate-scale-in backdrop-blur-sm overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated border shine */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[shimmer_2s_infinite]" />
              </div>

              {/* Floating quote mark */}
              <div className="absolute top-4 right-4 text-primary/10 text-8xl font-serif leading-none group-hover:text-primary/20 transition-colors duration-500">"</div>

              <div className="relative z-10">
                <div className="flex gap-1 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 fill-primary text-primary drop-shadow-[0_0_8px_rgba(255,204,0,0.5)]" 
                    />
                  ))}
                </div>
                
                <p className="text-foreground mb-8 leading-relaxed text-lg group-hover:text-foreground/90 transition-colors duration-300">
                  {testimonial.text}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/50 rounded-tl-2xl transition-all duration-500" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/50 rounded-br-2xl transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
