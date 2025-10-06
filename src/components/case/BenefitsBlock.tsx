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
    <section 
      className="py-20 px-6"
      style={{ backgroundColor: data.background_color || "#000000" }}
    >
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.benefits.map((benefit, index) => {
            const Icon = ICON_MAP[benefit.icon] || TrendingUp;
            
            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3">
                  {benefit.titulo}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {benefit.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
