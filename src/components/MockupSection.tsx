import macbookMockup from "@/assets/macbook-mockup.png";

interface MockupSectionProps {
  screenshotUrl?: string;
  title?: string;
  description?: string;
}

const MockupSection = ({
  screenshotUrl,
  title = "Veja o projeto em ação",
  description = "Navegue pela experiência completa",
}: MockupSectionProps) => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        {title && (
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h2>
            {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
          </div>
        )}

        {/* MacBook Mockup */}
        <div className="relative max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
          {/* Glow effect */}
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-50" />

          {/* MacBook container */}
          <div className="relative">
            <img src={macbookMockup} alt="MacBook Pro Mockup" className="w-full h-auto relative z-10" />

            {/* Screenshot overlay - positioned perfectly on screen */}
            {screenshotUrl && (
              <div className="absolute top-[9%] left-[17%] w-[70%] h-[75%] overflow-hidden z-20">
                <img
                  src={screenshotUrl}
                  alt="Website Screenshot dentro do MacBook mockup"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-pulse delay-700" />
        </div>
      </div>
    </section>
  );
};

export default MockupSection;
