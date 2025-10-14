// Página de autenticação que permite login e criação de conta
// Alterna entre os formulários de login e registro

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useIntencoesCadastro } from '@/hooks/useIntencoesCadastro';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import logoWay from '@/assets/logo-way.png';

// Schema de validação
const cadastroSchema = z.object({
  nome: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  email: z.string().trim().email('E-mail inválido').max(255, 'E-mail muito longo'),
  whatsapp: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'WhatsApp inválido (formato: +5511999999999)').max(20, 'WhatsApp muito longo'),
  emailPrincipal: z.string().trim().email('E-mail principal inválido').max(255, 'E-mail muito longo'),
  empresa: z.string().trim().min(2, 'Nome da empresa deve ter no mínimo 2 caracteres').max(200, 'Nome da empresa muito longo'),
  siteEmpresa: z.string().trim().url('URL inválida').max(500, 'URL muito longa').optional().or(z.literal('')),
  intencaoCadastro: z.string().min(1, 'Selecione uma intenção de cadastro'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [emailPrincipal, setEmailPrincipal] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [siteEmpresa, setSiteEmpresa] = useState('');
  const [intencaoCadastro, setIntencaoCadastro] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { data: intencoes = [], isLoading: loadingIntencoes } = useIntencoesCadastro();

  // Redireciona usuário logado para o dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Função para processar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        // Realiza login
        await signIn(email, password);
      } else {
        // Validar dados do cadastro
        const validation = cadastroSchema.safeParse({
          nome,
          email,
          whatsapp,
          emailPrincipal,
          empresa,
          siteEmpresa,
          intencaoCadastro,
          password,
        });

        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          toast.error('Preencha todos os campos corretamente');
          setLoading(false);
          return;
        }

        // Criar conta
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: validation.data.email,
          password: validation.data.password,
          options: {
            data: {
              nome: validation.data.nome,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Atualizar perfil com dados adicionais
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              whatsapp: validation.data.whatsapp,
              email_principal: validation.data.emailPrincipal,
              empresa: validation.data.empresa,
              site_empresa: validation.data.siteEmpresa || null,
              intencao_cadastro: validation.data.intencaoCadastro,
            })
            .eq('id', authData.user.id);

          if (profileError) {
            console.error('Erro ao atualizar perfil:', profileError);
          }

          // Fazer logout para impedir acesso automático
          await supabase.auth.signOut();

          // Mostrar mensagem de sucesso
          toast.success('Cadastro realizado! Aguarde a aprovação do administrador para acessar a plataforma.', {
            duration: 6000,
          });

          // Limpar formulário
          setNome('');
          setEmail('');
          setPassword('');
          setWhatsapp('');
          setEmailPrincipal('');
          setEmpresa('');
          setSiteEmpresa('');
          setIntencaoCadastro('');
          setErrors({});
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar requisição');
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
            {/* Campos de Registro */}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading}
                  />
                  {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+5511999999999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={loading}
                  />
                  {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailPrincipal">E-mail Principal *</Label>
                  <Input
                    id="emailPrincipal"
                    type="email"
                    placeholder="melhor.contato@email.com"
                    value={emailPrincipal}
                    onChange={(e) => setEmailPrincipal(e.target.value)}
                    disabled={loading}
                  />
                  {errors.emailPrincipal && <p className="text-sm text-destructive">{errors.emailPrincipal}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    type="text"
                    placeholder="Nome da sua empresa"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    disabled={loading}
                  />
                  {errors.empresa && <p className="text-sm text-destructive">{errors.empresa}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteEmpresa">Site da Empresa</Label>
                  <Input
                    id="siteEmpresa"
                    type="url"
                    placeholder="https://www.empresa.com"
                    value={siteEmpresa}
                    onChange={(e) => setSiteEmpresa(e.target.value)}
                    disabled={loading}
                  />
                  {errors.siteEmpresa && <p className="text-sm text-destructive">{errors.siteEmpresa}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intencaoCadastro">Intenção de Cadastro *</Label>
                  <Select
                    value={intencaoCadastro}
                    onValueChange={setIntencaoCadastro}
                    disabled={loading || loadingIntencoes}
                  >
                    <SelectTrigger id="intencaoCadastro">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {intencoes.map((intencao) => (
                        <SelectItem key={intencao.id} value={intencao.nome}>
                          {intencao.nome}
                          {intencao.descricao && (
                            <span className="text-xs text-muted-foreground block">
                              {intencao.descricao}
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.intencaoCadastro && <p className="text-sm text-destructive">{errors.intencaoCadastro}</p>}
                </div>
              </>
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
