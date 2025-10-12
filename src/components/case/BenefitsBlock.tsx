import { BenefitsBlockContent } from "@/hooks/useCaseBlocks";
import { TrendingUp, Users, ShoppingCart, Award, Zap, Target, Trophy, Rocket, Star, Heart } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface BenefitsBlockProps {
  data: BenefitsBlockContent;
}

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Users,
  ShoppingCart,
  Award,
  Zap,
  Target,
  Trophy,
  Rocket,
  Star,
  Heart,
};

export const BenefitsBlock = ({ data }: BenefitsBlockProps) => {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-card/30 via-background to-background overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Resultados Alcançados
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary via-accent to-transparent rounded-full mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.benefits.map((benefit, index) => {
            const Icon = ICON_MAP[benefit.icon] || TrendingUp;
            
            return (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-primary/50 transition-all duration-500 animate-fade-in hover:scale-105 hover:shadow-2xl hover:shadow-primary/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {benefit.titulo}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {benefit.descricao}
                  </p>
                </div>

                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
