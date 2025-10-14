import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import logoWay from '@/assets/logo-way.png';

export default function PendingApproval() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [accountStatus, setAccountStatus] = useState<string>('pending');
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Verifica o status da conta periodicamente
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const checkAccountStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('account_status')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setAccountStatus(data.account_status);
        setCheckingStatus(false);

        // Se foi aprovado, redireciona para o admin
        if (data.account_status === 'approved') {
          navigate('/admin');
        } else if (data.account_status === 'rejected') {
          // Se foi rejeitado, faz logout e redireciona
          await signOut();
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setCheckingStatus(false);
      }
    };

    // Verifica status imediatamente
    checkAccountStatus();

    // Verifica a cada 30 segundos
    const interval = setInterval(checkAccountStatus, 30000);

    return () => clearInterval(interval);
  }, [user, navigate, signOut]);

  const handleLogout = async () => {
    await signOut();
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={logoWay} alt="Way+ E-commerce" className="h-12" />
          </div>
          
          <div className="flex justify-center">
            <div className="rounded-full bg-yellow-100 p-4">
              <Clock className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <CardTitle className="text-2xl">
            Seu cadastro está em moderação
          </CardTitle>
          
          <CardDescription className="text-base">
            Aguarde a liberação do acesso pela nossa equipe
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Cadastro recebido com sucesso</p>
                <p className="text-sm text-muted-foreground">
                  Seus dados foram enviados para análise
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Em análise</p>
                <p className="text-sm text-muted-foreground">
                  Nossa equipe está revisando suas informações
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Você será notificado</p>
                <p className="text-sm text-muted-foreground">
                  Quando o acesso for liberado, você receberá um e-mail de confirmação
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>⏱️ Tempo estimado:</strong> A análise geralmente leva até 24 horas úteis.
              </p>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Caso já tenha aguardado e ainda não consiga entrar, entre em contato com nossa equipe através do e-mail{' '}
              <a href="mailto:contato@waymais.com.br" className="text-primary hover:underline font-medium">
                contato@waymais.com.br
              </a>
            </p>

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Esta página atualiza automaticamente a cada 30 segundos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
