import { Zap, ShoppingCart, TrendingUp } from "lucide-react";
import { useState } from "react";
const WhyWaySection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const benefits = [{
    icon: Zap,
    title: "TUDO PRONTO",
    description: "Plataforma completa e pronta para escalar seu e-commerce com todas as ferramentas necessárias.",
    color: "from-yellow-400 to-amber-500",
    iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500"
  }, {
    icon: ShoppingCart,
    title: "FÁCIL DE USAR",
    description: "Interface intuitiva e recursos simplificados para você gerenciar sua loja sem complicações.",
    color: "from-primary to-yellow-600",
    iconBg: "bg-gradient-to-br from-primary to-yellow-600"
  }, {
    icon: TrendingUp,
    title: "SUPORTE COMPLETO",
    description: "Time dedicado para ajudar seu negócio a crescer com soluções personalizadas e atendimento ágil.",
    color: "from-amber-400 to-orange-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500"
  }];
  return <section id="por-que-way" className="relative py-32 bg-background overflow-hidden">
      {/* Animated background elements */}
      

      {/* Gradient overlay */}
      

      
    </section>;
};
export default WhyWaySection;