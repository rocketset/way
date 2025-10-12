import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
const NewsSection = () => {
  const news = [{
    date: "15 MAR",
    title: "Novidades na plataforma Way+ para 2025",
    excerpt: "Conheça as novas funcionalidades que vão revolucionar seu e-commerce este ano.",
    category: "ATUALIZAÇÕES"
  }, {
    date: "10 MAR",
    title: "Como aumentar suas vendas online",
    excerpt: "Estratégias comprovadas para impulsionar seu faturamento no ambiente digital.",
    category: "DICAS"
  }, {
    date: "05 MAR",
    title: "Tendências do e-commerce para 2025",
    excerpt: "Fique por dentro das principais tendências que vão moldar o mercado.",
    category: "MERCADO"
  }];
  return <section id="noticias" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-foreground animate-fade-in">Conteúdos Way</h2>
        <p className="text-center text-muted-foreground mb-12 animate-fade-in">Fique por dentro das tendências e insights mais relevantes.
 Atualizações e conteúdos exclusivos.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item, index) => <div key={index} className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors duration-300 animate-fade-in" style={{
          animationDelay: `${index * 0.2}s`
        }}>
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-primary" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-primary">{item.date}</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                <button className="text-primary font-semibold hover:underline">
                  Ler mais →
                </button>
              </div>
            </div>)}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">VER TODAS AS MATÉRIAS</Button>
        </div>
      </div>
    </section>;
};
export default NewsSection;