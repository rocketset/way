import { Zap, ShoppingCart, TrendingUp } from "lucide-react";
import { useState } from "react";

const WhyWaySection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const benefits = [
    {
      icon: Zap,
      title: "TUDO PRONTO",
      description: "Plataforma completa e pronta para escalar seu e-commerce com todas as ferramentas necessárias.",
      color: "from-yellow-400 to-amber-500",
      iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500"
    },
    {
      icon: ShoppingCart,
      title: "FÁCIL DE USAR",
      description: "Interface intuitiva e recursos simplificados para você gerenciar sua loja sem complicações.",
      color: "from-primary to-yellow-600",
      iconBg: "bg-gradient-to-br from-primary to-yellow-600"
    },
    {
      icon: TrendingUp,
      title: "SUPORTE COMPLETO",
      description: "Time dedicado para ajudar seu negócio a crescer com soluções personalizadas e atendimento ágil.",
      color: "from-amber-400 to-orange-500",
      iconBg: "bg-gradient-to-br from-amber-400 to-orange-500"
    }
  ];

  return (
    <section id="por-que-way" className="relative py-32 bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={`bg-dot-${i}`}
            className="absolute rounded-full bg-primary/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with animated underline */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in relative">
              Por que a Way?
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            </h2>
          </div>
          <p className="text-xl text-muted-foreground mt-8 max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Desenvolvemos soluções completas em e-commerce para empresas que desejam crescer e se destacar no mercado digital.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                className="group relative animate-scale-in"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated glow effect on hover */}
                <div 
                  className={`absolute -inset-1 bg-gradient-to-r ${benefit.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700`}
                />

                {/* Main card */}
                <div
                  className="relative bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
                  style={{
                    transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                  }}
                >
                  {/* Top gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color}`} />

                  {/* Animated corner accent */}
                  <div 
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.color} opacity-5 rounded-bl-full transition-all duration-700`}
                    style={{
                      transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                    }}
                  />

                  {/* Icon container with animation */}
                  <div className="relative mb-8">
                    <div 
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${benefit.iconBg} shadow-lg transition-all duration-500 relative`}
                      style={{
                        transform: isHovered ? 'rotate(360deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                      }}
                    >
                      <Icon className="w-10 h-10 text-white relative z-10" />
                      
                      {/* Pulse effect on hover */}
                      {isHovered && (
                        <>
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} animate-ping opacity-30`} />
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} animate-pulse`} />
                        </>
                      )}
                    </div>

                    {/* Floating particles around icon */}
                    {isHovered && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={`particle-${i}`}
                            className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
                            style={{
                              top: `${Math.sin(i * 60 * Math.PI / 180) * 40 + 35}px`,
                              left: `${Math.cos(i * 60 * Math.PI / 180) * 40 + 35}px`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-amber-600">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base transition-all duration-300 group-hover:text-gray-800">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Animated bottom accent line */}
                  <div 
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${benefit.color} transition-all duration-500`}
                    style={{
                      width: isHovered ? '100%' : '0%',
                    }}
                  />

                  {/* Hover indicator */}
                  <div 
                    className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center`}>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Number indicator */}
                <div 
                  className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-background border-4 border-primary flex items-center justify-center font-bold text-primary text-xl shadow-lg z-20 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative line */}
        <div className="mt-20 flex justify-center">
          <div className="w-64 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default WhyWaySection;
