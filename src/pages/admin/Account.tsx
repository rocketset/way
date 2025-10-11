// Página Minha Conta
// Permite que usuários personalizem seu perfil
// Visível para: todos os usuários autenticados

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Mail, Briefcase, Globe, Linkedin, Twitter, Instagram, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Account() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    bio: '',
    avatar_url: '',
    site_pessoal: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  });

  // Carrega dados do perfil
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          nome: data.nome || '',
          email: data.email || '',
          cargo: data.cargo || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          site_pessoal: data.site_pessoal || '',
          linkedin: data.linkedin || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar dados do perfil');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          cargo: formData.cargo,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          site_pessoal: formData.site_pessoal,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          instagram: formData.instagram,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Minha Conta</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card de Avatar e Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {formData.nome?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL do Avatar</Label>
                <div className="flex gap-2">
                  <Input
                    id="avatar_url"
                    type="url"
                    placeholder="https://exemplo.com/avatar.jpg"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Nome e Email */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">
                  <User className="inline h-4 w-4 mr-2" />
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-2" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="cargo">
                <Briefcase className="inline h-4 w-4 mr-2" />
                Cargo
              </Label>
              <Input
                id="cargo"
                placeholder="Ex: Gerente de E-commerce"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card de Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_pessoal">
                <Globe className="inline h-4 w-4 mr-2" />
                Site Pessoal
              </Label>
              <Input
                id="site_pessoal"
                type="url"
                placeholder="https://seusite.com"
                value={formData.site_pessoal}
                onChange={(e) => setFormData({ ...formData, site_pessoal: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">
                <Linkedin className="inline h-4 w-4 mr-2" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/seu-perfil"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">
                <Twitter className="inline h-4 w-4 mr-2" />
                Twitter
              </Label>
              <Input
                id="twitter"
                type="url"
                placeholder="https://twitter.com/seu-usuario"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">
                <Instagram className="inline h-4 w-4 mr-2" />
                Instagram
              </Label>
              <Input
                id="instagram"
                type="url"
                placeholder="https://instagram.com/seu-usuario"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
