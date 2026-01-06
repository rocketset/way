import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTotalTools } from '@/data/diagnosticData';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Shield, 
  Zap, 
  Target, 
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  ShoppingCart,
  Settings,
  Users,
  Megaphone,
  LayoutGrid,
  RefreshCw,
  LineChart,
  Lightbulb,
  Eye,
  FileCheck
} from 'lucide-react';

interface DiagnosticLandingProps {
  onStart: () => void;
}

export const DiagnosticLanding = ({ onStart }: DiagnosticLandingProps) => {
  const totalTools = getTotalTools();

  const strategicPillars = [
    {
      icon: Target,
      title: 'Diagnóstico & Estratégia',
      description: 'Clareza sobre onde você está e para onde deve ir'
    },
    {
      icon: ShoppingCart,
      title: 'Plataforma & Arquitetura',
      description: 'Base tecnológica preparada para crescer'
    },
    {
      icon: Settings,
      title: 'Estruturação de Operação',
      description: 'Processos, times e fluxos que sustentam escala'
    },
    {
      icon: TrendingUp,
      title: 'Performance & Crescimento',
      description: 'Dados, métricas e evolução contínua'
    },
    {
      icon: Users,
      title: 'CRM & Automação',
      description: 'Relacionamento, recompra e inteligência de dados'
    },
    {
      icon: Megaphone,
      title: 'Tráfego & Criativos',
      description: 'Aquisição orientada a performance e conversão'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Hero Section - Evoluído */}
      <section id="hero-diagnostico" className="relative py-20 lg:py-28 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30">
                Diagnóstico de Maturidade — 100% Gratuito
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Seu e-commerce tem{' '}
                <span className="text-primary">estrutura</span>{' '}
                para crescer de forma previsível?
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                Descubra o nível de maturidade da sua operação em 5 minutos. 
                Identifique gargalos, priorize investimentos e tome decisões baseadas em dados — não em achismo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={onStart}
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 group"
                >
                  Descobrir meu nível de maturidade
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 pt-2">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  5 minutos
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Dados protegidos
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Resultado instantâneo
                </span>
              </div>
            </div>
            
            {/* Right - Floating Cards */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                {/* Main visual element */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/20" />
                
                {/* Floating cards */}
                <div className="absolute top-8 left-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl animate-float-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <LayoutGrid className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Estrutura antes da escala</p>
                      <p className="text-xs text-gray-400">Metodologia Way</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-0 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl animate-float-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Decisão baseada em dados</p>
                      <p className="text-xs text-gray-400">Não em achismo</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-1/4 left-8 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl animate-float-fast">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Método validado em +190 projetos</p>
                      <p className="text-xs text-gray-400">Operações reais</p>
                    </div>
                  </div>
                </div>
                
                {/* Central graph visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-primary/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating animation styles */}
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
          .animate-float-medium { animation: float-medium 3s ease-in-out infinite 0.5s; }
          .animate-float-fast { animation: float-fast 2.5s ease-in-out infinite 1s; }
        `}</style>
      </section>

      {/* O Problema Real do Lojista - NOVA SEÇÃO */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-medium mb-4">
              O CENÁRIO REAL
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Você reconhece{' '}
              <span className="text-red-400">algum desses sintomas?</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: AlertTriangle,
                pain: 'Vendas instáveis',
                detail: 'Meses bons seguidos de quedas sem explicação clara'
              },
              {
                icon: TrendingUp,
                pain: 'Tráfego que não converte',
                detail: 'Investe em mídia, mas o retorno não acompanha'
              },
              {
                icon: Settings,
                pain: 'Operação travando crescimento',
                detail: 'Processos manuais que consomem tempo e geram erros'
              },
              {
                icon: HelpCircle,
                pain: 'Falta de clareza sobre prioridades',
                detail: 'Muitas opções, sem saber por onde começar'
              },
              {
                icon: Target,
                pain: 'Decisões no achismo',
                detail: 'Sem dados confiáveis para embasar estratégias'
              },
              {
                icon: RefreshCw,
                pain: 'Retrabalho constante',
                detail: 'Apaga incêndios ao invés de evoluir o negócio'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={index}
                  className="bg-gray-800/30 border-gray-700/50 p-5 hover:border-red-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                      <Icon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.pain}</h3>
                      <p className="text-gray-400 text-sm">{item.detail}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-gray-400 text-lg">
              Se você se identificou, o problema pode não ser <span className="text-white">falta de esforço</span> — 
              mas sim <span className="text-primary">falta de estrutura</span>.
            </p>
          </div>
        </div>
      </section>

      {/* O que é o Diagnóstico - NOVA SEÇÃO */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                ENTENDA O DIAGNÓSTICO
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                O que é o Diagnóstico de{' '}
                <span className="text-primary">Maturidade Way</span>?
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Uma avaliação estruturada que mapeia {totalTools} pontos críticos da sua operação 
                de e-commerce em 6 áreas estratégicas. Em minutos, você visualiza onde está 
                perdendo oportunidades e quais investimentos trariam maior retorno.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">É:</strong> Uma ferramenta de diagnóstico estratégico desenvolvida a partir de +190 projetos reais de e-commerce
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-1 shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">Não é:</strong> Um quiz genérico de marketing ou ferramenta superficial de pontuação
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Faz sentido para você se:
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Já vende online e quer estruturar o crescimento</li>
                  <li>• Sente que a operação trava a evolução do negócio</li>
                  <li>• Quer entender onde investir primeiro</li>
                  <li>• Busca clareza para tomar decisões estratégicas</li>
                </ul>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Pode não ser o momento se:
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Ainda não tem loja online em operação</li>
                  <li>• Busca apenas dicas rápidas de marketing</li>
                  <li>• Não pretende investir em evolução estruturada</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* O que você vai descobrir - EVOLUÍDO */}
      <section id="o-que-descobre" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm font-medium mb-4">
              ESCALAR E-COMMERCE EXIGE ESTRUTURA, NÃO APENAS FERRAMENTAS
            </span>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Seu negócio precisa de{' '}
              <span className="text-primary">bases sólidas</span>{' '}
              para crescer e escalar
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Avaliamos sua maturidade em 6 pilares estratégicos que sustentam operações de e-commerce de alta performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {strategicPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 p-5 text-center hover:border-primary/50 transition-all group"
                >
                  <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2">{pillar.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </Card>
              );
            })}
          </div>
          
          {/* Visual connector */}
          <div className="flex justify-center mt-10">
            <div className="relative">
              <svg width="300" height="60" viewBox="0 0 300 60" className="text-primary/40">
                <path d="M0 0 Q75 60 150 30 Q225 0 300 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                <circle cx="150" cy="30" r="6" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-primary italic text-lg">
              Estrutura, método e performance atuando juntos<br />
              para sustentar decisões estratégicas no e-commerce.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona - AJUSTADO */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simples, rápido e{' '}
              <span className="text-primary">sem complicação</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Em 3 passos você tem clareza sobre sua operação
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Preencha seus dados',
                description: 'Informações básicas para personalizar seu relatório',
                time: '1 min',
                icon: FileCheck
              },
              {
                step: '02',
                title: 'Responda o diagnóstico',
                description: 'Marque quais ferramentas e processos você já utiliza',
                time: '3 min',
                icon: CheckCircle
              },
              {
                step: '03',
                title: 'Receba sua análise',
                description: 'Score de maturidade + prioridades claras de evolução',
                time: 'Instantâneo',
                icon: BarChart3
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  <Card className="bg-gray-800/30 border-gray-700 p-6 text-center h-full hover:border-primary/50 transition-all">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-xs text-primary font-bold">PASSO {item.step}</span>
                    <h3 className="font-semibold text-white text-lg mt-2 mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      {item.time}
                    </span>
                  </Card>
                  {/* Connector arrow */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-primary/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Por que fazer o diagnóstico - INSERIDA/EVOLUÍDA */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que fazer{' '}
              <span className="text-primary">esse diagnóstico?</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Não é sobre vender serviço — é sobre ganhar consciência estratégica
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Eye,
                title: 'Clareza de decisão',
                description: 'Visualize exatamente onde sua operação está forte e onde precisa de atenção — sem achismo'
              },
              {
                icon: Target,
                title: 'Priorização de investimentos',
                description: 'Saiba onde colocar tempo e dinheiro primeiro para ter o maior impacto possível'
              },
              {
                icon: AlertTriangle,
                title: 'Identificação de gargalos',
                description: 'Descubra o que está travando seu crescimento antes que se torne um problema maior'
              },
              {
                icon: TrendingUp,
                title: 'Base para escala',
                description: 'Entenda se sua estrutura atual sustenta o crescimento que você busca'
              },
              {
                icon: Lightbulb,
                title: 'Direcionamentos práticos',
                description: 'Receba recomendações que podem ser aplicadas imediatamente na sua operação'
              },
              {
                icon: BarChart3,
                title: 'Benchmark de mercado',
                description: 'Compare sua maturidade com operações que já passaram pelo mesmo estágio'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 p-6 flex gap-4 hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção Visual - Cards Suspensos */}
      <section id="quem-somos" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Metodologia aplicada em mais de{' '}
                <span className="text-primary">190 projetos</span>{' '}
                de e-commerce
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                A Way E-commerce atua na implantação, estruturação e aceleração de operações digitais 
                para indústrias, redes de lojas e varejistas. Da decisão à execução, conectamos 
                estratégia, tecnologia e performance para sustentar a escala.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">+190</p>
                  <p className="text-sm text-gray-400">Projetos B2B, B2C e B2B2C</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">1 ano</p>
                  <p className="text-sm text-gray-400">Soluções de ponta a ponta</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">700</p>
                  <p className="text-sm text-gray-400">Clientes atendidos</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: LayoutGrid,
                    title: 'Estruturação Estratégica',
                    description: 'Implantamos operações com base em diagnóstico, arquitetura de tecnologia e processos claros.'
                  },
                  {
                    icon: RefreshCw,
                    title: 'Evolução Contínua',
                    description: 'Atuamos de forma próxima, acompanhando dados, operação e performance para orientar decisões.'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Escala com Previsibilidade',
                    description: 'Com a base estruturada, focamos em crescimento sustentável, expansão de canais e performance.'
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card 
                      key={index}
                      className="bg-gray-800/70 backdrop-blur-sm border-gray-700 p-6 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="h-6 w-6 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - EXPANDIDO */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dúvidas frequentes
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: 'É realmente gratuito?',
                answer: 'Sim, 100% gratuito. Não pedimos cartão de crédito nem qualquer forma de pagamento. O diagnóstico é uma ferramenta de avaliação sem compromisso.'
              },
              {
                question: 'Quanto tempo leva?',
                answer: 'Menos de 5 minutos. O questionário é objetivo, com respostas simples sobre ferramentas e processos que você utiliza ou não.'
              },
              {
                question: 'Meus dados estão seguros?',
                answer: 'Absolutamente. Seus dados são protegidos e nunca serão compartilhados com terceiros. Utilizamos as informações apenas para gerar seu diagnóstico personalizado.'
              },
              {
                question: 'O que acontece depois do diagnóstico?',
                answer: 'Você recebe seu score de maturidade instantaneamente, com análise detalhada por área e recomendações priorizadas. A decisão de seguir adiante é sua.'
              },
              {
                question: 'Serve para loja física que está entrando no digital?',
                answer: 'O diagnóstico é focado em operações de e-commerce já em funcionamento. Se você ainda está planejando sua entrada no digital, pode ser cedo para essa avaliação.'
              },
              {
                question: 'Preciso já estar vendendo online?',
                answer: 'Sim. O diagnóstico avalia ferramentas e processos de operações ativas. Se ainda não tem loja online, recomendamos primeiro estruturar o básico.'
              },
              {
                question: 'O diagnóstico gera direcionamentos práticos?',
                answer: 'Sim. Além do score geral e por área, você recebe prioridades claras do que evoluir primeiro, baseado no estágio atual da sua operação.'
              }
            ].map((item, index) => (
              <Card 
                key={index}
                className="bg-gray-800/50 border-gray-700 p-6 hover:border-gray-600 transition-colors"
              >
                <h3 className="font-semibold text-white mb-2 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  {item.question}
                </h3>
                <p className="text-gray-400 text-sm pl-7">{item.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - REFINADO */}
      <section className="py-24 px-4 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6 border border-primary/30">
            Comece agora — leva apenas 5 minutos
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para descobrir o nível de{' '}
            <span className="text-primary">maturidade</span>{' '}
            do seu e-commerce?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Tome decisões estratégicas baseadas em dados — não em achismo. 
            Identifique gargalos, priorize investimentos e evolua com clareza.
          </p>
          
          <Button 
            size="lg" 
            onClick={onStart}
            className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 group shadow-lg shadow-primary/20"
          >
            Descobrir meu nível de maturidade agora
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mt-6">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              100% Gratuito
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Resultado instantâneo
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Sem compromisso
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
