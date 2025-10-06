import { TextColumnsBlockContent } from "@/hooks/useCaseBlocks";

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
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-transparent rounded-full mb-8" />
            {data.coluna_esquerda.split('\n').map((paragraph, index) => (
              <p 
                key={index} 
                className="text-lg hover:text-foreground transition-colors duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="text-muted-foreground leading-relaxed space-y-6 animate-fade-in delay-300">
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mb-8" />
            {data.coluna_direita.split('\n').map((paragraph, index) => (
              <p 
                key={index} 
                className="text-lg hover:text-foreground transition-colors duration-300"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
