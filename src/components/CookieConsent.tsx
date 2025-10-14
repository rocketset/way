import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou/recusou os cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Mostra o banner após um pequeno delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    handleClose();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-300',
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Ícone */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                🍪 Utilizamos cookies
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Utilizamos cookies para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar conteúdo. 
                Ao clicar em "Aceitar", você concorda com o uso de cookies conforme nossa{' '}
                <a 
                  href="/privacy" 
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Privacidade
                </a>.
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                onClick={handleDecline}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Recusar
              </Button>
              <Button
                onClick={handleAccept}
                className="w-full sm:w-auto"
              >
                Aceitar cookies
              </Button>
            </div>

            {/* Botão fechar */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
