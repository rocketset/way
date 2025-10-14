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
        'fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 transition-all duration-300',
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 md:p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            {/* Ícone */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                🍪 Utilizamos cookies
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Utilizamos cookies para melhorar sua experiência. Ao clicar em "Aceitar", você concorda com nossa{' '}
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
            <div className="flex flex-row gap-2 w-full md:w-auto">
              <Button
                onClick={handleDecline}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                Recusar
              </Button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                Aceitar
              </Button>
            </div>

            {/* Botão fechar */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
