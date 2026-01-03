import { Plus, Grid3x3, TrendingUp, RotateCcw } from "lucide-react";
import brazilFlag from "@/assets/brazil-flag.png";
import ClientsCarousel from "./ClientsCarousel";
interface WhyChooseSectionProps {
  className?: string;
}
const WhyChooseSection = ({
  className = ""
}: WhyChooseSectionProps) => {
  const stats = [{
    number: "190",
    label: "Lojas implantadas"
  }, {
    number: "1 ano",
    label: "com soluções de ponta a ponta"
  }, {
    number: "flag",
    label: "Atendemos todo o Brasil",
    isFlag: true
  }, {
    number: "700",
    label: "Clientes atendidos"
  }];
  return <section className={`py-20 px-4 bg-background relative overflow-hidden ${className}`}>
      {/* Animated background elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{
      animationDuration: '6s'
    }} />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{
      animationDuration: '8s',
      animationDelay: '2s'
    }} />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* Section Header with Plus */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-primary text-3xl plus-rotate inline-block">+</span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Por que escolher <span className="gradient-text">a Way E-commerce?</span>
              </h2>
              <span className="text-primary text-3xl plus-rotate inline-block">+</span>
            </div>
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 mt-12">
              {stats.map((stat, index) => <div key={index} className="group relative bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-500 hover-lift cursor-pointer" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Plus icon decorations */}
                  <div className="absolute -top-3 -left-3 text-primary text-2xl opacity-0 group-hover:opacity-100 plus-rotate">+</div>
                  <div className="absolute -bottom-3 -right-3 text-primary text-2xl opacity-0 group-hover:opacity-100 plus-rotate">+</div>
                  
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-125 transition-transform duration-500">
                      {stat.isFlag ? <img src={brazilFlag} alt="Bandeira do Brasil" className="w-20 h-14 mx-auto object-cover rounded-md" /> : stat.number}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>)}
            </div>

            <p className="text-base max-w-4xl mx-auto leading-relaxed mt-12 text-gray-200 md:text-xl">Implantamos, estruturamos e aceleramos operações de e-commerce para indústrias, redes de lojas e varejistas. Atuamos da decisão à execução, conectando estratégia, tecnologia e performance para sustentar a escala.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1 - Soluções Modulares */}
            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover-lift group overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-all duration-700 plus-rotate" />
              
              {/* Animated corner Plus */}
              <div className="absolute top-4 right-4 text-primary text-xl opacity-0 group-hover:opacity-100 plus-rotate transition-all duration-500">+</div>
              
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Grid3x3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Estruturação Estratégica</h3>
                <p className="text-muted-foreground leading-relaxed">Implantamos operações de e-commerce com base em diagnóstico, arquitetura de tecnologia e processos claros. Cada projeto nasce preparado para operar, vender e evoluir sem retrabalho.</p>
              </div>
            </div>

            {/* Card 2 - Transparência */}
            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover-lift group overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-all duration-700 plus-rotate" />
              
              {/* Animated corner Plus */}
              <div className="absolute top-4 right-4 text-primary text-xl opacity-0 group-hover:opacity-100 plus-rotate transition-all duration-500">+</div>
              
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <RotateCcw className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Evolução Contínua</h3>
                <p className="text-muted-foreground leading-relaxed">Atuamos de forma próxima e estratégica, acompanhando dados, operação e performance para orientar decisões, corrigir rotas e evoluir a operação com consistência.</p>
              </div>
            </div>

            {/* Card 3 - Atendimento */}
            <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all duration-500 hover-lift group overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="absolute -top-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-all duration-700 plus-rotate" />
              
              {/* Animated corner Plus */}
              <div className="absolute top-4 right-4 text-primary text-xl opacity-0 group-hover:opacity-100 plus-rotate transition-all duration-500">+</div>
              
              <div className="relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Escala com Previsibilidade</h3>
                <p className="text-muted-foreground leading-relaxed">Com a base estruturada, focamos em crescimento sustentável, expansão de canais e performance. Escalar deixa de ser aposta e passa a ser processo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default WhyChooseSection;