import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { diagnosticHubs } from '@/data/diagnosticData';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosticQuizProps {
  onComplete: (answers: Record<string, boolean>) => void;
  onBack: () => void;
}

export const DiagnosticQuiz = ({ onComplete, onBack }: DiagnosticQuizProps) => {
  const [currentHubIndex, setCurrentHubIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const currentHub = diagnosticHubs[currentHubIndex];
  const Icon = currentHub.icon;
  const progress = ((currentHubIndex + 1) / diagnosticHubs.length) * 100;

  const handleAnswer = (toolId: string, hasIt: boolean) => {
    setAnswers(prev => ({ ...prev, [toolId]: hasIt }));
  };

  const isHubComplete = () => {
    return currentHub.tools.every(tool => answers[tool.id] !== undefined);
  };

  const handleNext = () => {
    if (currentHubIndex < diagnosticHubs.length - 1) {
      setCurrentHubIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentHubIndex > 0) {
      setCurrentHubIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <span className="text-sm text-gray-400">
              {currentHubIndex + 1} de {diagnosticHubs.length} áreas
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>

        {/* Hub atual */}
        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentHub.name}</h2>
              <p className="text-sm text-gray-400">
                {currentHub.tools.length} ferramentas para avaliar
              </p>
            </div>
          </div>

          <p className="text-gray-400 mb-6">
            Marque quais ferramentas você já utiliza no seu e-commerce:
          </p>

          {/* Lista de ferramentas */}
          <div className="space-y-4">
            {currentHub.tools.map((tool) => {
              const answer = answers[tool.id];
              const hasAnswer = answer !== undefined;
              
              return (
                <div
                  key={tool.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    !hasAnswer && "border-gray-700 bg-gray-900/50",
                    answer === true && "border-green-500 bg-green-500/10",
                    answer === false && "border-red-500 bg-red-500/10"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{tool.name}</h3>
                      <p className="text-sm text-gray-400">{tool.description}</p>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant={answer === true ? "default" : "outline"}
                        onClick={() => handleAnswer(tool.id, true)}
                        className={cn(
                          "min-w-[90px]",
                          answer === true 
                            ? "bg-green-600 hover:bg-green-700 border-green-600" 
                            : "border-gray-600 hover:border-green-500 hover:text-green-500"
                        )}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Tenho
                      </Button>
                      <Button
                        size="sm"
                        variant={answer === false ? "default" : "outline"}
                        onClick={() => handleAnswer(tool.id, false)}
                        className={cn(
                          "min-w-[90px]",
                          answer === false 
                            ? "bg-red-600 hover:bg-red-700 border-red-600" 
                            : "border-gray-600 hover:border-red-500 hover:text-red-500"
                        )}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Não tenho
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Navegação */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isHubComplete()}
            className="bg-primary hover:bg-primary/90"
          >
            {currentHubIndex < diagnosticHubs.length - 1 ? (
              <>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Ver Resultado
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
