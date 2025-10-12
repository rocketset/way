import { TextColumnsBlockContent } from "@/hooks/useCaseBlocks";
import DOMPurify from "dompurify";
import { Target, Trophy } from "lucide-react";

interface TextColumnsBlockProps {
  data: TextColumnsBlockContent;
}

export const TextColumnsBlock = ({ data }: TextColumnsBlockProps) => {
  return (
    <section className="relative py-24 px-6 bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="text-muted-foreground leading-relaxed space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Desafio:</h3>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-transparent rounded-full mb-8" />
<div
              className="text-lg space-y-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.coluna_esquerda) }}
            />
          </div>
          
          <div className="text-muted-foreground leading-relaxed space-y-6 animate-fade-in delay-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Resultado:</h3>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mb-8" />
<div 
              className="text-lg space-y-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.coluna_direita) }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
