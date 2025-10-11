// Página para redefinir senha após clicar no link do email
// Permite ao usuário criar uma nova senha

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import logoWayLight from '@/assets/logo-way-light.png';
import logoWayDark from '@/assets/logo-way-dark.png';

export default function ResetPassword() {
  const { actualTheme } = useTheme();
  const logoWay = actualTheme === 'dark' ? logoWayDark : logoWayLight;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Verifica se há um token de recuperação válido
  useEffect(() => {
    const checkRecoveryToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type !== 'recovery') {
        toast.error('Link de recuperação inválido ou expirado');
        navigate('/auth/login');
      }
    };

    checkRecoveryToken();
  }, [navigate]);

  // Validação de senha
  const validatePassword = () => {
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return false;
    }
    
    return true;
  };

  // Atualiza a senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast.success('Senha atualizada com sucesso!');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error: any) {
      toast.error('Erro ao redefinir senha: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Senha atualizada!</h2>
            <p className="text-muted-foreground mb-4">
              Sua senha foi redefinida com sucesso.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecionando para o painel...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Redefinir Senha
          </CardTitle>
          <CardDescription className="text-center">
            Crie uma nova senha segura para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Requisitos da senha */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>A senha deve conter:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li className={password.length >= 6 ? 'text-green-600' : ''}>
                  Pelo menos 6 caracteres
                </li>
                <li className={password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}>
                  Senhas devem coincidir
                </li>
              </ul>
            </div>

            {/* Botão de Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando senha...
                </>
              ) : (
                'Atualizar Senha'
              )}
            </Button>

            {/* Link para voltar ao login */}
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => navigate('/auth/login')}
                className="text-muted-foreground hover:text-primary transition-colors"
                disabled={loading}
              >
                Voltar para o login
              </button>
            </div>

            {/* Logotipo */}
            <div className="flex justify-center mt-6">
              <img 
                src={logoWay} 
                alt="Way+ E-commerce" 
                className="h-10 opacity-50"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
