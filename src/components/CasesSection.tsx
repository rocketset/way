import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Users, ShoppingBag, Sparkles } from "lucide-react";
import catfishCase from "@/assets/catfish-case.png";

const CasesSection = () => {
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);

  const cases = [
    {
      image: catfishCase,
      tag: "MODA",
      brand: "Catfish",
      description: "Peças autorais, estampas exclusivas e qualidade que você sente no vestir.",
      stats: [
        { icon: TrendingUp, label: "+250%", description: "Crescimento" },
        { icon: Users, label: "15k", description: "Clientes" },
        { icon: ShoppingBag, label: "8k", description: "Vendas/mês" }
      ],
      gradient: "from-rose-500 to-pink-600"
    },
    {
      image: catfishCase,
      tag: "MODA",
      brand: "Catfish",
      description: "Peças autorais, estampas exclusivas e qualidade que você sente no vestir.",
      stats: [
        { icon: TrendingUp, label: "+180%", description: "ROI" },
        { icon: Users, label: "22k", description: "Usuários" },
        { icon: ShoppingBag, label: "12k", description: "Pedidos" }
      ],
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      image: catfishCase,
      tag: "MODA",
      brand: "Catfish",
      description: "Peças autorais, estampas exclusivas e qualidade que você sente no vestir.",
      stats: [
        { icon: TrendingUp, label: "+320%", description: "Conversão" },
        { icon: Users, label: "30k", description: "Seguidores" },
        { icon: ShoppingBag, label: "18k", description: "Produtos" }
      ],
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <section id="cases" className="py-32 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary tracking-wider">HISTÓRIAS DE SUCESSO</span>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-gray-900">Cases que </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-primary">
              inspiram
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Conheça empresas que transformaram seus negócios com nossas soluções
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-1 gap-12 max-w-5xl mx-auto">
          {cases.map((caseItem, index) => {
            const isHovered = hoveredCase === index;
            
            return (
              <div
                key={index}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setHoveredCase(index)}
                onMouseLeave={() => setHoveredCase(null)}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${caseItem.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700`} />

                {/* Main card */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 group-hover:border-transparent">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image side */}
                    <div className="relative h-80 md:h-auto overflow-hidden">
                      <img
                        src={caseItem.image}
                        alt={caseItem.brand}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${caseItem.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                      
                      {/* Tag floating */}
                      <div className="absolute top-6 left-6 animate-fade-in">
                        <span className={`inline-block px-6 py-2 bg-white text-gray-900 font-bold rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                          {caseItem.tag}
                        </span>
                      </div>

                      {/* Animated corner accent */}
                      <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${caseItem.gradient} opacity-30 group-hover:opacity-60 transition-all duration-500`} />
                    </div>

                    {/* Content side */}
                    <div className="p-10 flex flex-col justify-between">
                      {/* Brand and description */}
                      <div className="mb-8">
                        <h3 className={`text-4xl font-bold mb-4 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${caseItem.gradient}`}>
                          {caseItem.brand}
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                          {caseItem.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {caseItem.stats.map((stat, idx) => {
                          const Icon = stat.icon;
                          return (
                            <div
                              key={idx}
                              className="relative group/stat"
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${caseItem.gradient} opacity-5 group-hover/stat:opacity-10 rounded-xl transition-opacity duration-300`} />
                              
                              <div className="relative p-4 border-2 border-gray-100 group-hover/stat:border-transparent rounded-xl transition-all duration-300 group-hover/stat:shadow-lg transform group-hover/stat:scale-105">
                                <Icon className={`w-5 h-5 text-gray-400 group-hover/stat:text-transparent group-hover/stat:bg-clip-text group-hover/stat:bg-gradient-to-r group-hover/stat:${caseItem.gradient} mb-2 transition-all duration-300`} />
                                <div className={`text-2xl font-bold text-gray-900 group-hover/stat:text-transparent group-hover/stat:bg-clip-text group-hover/stat:bg-gradient-to-r group-hover/stat:${caseItem.gradient} transition-all duration-300`}>
                                  {stat.label}
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                  {stat.description}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* CTA Button */}
                      <div className="relative">
                        <button className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${caseItem.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group/btn`}>
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                          
                          <span className="relative z-10">Ver caso completo</span>
                          <ExternalLink className="w-5 h-5 relative z-10 group-hover/btn:rotate-45 transition-transform duration-300" />
                          
                          {/* Animated particles */}
                          {isHovered && (
                            <>
                              {[...Array(8)].map((_, i) => (
                                <div
                                  key={`particle-${i}`}
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
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${caseItem.gradient}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Button className="bg-gray-900 text-white hover:bg-gray-800 px-10 py-6 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <span>VER TODOS OS CASES</span>
            <ExternalLink className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
