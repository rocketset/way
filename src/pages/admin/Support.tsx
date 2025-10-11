// Página de Atendimento
// Permite que usuários entrem em contato com o suporte
// Visível para: todos os usuários autenticados

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Support() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Busca dados do perfil para pegar nome e email
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome, email')
        .eq('id', user?.id)
        .single();

      // Insere na tabela de contatos
      const { error } = await supabase
        .from('contacts')
        .insert({
          nome: profile?.nome || 'Usuário',
          email: profile?.email || user?.email || '',
          mensagem: `[${formData.category}] ${formData.subject}\n\n${formData.message}`,
          empresa: 'Atendimento - Painel Administrativo',
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Mensagem enviada com sucesso!');
      
      // Reseta o formulário
      setFormData({
        subject: '',
        category: '',
        message: '',
      });

      // Remove mensagem de sucesso após 5 segundos
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <HeadphonesIcon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Atendimento</h1>
          <p className="text-muted-foreground mt-1">
            Entre em contato com nossa equipe de suporte
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna principal - Formulário */}
        <div className="lg:col-span-2 space-y-6">
          {submitted ? (
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mensagem enviada!</h3>
                <p className="text-muted-foreground">
                  Recebemos sua solicitação e entraremos em contato em breve.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Nova Solicitação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Suporte Técnico</SelectItem>
                        <SelectItem value="billing">Financeiro</SelectItem>
                        <SelectItem value="academy">Way Academy</SelectItem>
                        <SelectItem value="general">Dúvida Geral</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      placeholder="Descreva brevemente o motivo do contato"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva detalhadamente sua solicitação..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={8}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna lateral - Informações de contato */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Canais de Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    suporte@wayecommerce.com.br
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    (11) 3000-0000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    Seg - Sex: 9h às 18h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Base de Conhecimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consulte nossa base de conhecimento antes de entrar em contato. 
                Muitas dúvidas podem ser resolvidas rapidamente.
              </p>
              <Button variant="outline" className="w-full">
                Acessar FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
