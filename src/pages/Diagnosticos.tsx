import { useState } from 'react';
import { DiagnosticLanding } from '@/components/diagnostico/DiagnosticLanding';
import { DiagnosticForm, DiagnosticFormData } from '@/components/diagnostico/DiagnosticForm';
import { DiagnosticQuiz } from '@/components/diagnostico/DiagnosticQuiz';
import { DiagnosticResult } from '@/components/diagnostico/DiagnosticResult';
import { useCreateDiagnostic } from '@/hooks/useDiagnostics';
import { calculateScore } from '@/data/diagnosticData';
import { SEO } from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type DiagnosticStep = 'landing' | 'form' | 'quiz' | 'result';

const Diagnosticos = () => {
  const [step, setStep] = useState<DiagnosticStep>('landing');
  const [userData, setUserData] = useState<DiagnosticFormData | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  
  const createDiagnostic = useCreateDiagnostic();

  const handleStartDiagnostic = () => {
    setStep('form');
  };

  const handleFormSubmit = (data: DiagnosticFormData) => {
    setUserData(data);
    setStep('quiz');
  };

  const handleQuizComplete = async (quizAnswers: Record<string, boolean>) => {
    setAnswers(quizAnswers);
    
    if (userData) {
      const score = calculateScore(quizAnswers);
      
      // Salvar no banco de dados
      await createDiagnostic.mutateAsync({
        name: userData.name,
        email: userData.email,
        store_url: userData.storeUrl,
        instagram: userData.instagram,
        whatsapp: userData.whatsapp,
        answers: quizAnswers,
        score
      });
    }
    
    setStep('result');
  };

  const handleRestart = () => {
    setStep('landing');
    setUserData(null);
    setAnswers({});
  };

  const handleBack = () => {
    switch (step) {
      case 'form':
        setStep('landing');
        break;
      case 'quiz':
        setStep('form');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Diagnóstico E-commerce Gratuito"
        description="Descubra o nível de maturidade do seu e-commerce com nosso diagnóstico gratuito. Avaliação em 5 minutos com recomendações personalizadas."
        keywords="diagnóstico e-commerce, maturidade digital, avaliação loja virtual, ferramentas e-commerce"
      />
      
      {/* Header sem botões de CTA */}
      <Header variant="landing" />
      
      {/* Conteúdo principal - com padding-top para o header fixo */}
      <main className="flex-1 pt-20">
        {step === 'landing' && (
          <DiagnosticLanding onStart={handleStartDiagnostic} />
        )}
        
        {step === 'form' && (
          <DiagnosticForm onSubmit={handleFormSubmit} onBack={handleBack} />
        )}
        
        {step === 'quiz' && (
          <DiagnosticQuiz onComplete={handleQuizComplete} onBack={handleBack} />
        )}
        
        {step === 'result' && userData && (
          <DiagnosticResult 
            userData={userData} 
            answers={answers} 
            onRestart={handleRestart}
          />
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Diagnosticos;
