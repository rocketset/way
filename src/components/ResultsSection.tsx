import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";

const ResultsSection = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        
        {/* Floating dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full bg-primary/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Decorative top element */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-primary animate-pulse" />
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-primary animate-pulse" />
          </div>
        </div>

        {/* Main title with animated text */}
        <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="inline-block relative">
            <span className="text-gray-900 relative z-10">Seus </span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 animate-pulse" />
          </span>
          <span className="inline-block relative mx-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-500 to-primary animate-gradient-x">
              resultados
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-primary/30 to-yellow-500/30 rotate-1" />
          </span>
          <span className="inline-block relative">
            <span className="text-gray-900 relative z-10">começam </span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </span>
          <br />
          <span className="inline-block relative mt-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-primary to-amber-600 animate-gradient-x text-8xl md:text-9xl">
              aqui!
            </span>
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-yellow-500/10 blur-2xl animate-pulse" />
          </span>
        </h2>

        {/* Animated subtitle */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-4">
            Transforme sua operação com{" "}
            <span className="font-bold text-primary relative inline-block">
              tecnologia de ponta
              <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4">
                <path d="M0,2 Q50,0 100,2 T200,2" stroke="currentColor" fill="none" strokeWidth="2" className="text-primary">
                  <animate attributeName="d" values="M0,2 Q50,0 100,2 T200,2;M0,2 Q50,4 100,2 T200,2;M0,2 Q50,0 100,2 T200,2" dur="3s" repeatCount="indefinite" />
                </path>
              </svg>
            </span>
            {" "}e suporte especializado.
          </p>
          <p className="text-lg text-gray-600">
            Estamos prontos para impulsionar seu e-commerce ao{" "}
            <span className="font-semibold text-yellow-600">próximo nível</span>.
          </p>
        </div>

        {/* Animated buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {/* Button 1 - Outline with animation */}
          <div 
            className="relative group"
            onMouseEnter={() => setHoveredButton('conhecer')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Animated glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500" />
            
            <Button 
              variant="outline" 
              size="lg"
              className="relative bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold px-8 py-6 text-lg rounded-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              
              <span className="relative z-10 flex items-center gap-2">
                CONHECER MAIS
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${hoveredButton === 'conhecer' ? 'translate-x-1' : ''}`} />
              </span>

              {/* Particles effect */}
              {hoveredButton === 'conhecer' && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`particle-conhecer-${i}`}
                      className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </>
              )}
            </Button>
          </div>

          {/* Button 2 - Primary with animation */}
          <div 
            className="relative group"
            onMouseEnter={() => setHoveredButton('falar')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Animated rotating glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-yellow-500 to-primary rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-500 animate-gradient-x" />
            
            <Button 
              size="lg"
              className="relative bg-gradient-to-r from-primary via-yellow-500 to-primary text-gray-900 hover:shadow-2xl font-bold px-8 py-6 text-lg rounded-lg transition-all duration-300 overflow-hidden group hover:scale-105"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative z-10 flex items-center gap-2">
                FALAR COM A WAY+
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${hoveredButton === 'falar' ? 'translate-x-2 scale-110' : ''}`} />
              </span>

              {/* Sparkles effect */}
              {hoveredButton === 'falar' && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`sparkle-${i}`}
                      className="absolute animate-ping"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  ))}
                </>
              )}

              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-lg border-2 border-primary animate-ping opacity-20" style={{ animationDuration: '2s' }} />
            </Button>
          </div>
        </div>

        {/* Bottom stats or badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          {[
            { number: "500+", label: "Clientes Ativos" },
            { number: "99.9%", label: "Uptime" },
            { number: "24/7", label: "Suporte" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="group cursor-default"
            >
              <div className="relative">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-primary to-yellow-600 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default ResultsSection;
