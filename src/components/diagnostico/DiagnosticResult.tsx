import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  diagnosticHubs, 
  calculateScore, 
  getScoreLevel, 
  getHubScore,
  getRecommendations,
  getActiveTools
} from '@/data/diagnosticData';
import { DiagnosticFormData } from './DiagnosticForm';
import { ArrowRight, CheckCircle, XCircle, ExternalLink, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosticResultProps {
  userData: DiagnosticFormData;
  answers: Record<string, boolean>;
  onRestart: () => void;
  isModal?: boolean;
}

export const DiagnosticResult = ({ userData, answers, onRestart, isModal = false }: DiagnosticResultProps) => {
  const score = calculateScore(answers);
  const { level, color, bgColor } = getScoreLevel(score);
  const recommendations = getRecommendations(answers);
  const activeTools = getActiveTools(answers);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn(
      "text-white",
      !isModal && "min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12 px-4"
    )}>
      <div className={cn("mx-auto", isModal ? "max-w-full" : "container max-w-4xl")}>
        {/* Score principal */}
        <Card className="bg-gray-800/50 border-gray-700 p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Resultado do Diagnóstico
            </h1>
            <p className="text-gray-400">
              Olá, {userData.name}! Confira abaixo a análise do seu e-commerce.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            {/* Círculo de progresso */}
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={color}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{score}</span>
                <span className="text-sm text-gray-400">pontos</span>
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className={cn("inline-block px-4 py-2 rounded-full text-sm font-medium mb-2", bgColor)}>
                Nível {level}
              </div>
              <p className="text-gray-400 max-w-xs">
                {score === 100 
                  ? 'Parabéns! Seu e-commerce está completo!' 
                  : `Seu e-commerce tem ${score}% das ferramentas essenciais implementadas.`
                }
              </p>
            </div>
          </div>

          {/* Dados do usuário */}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">E-mail:</span>
              <span className="text-white">{userData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Loja:</span>
              <a href={userData.storeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px]">
                {userData.storeUrl}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Instagram:</span>
              <span className="text-white">@{userData.instagram}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">WhatsApp:</span>
              <span className="text-white">{userData.whatsapp}</span>
            </div>
          </div>
        </Card>

        {/* Score por hub */}
        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Análise por área</h2>
          <div className="space-y-4">
            {diagnosticHubs.map((hub) => {
              const hubScore = getHubScore(hub.id, answers);
              const Icon = hub.icon;
              return (
                <div key={hub.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white">{hub.name}</span>
                      <span className="text-sm text-gray-400">{hubScore}%</span>
                    </div>
                    <Progress value={hubScore} className="h-2 bg-gray-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Ferramentas ativas */}
        {activeTools.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Ferramentas que você possui
            </h2>
            <div className="space-y-4">
              {activeTools.map(({ hub, tools }) => (
                <div key={hub.id}>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">{hub.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <span 
                        key={tool.id}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recomendações */}
        {recommendations.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Ferramentas recomendadas
            </h2>
            <div className="space-y-6">
              {recommendations.map(({ hub, tools }) => (
                <div key={hub.id}>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">{hub.name}</h3>
                  <div className="space-y-3">
                    {tools.map((tool) => (
                      <div 
                        key={tool.id}
                        className="p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                      >
                        <h4 className="font-medium text-white mb-1">{tool.name}</h4>
                        <p className="text-sm text-gray-400">{tool.importance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* CTA Way Hub */}
        <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 p-6 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              {score === 100 
                ? 'Parabéns! Você está pronto para o próximo nível'
                : 'Way Hub tem tudo que você precisa'
              }
            </h2>
            <p className="text-gray-300 mb-4">
              {score === 100 
                ? 'Explore nossas soluções avançadas de governança e gestão'
                : 'Implemente todas as ferramentas que faltam com a Way Hub'
              }
            </p>
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90"
            >
              <a href="https://wayhub.pro" target="_blank" rel="noopener noreferrer">
                {score === 100 ? 'Conhecer Way Hub' : 'Implementar com Way Hub'}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Card>

        <Separator className="bg-gray-700 my-6" />

        {/* Ações */}
        {!isModal && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onRestart}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Fazer novo diagnóstico
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
