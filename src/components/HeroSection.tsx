import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import logoWay from "@/assets/logo-way.png";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
      
      {/* Animated dots pattern - World map style */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        >
          {/* Top layer - scattered dots */}
          {[...Array(150)].map((_, i) => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const delay = Math.random() * 3;
            const duration = Math.random() * 3 + 2;
            
            return (
              <div
                key={`dot-${i}`}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `hsl(45 100% ${50 + Math.random() * 20}%)`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  boxShadow: `0 0 ${size * 3}px hsl(45 100% 50% / 0.5)`,
                }}
              />
            );
          })}
          
          {/* World map concentration zones */}
          <div className="absolute left-[20%] top-[40%] w-[30%] h-[30%]">
            {[...Array(80)].map((_, i) => {
              const angle = (i / 80) * Math.PI * 2;
              const radius = Math.random() * 150;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const size = Math.random() * 2 + 1;
              
              return (
                <div
                  key={`zone1-${i}`}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    left: `${50 + x}%`,
                    top: `${50 + y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: `hsl(45 100% 50%)`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              );
            })}
          </div>

          <div className="absolute right-[25%] top-[35%] w-[25%] h-[35%]">
            {[...Array(60)].map((_, i) => {
              const angle = (i / 60) * Math.PI * 2;
              const radius = Math.random() * 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const size = Math.random() * 2 + 1;
              
              return (
                <div
                  key={`zone2-${i}`}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    left: `${50 + x}%`,
                    top: `${50 + y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: `hsl(45 100% 50%)`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Radial glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, hsl(45 100% 50% / 0.15) 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0.5,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Enhanced Logo symbol with Plus icons */}
        <div 
          className="mb-8 animate-fade-in transition-transform duration-700 ease-out relative"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px) scale(${isHovered ? 1.05 : 1})`,
          }}
        >
          {/* Orbiting Plus Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={`orbit-${i}`}
                  className="absolute text-primary/20"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    fontSize: '24px',
                    animation: `orbit ${15}s linear infinite`,
                    animationDelay: `${i * -1.875}s`,
                  }}
                >
                  +
                </div>
              );
            })}
          </div>

          <div className="inline-flex items-start gap-2 relative z-10">
            <span className="text-8xl font-bold gradient-text" style={{ animationDuration: '3s' }}>
              ///
            </span>
            <span className="text-2xl text-primary mt-2 plus-rotate inline-block cursor-pointer">
              +
            </span>
          </div>
        </div>

        {/* Logo image with glow */}
        <div 
          className="mb-12 animate-scale-in transition-all duration-700"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
            filter: `drop-shadow(0 0 ${isHovered ? '40px' : '20px'} hsl(45 100% 50% / 0.3))`,
          }}
        >
          <img 
            src={logoWay} 
            alt="Way+ E-commerce" 
            className="h-24 mx-auto transition-all duration-700"
            style={{
              transform: `scale(${isHovered ? 1.1 : 1})`,
            }}
          />
        </div>

        {/* E-COMMERCE text */}
        <div 
          className="animate-fade-in mb-16"
          style={{ 
            animationDelay: '0.3s',
            transform: `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px)`,
          }}
        >
          <h1 className="text-2xl tracking-[0.5em] font-light text-foreground/90">
            E-COMMERCE
          </h1>
        </div>

        {/* Subtitle with animation */}
        <div 
          className="animate-fade-in max-w-3xl mx-auto"
          style={{ 
            animationDelay: '0.6s',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          }}
        >
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Soluções completas e integradas para transformar seu negócio digital
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-6 py-2 bg-primary/10 text-primary border border-primary/30 rounded-full hover:bg-primary/20 transition-all cursor-default">
              Plataforma Completa
            </span>
            <span className="px-6 py-2 bg-primary/10 text-primary border border-primary/30 rounded-full hover:bg-primary/20 transition-all cursor-default">
              Suporte 24/7
            </span>
            <span className="px-6 py-2 bg-primary/10 text-primary border border-primary/30 rounded-full hover:bg-primary/20 transition-all cursor-default">
              Escalável
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => document.getElementById('por-que-way')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown className="w-8 h-8 text-primary" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = 10 + Math.random() * 10;
          
          return (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${left}%`,
                bottom: '-10px',
                animation: `float-up ${duration}s linear ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(120px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(120px) rotate(-360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
