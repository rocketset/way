import { Package, Users, BarChart3, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";

const SolutionsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const solutions = [
    {
      icon: Package,
      title: "Plataforma E-commerce Completa",
      description: "Sistema robusto e escalável com todas as funcionalidades necessárias para seu negócio crescer no digital.",
      features: ["Gestão de produtos", "Checkout otimizado", "Múltiplos pagamentos"],
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      iconGradient: "from-violet-400 to-purple-600",
      glowColor: "rgba(168, 85, 247, 0.4)"
    },
    {
      icon: Users,
      title: "Suporte e Logística",
      description: "Equipe especializada e integração com principais operadores logísticos para garantir entregas eficientes.",
      features: ["Suporte 24/7", "Integração logística", "Gestão de estoque"],
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      iconGradient: "from-cyan-400 to-blue-600",
      glowColor: "rgba(59, 130, 246, 0.4)"
    },
    {
      icon: BarChart3,
      title: "Marketing e Analytics",
      description: "Ferramentas completas de análise e marketing para você entender seu público e vender mais.",
      features: ["Dashboard analítico", "Email marketing", "Automações"],
      gradient: "from-amber-500 via-orange-500 to-red-500",
      iconGradient: "from-amber-400 to-orange-600",
      glowColor: "rgba(251, 146, 60, 0.4)"
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (hoveredCard === index) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section id="solucoes" className="relative py-32 bg-gradient-to-b from-background via-background to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary tracking-wider">SOLUÇÕES INTEGRADAS</span>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Soluções integradas</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-primary">
              para seu e-commerce
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Tudo que você precisa em um só lugar para gerenciar e crescer seu negócio online
          </p>
        </div>

        {/* Solutions cards */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseMove={(e) => handleMouseMove(e, index)}
              >
                {/* Animated glow effect */}
                <div 
                  className={`absolute -inset-1 bg-gradient-to-r ${solution.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700`}
                />

                {/* Spotlight effect following mouse */}
                {isHovered && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, ${solution.glowColor}, transparent)`,
                    }}
                  />
                )}

                {/* Main card */}
                <div
                  className="relative bg-card/95 backdrop-blur-sm border-2 border-border hover:border-transparent rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl"
                >
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${solution.gradient}`} />

                  <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10">
                    {/* Left side - Icon and Title (30%) */}
                    <div className="md:w-[30%] flex flex-col items-start gap-6">
                      {/* Icon with 3D effect */}
                      <div className="relative">
                        <div 
                          className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${solution.iconGradient} shadow-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
                          style={{
                            transform: isHovered ? 'rotateY(15deg) rotateX(10deg)' : 'rotateY(0deg) rotateX(0deg)',
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          <Icon className="w-12 h-12 text-white relative z-10" />
                          
                          {/* Rotating ring effect */}
                          {isHovered && (
                            <div className={`absolute inset-0 rounded-2xl border-4 border-transparent bg-gradient-to-r ${solution.gradient} animate-spin`} style={{ animationDuration: '3s' }} />
                          )}

                          {/* Pulse rings */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping opacity-20" />
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse" style={{ animationDuration: '2s' }} />
                        </div>

                        {/* Floating particles */}
                        {isHovered && (
                          <>
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={`particle-${i}`}
                                className="absolute animate-ping"
                                style={{
                                  top: `${Math.sin(i * 60 * Math.PI / 180) * 50 + 48}px`,
                                  left: `${Math.cos(i * 60 * Math.PI / 180) * 50 + 48}px`,
                                  animationDelay: `${i * 0.15}s`,
                                }}
                              >
                                <Zap className="w-3 h-3 text-primary" />
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-yellow-500 transition-all duration-300">
                        {solution.title}
                      </h3>

                      {/* Decorative line */}
                      <div 
                        className={`h-1 bg-gradient-to-r ${solution.gradient} rounded-full transition-all duration-500`}
                        style={{
                          width: isHovered ? '100%' : '40%',
                        }}
                      />
                    </div>

                    {/* Right side - Description and Tags (70%) */}
                    <div className="md:w-[70%] flex flex-col justify-center gap-6">
                      {/* Description */}
                      <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                        {solution.description}
                      </p>

                      {/* Features tags */}
                      <div className="flex flex-wrap gap-3">
                        {solution.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="group/tag relative overflow-hidden"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                          >
                            {/* Tag background with gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${solution.gradient} opacity-10 group-hover/tag:opacity-20 transition-opacity duration-300`} />
                            
                            <div className="relative px-6 py-3 bg-background/50 backdrop-blur-sm border-2 border-border group-hover/tag:border-transparent rounded-full transition-all duration-300 group-hover/tag:scale-105">
                              <span className={`font-semibold text-sm text-foreground group-hover/tag:text-transparent group-hover/tag:bg-clip-text group-hover/tag:bg-gradient-to-r group-hover/tag:${solution.gradient} transition-all duration-300`}>
                                {feature}
                              </span>
                            </div>

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/tag:translate-x-full transition-transform duration-700 rounded-full" />
                          </div>
                        ))}
                      </div>

                      {/* Interactive arrow indicator */}
                      <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <TrendingUp className="w-5 h-5 animate-pulse" />
                        <span className="text-sm font-semibold">Saiba mais sobre esta solução</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom decorative element */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${solution.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Corner accents */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-all duration-500`} />
                  <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${solution.gradient} opacity-0 group-hover:opacity-10 rounded-tr-full transition-all duration-500`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary via-yellow-500 to-primary rounded-full text-gray-900 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <span>Explorar todas as soluções</span>
            <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
