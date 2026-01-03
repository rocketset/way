import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useActivePopups, useCreatePopupLead, useRegisterPopupView, Popup } from "@/hooks/usePopups";
import { useAuth } from "@/hooks/useAuth";

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem("popup_visitor_id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("popup_visitor_id", visitorId);
  }
  return visitorId;
};

const hasSeenPopup = (popupId: string): boolean => {
  const seen = localStorage.getItem(`popup_seen_${popupId}`);
  return !!seen;
};

const markPopupAsSeen = (popupId: string) => {
  localStorage.setItem(`popup_seen_${popupId}`, new Date().toISOString());
};

export const PopupDisplay = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPopup, setCurrentPopup] = useState<Popup | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [exitIntentEnabled, setExitIntentEnabled] = useState(false);

  const { data: activePopups } = useActivePopups(location.pathname);
  const createLead = useCreatePopupLead();
  const registerView = useRegisterPopupView();

  const showPopup = useCallback((popup: Popup) => {
    // Verifica se deve exibir baseado nas configurações
    const isLoggedIn = !!user;
    if (isLoggedIn && !popup.exibir_para_logados) return;
    if (!isLoggedIn && !popup.exibir_para_visitantes) return;
    
    // Verifica se já foi visto
    if (popup.exibir_uma_vez && hasSeenPopup(popup.id)) return;

    setCurrentPopup(popup);
    setIsOpen(true);
    setFormData({});
    setShowSuccess(false);

    // Registra visualização
    registerView.mutate({
      popupId: popup.id,
      visitorId: getVisitorId(),
      userId: user?.id,
    });
  }, [user, registerView]);

  // Handler para exit intent
  useEffect(() => {
    if (!exitIntentEnabled) return;

    const exitIntentPopup = activePopups?.find(
      p => p.gatilho === 'exit_intent' && (!p.exibir_uma_vez || !hasSeenPopup(p.id))
    );

    if (!exitIntentPopup) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isOpen) {
        showPopup(exitIntentPopup);
        setExitIntentEnabled(false);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitIntentEnabled, activePopups, isOpen, showPopup]);

  // Processa popups ativos
  useEffect(() => {
    if (!activePopups || activePopups.length === 0) return;

    // Habilita exit intent se houver popup configurado
    const hasExitIntent = activePopups.some(p => p.gatilho === 'exit_intent');
    setExitIntentEnabled(hasExitIntent);

    // Processa popups com gatilho ao_carregar ou apos_segundos
    activePopups.forEach(popup => {
      if (popup.exibir_uma_vez && hasSeenPopup(popup.id)) return;

      if (popup.gatilho === 'ao_carregar') {
        showPopup(popup);
      } else if (popup.gatilho === 'apos_segundos') {
        const timeoutId = setTimeout(() => {
          if (!isOpen) showPopup(popup);
        }, (popup.delay_segundos || 0) * 1000);
        
        return () => clearTimeout(timeoutId);
      }
    });
  }, [activePopups, isOpen, showPopup]);

  const handleClose = () => {
    if (currentPopup) {
      markPopupAsSeen(currentPopup.id);
    }
    setIsOpen(false);
    setCurrentPopup(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPopup) return;

    try {
      await createLead.mutateAsync({
        popup_id: currentPopup.id,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        dados_extras: formData,
      });

      setShowSuccess(true);
      markPopupAsSeen(currentPopup.id);

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seus dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleButtonClick = () => {
    if (currentPopup?.link_botao) {
      if (currentPopup.abrir_nova_aba) {
        window.open(currentPopup.link_botao, '_blank');
      } else {
        window.location.href = currentPopup.link_botao;
      }
    }
    handleClose();
  };

  if (!currentPopup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="max-w-md p-0 overflow-hidden border-0"
        style={{ 
          backgroundColor: currentPopup.cor_fundo,
          color: currentPopup.cor_texto 
        }}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
          style={{ color: currentPopup.cor_texto }}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </button>

        {currentPopup.imagem_url && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={currentPopup.imagem_url}
              alt={currentPopup.titulo || "Popup"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium">{currentPopup.texto_sucesso}</p>
            </div>
          ) : (
            <>
              {currentPopup.titulo && (
                <h2 className="text-2xl font-bold mb-2">{currentPopup.titulo}</h2>
              )}
              
              {currentPopup.subtitulo && (
                <p className="text-lg opacity-80 mb-2">{currentPopup.subtitulo}</p>
              )}
              
              {currentPopup.descricao && (
                <p className="opacity-70 mb-6">{currentPopup.descricao}</p>
              )}

              {currentPopup.tipo === 'lead' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {currentPopup.campos_formulario?.includes('nome') && (
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        value={formData.nome || ''}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                        className="mt-1"
                        style={{ borderColor: currentPopup.cor_botao }}
                      />
                    </div>
                  )}
                  
                  {currentPopup.campos_formulario?.includes('email') && (
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-1"
                        style={{ borderColor: currentPopup.cor_botao }}
                      />
                    </div>
                  )}
                  
                  {currentPopup.campos_formulario?.includes('telefone') && (
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone || ''}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="mt-1"
                        style={{ borderColor: currentPopup.cor_botao }}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createLead.isPending}
                    style={{
                      backgroundColor: currentPopup.cor_botao,
                      color: currentPopup.cor_texto_botao,
                    }}
                  >
                    {createLead.isPending ? "Enviando..." : currentPopup.texto_botao}
                  </Button>
                </form>
              ) : (
                <Button
                  onClick={handleButtonClick}
                  className="w-full"
                  style={{
                    backgroundColor: currentPopup.cor_botao,
                    color: currentPopup.cor_texto_botao,
                  }}
                >
                  {currentPopup.texto_botao}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
