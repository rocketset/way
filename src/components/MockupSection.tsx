import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface MockupSectionProps {
  screenshotUrl?: string;
  screenshotUrls?: { url: string; title: string }[];
  title?: string;
  description?: string;
}

const MockupSection = ({
  screenshotUrl,
  screenshotUrls,
  title = "Veja o projeto em ação",
  description = "Navegue pela experiência completa",
}: MockupSectionProps) => {
  // Se não tem imagem única nem múltiplas, não renderiza
  if (!screenshotUrl && (!screenshotUrls || screenshotUrls.length === 0)) return null;

  // Se tem múltiplas imagens, renderiza carrossel
  if (screenshotUrls && screenshotUrls.length > 0) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto max-w-5xl">
          {/* Title */}
          {title && (
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h2>
              {description && <p className="text-base text-muted-foreground max-w-2xl mx-auto">{description}</p>}
            </div>
          )}

          {/* Carousel */}
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {screenshotUrls.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-2xl opacity-50" />
                      
                      {/* Screenshot container */}
                      <div className="relative rounded-xl overflow-hidden shadow-2xl bg-muted/20 border border-border">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-auto relative z-10"
                          loading="lazy"
                        />
                        {/* Título sobreposto */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-700" />
          </div>
        </div>
      </section>
    );
  }

  // Se tem apenas uma imagem, renderiza visualização única
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-5xl">
        {/* Title */}
        {title && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h2>
            {description && <p className="text-base text-muted-foreground max-w-2xl mx-auto">{description}</p>}
          </div>
        )}

        {/* Screenshot */}
        <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-2xl opacity-50" />

          {/* Screenshot container */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-muted/20 border border-border">
            <img
              src={screenshotUrl}
              alt="Website Screenshot"
              className="w-full h-auto relative z-10"
              loading="lazy"
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-700" />
        </div>
      </div>
    </section>
  );
};

export default MockupSection;
