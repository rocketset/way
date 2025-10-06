import { TextColumnsBlockContent } from "@/hooks/useCaseBlocks";

interface TextColumnsBlockProps {
  data: TextColumnsBlockContent;
}

export const TextColumnsBlock = ({ data }: TextColumnsBlockProps) => {
  const bgColor = "#000000";
  
  return (
    <section 
      className="py-20 px-6"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-gray-300 leading-relaxed space-y-4">
            {data.coluna_esquerda.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="text-gray-300 leading-relaxed space-y-4">
            {data.coluna_direita.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
