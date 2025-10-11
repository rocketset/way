// Página de gerenciamento de conteúdos da Way Academy
// Permite que administradores e gestores adicionem cursos e materiais

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Video, FileText } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

type AcademyContent = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'curso' | 'material';
  formato: 'video' | 'documento' | 'pdf' | 'zip';
  duracao: string | null;
  arquivo_url: string | null;
  capa_url: string | null;
  categoria_id: string | null;
  ordem: number;
  publicado: boolean;
};

type AcademyCategory = {
  id: string;
  nome: string;
};

export default function AcademyManage() {
  const navigate = useNavigate();
  const [contents, setContents] = useState<AcademyContent[]>([]);
  const [categories, setCategories] = useState<AcademyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'curso' as 'curso' | 'material',
    formato: 'video' as 'video' | 'documento' | 'pdf' | 'zip',
    duracao: '',
    arquivo_url: '',
    capa_url: '',
    categoria_id: '',
    ordem: 0,
    publicado: false,
  });

  useEffect(() => {
    fetchContents();
    fetchCategories();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_content')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setContents((data || []) as AcademyContent[]);
    } catch (error: any) {
      console.error('Erro ao carregar conteúdos:', error);
      toast.error('Erro ao carregar conteúdos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_categories')
        .select('id, nome')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setCategories((data || []) as AcademyCategory[]);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('academy_content')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Conteúdo atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('academy_content')
          .insert([formData]);

        if (error) throw error;
        toast.success('Conteúdo criado com sucesso!');
      }

      setDialogOpen(false);
      resetForm();
      fetchContents();
    } catch (error: any) {
      console.error('Erro ao salvar conteúdo:', error);
      toast.error('Erro ao salvar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: AcademyContent) => {
    setEditingId(content.id);
    setFormData({
      titulo: content.titulo,
      descricao: content.descricao,
      tipo: content.tipo,
      formato: content.formato,
      duracao: content.duracao || '',
      arquivo_url: content.arquivo_url || '',
      capa_url: content.capa_url || '',
      categoria_id: content.categoria_id || '',
      ordem: content.ordem,
      publicado: content.publicado,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este conteúdo?')) return;

    try {
      const { error } = await supabase
        .from('academy_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Conteúdo excluído com sucesso!');
      fetchContents();
    } catch (error: any) {
      console.error('Erro ao excluir conteúdo:', error);
      toast.error('Erro ao excluir conteúdo');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'curso',
      formato: 'video',
      duracao: '',
      arquivo_url: '',
      capa_url: '',
      categoria_id: '',
      ordem: 0,
      publicado: false,
    });
    setEditingId(null);
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
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Academy</h1>
          <p className="text-muted-foreground mt-2">
            Adicione e gerencie cursos e materiais
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Conteúdo' : 'Novo Conteúdo'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <FileUpload
                label="Capa do Material"
                accept="image/*"
                currentUrl={formData.capa_url}
                onUploadComplete={(url) =>
                  setFormData({ ...formData, capa_url: url })
                }
                folder="academy/capas"
                maxSizeMB={3}
                helperText="Recomendado: 400x300px, máximo 3MB"
              />

              <div className="space-y-2">
                <Label htmlFor="capa_url">Ou Cole a URL da Capa</Label>
                <Input
                  id="capa_url"
                  type="url"
                  placeholder="https://exemplo.com/capa.jpg"
                  value={formData.capa_url}
                  onChange={(e) => setFormData({ ...formData, capa_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoria_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: 'curso' | 'material') =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curso">Curso</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formato">Formato</Label>
                  <Select
                    value={formData.formato}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, formato: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="documento">Documento</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="zip">ZIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração</Label>
                  <Input
                    id="duracao"
                    placeholder="Ex: 2h 30min ou 45 páginas"
                    value={formData.duracao}
                    onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ordem">Ordem</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) =>
                      setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <FileUpload
                label="Arquivo do Curso/Material"
                accept={
                  formData.formato === 'video'
                    ? 'video/*'
                    : formData.formato === 'pdf'
                    ? 'application/pdf'
                    : formData.formato === 'zip'
                    ? 'application/zip,.rar'
                    : '*'
                }
                currentUrl={formData.arquivo_url}
                onUploadComplete={(url) =>
                  setFormData({ ...formData, arquivo_url: url })
                }
                folder="academy/arquivos"
                maxSizeMB={100}
                showPreview={formData.formato === 'video'}
                helperText={`Formato: ${formData.formato.toUpperCase()}, máximo 100MB`}
              />

              <div className="space-y-2">
                <Label htmlFor="arquivo_url">Ou Cole a URL do Arquivo</Label>
                <Input
                  id="arquivo_url"
                  type="url"
                  placeholder="https://..."
                  value={formData.arquivo_url}
                  onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="publicado"
                  checked={formData.publicado}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, publicado: checked })
                  }
                />
                <Label htmlFor="publicado">Publicado</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Conteúdos */}
      <div className="grid gap-4">
        {contents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhum conteúdo cadastrado ainda.
              </p>
            </CardContent>
          </Card>
        ) : (
          contents.map((content) => (
            <Card key={content.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {content.formato === 'video' ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{content.titulo}</h3>
                        {!content.publicado && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {content.descricao}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="capitalize">{content.tipo}</span>
                        <span>•</span>
                        <span className="capitalize">{content.formato}</span>
                        {content.duracao && (
                          <>
                            <span>•</span>
                            <span>{content.duracao}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(content)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(content.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
