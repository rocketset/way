import { TextColumnsBlockContent } from "@/hooks/useCaseBlocks";
import DOMPurify from "dompurify";
import { Target, Trophy } from "lucide-react";

interface TextColumnsBlockProps {
  data: TextColumnsBlockContent;
}

export const TextColumnsBlock = ({ data }: TextColumnsBlockProps) => {
  return (
    <section className="relative py-20 px-6 bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Desafio */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Desafio</h3>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-transparent rounded-full" />
            <div 
              className="text-base lg:text-lg text-muted-foreground leading-relaxed prose prose-lg max-w-none hover:text-foreground transition-colors duration-300"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.coluna_esquerda) }}
            />
          </div>
          
          {/* Right Column - Resultado */}
          <div className="space-y-6 animate-fade-in delay-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Resultado</h3>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-transparent rounded-full" />
            <div 
              className="text-base lg:text-lg text-muted-foreground leading-relaxed prose prose-lg max-w-none hover:text-foreground transition-colors duration-300"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.coluna_direita) }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
