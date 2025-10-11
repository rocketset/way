// Página de configurações da Way Academy (banner, etc)
// Apenas administradores podem editar

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

export default function AcademySettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    banner_url: '',
    banner_titulo: '',
    banner_descricao: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettingsId(data.id);
        setFormData({
          banner_url: data.banner_url || '',
          banner_titulo: data.banner_titulo || '',
          banner_descricao: data.banner_descricao || '',
        });
      } else {
        // Criar registro inicial se não existir
        const { data: newData, error: insertError } = await supabase
          .from('academy_settings')
          .insert({
            banner_url: '',
            banner_titulo: '',
            banner_descricao: '',
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        if (newData) {
          setSettingsId(newData.id);
        }
      }
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!settingsId) {
        toast.error('ID de configurações não encontrado');
        return;
      }

      const { error } = await supabase
        .from('academy_settings')
        .update(formData)
        .eq('id', settingsId);

      if (error) throw error;
      toast.success('Configurações salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações da Academy</h1>
        <p className="text-muted-foreground mt-2">
          Configure o banner e outras configurações gerais
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banner Principal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FileUpload
              label="Imagem do Banner"
              accept="image/*"
              currentUrl={formData.banner_url}
              onUploadComplete={(url) =>
                setFormData({ ...formData, banner_url: url })
              }
              folder="academy/banners"
              maxSizeMB={5}
              helperText="Recomendado: 1920x400px, máximo 5MB"
            />

            <div className="space-y-2">
              <Label htmlFor="banner_url">Ou Cole a URL da Imagem</Label>
              <Input
                id="banner_url"
                type="url"
                value={formData.banner_url}
                onChange={(e) =>
                  setFormData({ ...formData, banner_url: e.target.value })
                }
                placeholder="https://exemplo.com/banner.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_titulo">Título do Banner</Label>
              <Input
                id="banner_titulo"
                value={formData.banner_titulo}
                onChange={(e) =>
                  setFormData({ ...formData, banner_titulo: e.target.value })
                }
                placeholder="Way Academy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_descricao">Descrição do Banner</Label>
              <Textarea
                id="banner_descricao"
                value={formData.banner_descricao}
                onChange={(e) =>
                  setFormData({ ...formData, banner_descricao: e.target.value })
                }
                placeholder="Desenvolva suas habilidades..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
