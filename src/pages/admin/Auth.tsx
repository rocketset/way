// Página de autenticação que permite login e criação de conta
// Alterna entre os formulários de login e registro

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoWay from '@/assets/logo-way.png';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Controla se está em modo login ou registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redireciona usuário logado para o dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Função para processar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Realiza login
        await signIn(email, password);
      } else {
        // Realiza registro
        if (!nome.trim()) {
          setLoading(false);
          return;
        }
        await signUp(email, password, nome);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar email de redefinição de senha
  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Por favor, digite seu e-mail primeiro');
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success('Email enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha.');
    } catch (error: any) {
      toast.error('Erro ao enviar email: ' + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Login' : 'Criar Conta'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Entre com suas credenciais para acessar o painel' 
              : 'Preencha os dados abaixo para criar sua conta'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome - apenas no registro */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {/* Botão de Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                isLogin ? 'Entrar' : 'Criar Conta'
              )}
            </Button>

            {/* Link de esqueci senha - apenas no login */}
            {isLogin && (
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  disabled={loading || resetLoading}
                >
                  {resetLoading ? 'Enviando...' : 'Esqueci minha senha'}
                </button>
              </div>
            )}

            {/* Botão para alternar entre login e registro */}
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {isLogin 
                  ? 'Não tem uma conta? Criar conta' 
                  : 'Já tem uma conta? Fazer login'
                }
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
