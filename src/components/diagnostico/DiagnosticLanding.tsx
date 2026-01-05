import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { diagnosticHubs, getTotalTools } from '@/data/diagnosticData';
import { ArrowRight, CheckCircle, Clock, Shield, Zap, Target, TrendingUp } from 'lucide-react';

interface DiagnosticLandingProps {
  onStart: () => void;
}

export const DiagnosticLanding = ({ onStart }: DiagnosticLandingProps) => {
  const totalTools = getTotalTools();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center space-y-6">
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Avaliação 100% Gratuita
            </span>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Descubra o nível de{' '}
              <span className="text-primary">maturidade</span>{' '}
              do seu e-commerce
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Avaliação gratuita em 5 minutos que revela exatamente onde você está 
              perdendo vendas e como resolver
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                onClick={onStart}
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              >
                Iniciar Diagnóstico Gratuito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 pt-4">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                5 minutos
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Dados seguros
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Resultado instantâneo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* O que você vai descobrir */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que você vai descobrir
            </h2>
            <p className="text-gray-400 text-lg">
              Analisamos {totalTools} ferramentas essenciais em 5 áreas estratégicas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {diagnosticHubs.map((hub) => {
              const Icon = hub.icon;
              return (
                <Card 
                  key={hub.id}
                  className="bg-gray-800/50 border-gray-700 p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{hub.name}</h3>
                  <p className="text-sm text-gray-400">
                    {hub.tools.length} ferramentas
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-gray-400 text-lg">
              Simples, rápido e sem complicação
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Preencha seus dados',
                description: 'Apenas informações básicas para personalizar seu relatório',
                time: '1 min'
              },
              {
                step: '02',
                title: 'Responda o questionário',
                description: 'Marque quais ferramentas você já utiliza no seu e-commerce',
                time: '3 min'
              },
              {
                step: '03',
                title: 'Receba seu diagnóstico',
                description: 'Relatório completo com score, análise e recomendações',
                time: 'Instantâneo'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 mb-2">{item.description}</p>
                <span className="text-xs text-primary">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que fazer o diagnóstico?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                title: 'Identifique lacunas',
                description: 'Descubra exatamente quais ferramentas estão faltando para escalar suas vendas'
              },
              {
                icon: TrendingUp,
                title: 'Priorize investimentos',
                description: 'Saiba onde investir primeiro para ter o maior retorno possível'
              },
              {
                icon: CheckCircle,
                title: 'Compare com o mercado',
                description: 'Entenda como sua loja está em relação às melhores práticas do mercado'
              },
              {
                icon: Zap,
                title: 'Ações imediatas',
                description: 'Receba recomendações práticas que podem ser implementadas agora'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 p-6 flex gap-4"
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

      {/* FAQ */}
      <section className="py-20 px-4">
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
                answer: 'Sim, 100% gratuito. Não pedimos cartão de crédito nem qualquer forma de pagamento.'
              },
              {
                question: 'Quanto tempo leva?',
                answer: 'Menos de 5 minutos. O questionário é simples e direto, com respostas de sim ou não.'
              },
              {
                question: 'Meus dados estão seguros?',
                answer: 'Absolutamente. Seus dados são protegidos e nunca serão compartilhados com terceiros.'
              },
              {
                question: 'O que acontece depois?',
                answer: 'Você recebe seu diagnóstico instantaneamente, com score, análise detalhada e recomendações personalizadas.'
              }
            ].map((item, index) => (
              <Card 
                key={index}
                className="bg-gray-800/50 border-gray-700 p-6"
              >
                <h3 className="font-semibold text-white mb-2">{item.question}</h3>
                <p className="text-gray-400 text-sm">{item.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-t from-primary/20 to-transparent">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para descobrir o potencial do seu e-commerce?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Faça o diagnóstico agora e receba recomendações personalizadas
          </p>
          <Button 
            size="lg" 
            onClick={onStart}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
          >
            Iniciar Diagnóstico Gratuito
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};
