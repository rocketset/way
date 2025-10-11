import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Users, ShoppingBag, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface CaseItem {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
  categories?: { nome: string };
}

const CasesSection = () => {
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        id,
        titulo,
        descricao,
        imagem_url,
        categories (nome)
      `)
      .eq('publicado', true)
      .eq('is_featured', true)
      .order('criado_em', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching cases:', error);
      return;
    }

    setCases(data || []);
  };

  const gradients = [
    "from-rose-500 to-pink-600",
    "from-purple-500 to-indigo-600",
    "from-amber-500 to-orange-600"
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
        <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
          {cases.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              Nenhum case em destaque no momento.
            </p>
          ) : (
            cases.map((caseItem, index) => (
              <div
                key={caseItem.id}
                className="group relative animate-fade-in cursor-pointer h-64 rounded-2xl overflow-hidden"
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCase(index)}
                onMouseLeave={() => setHoveredCase(null)}
                onClick={() => navigate(`/cases/${caseItem.id}`)}
              >
                {/* Background Image */}
                <img
                  src={caseItem.imagem_url || "/placeholder.svg"}
                  alt={caseItem.titulo}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 transition-all duration-500" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-8">
                  {/* Tags */}
                  {caseItem.categories?.nome && (
                    <div className="flex gap-2">
                      <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-sm shadow-lg uppercase">
                        {caseItem.categories.nome}
                      </span>
                    </div>
                  )}
                  
                  {/* Title */}
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {caseItem.titulo}
                    </h3>
                    <p className="text-white/80 text-lg max-w-2xl">
                      {caseItem.descricao}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Button 
            onClick={() => navigate('/cases')}
            className="bg-gray-900 text-white hover:bg-gray-800 px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>VER TODOS OS CASES</span>
            <ExternalLink className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
