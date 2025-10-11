// Página de gerenciamento de categorias da Way Academy
// Apenas administradores podem criar, editar e excluir categorias

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';

type AcademyCategory = {
  id: string;
  nome: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
};

export default function AcademyCategories() {
  const [categories, setCategories] = useState<AcademyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ordem: 0,
    ativo: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_categories')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setCategories((data || []) as AcademyCategory[]);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('academy_categories')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Categoria atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('academy_categories')
          .insert([formData]);

        if (error) throw error;
        toast.success('Categoria criada com sucesso!');
      }

      setDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: AcademyCategory) => {
    setEditingId(category.id);
    setFormData({
      nome: category.nome,
      descricao: category.descricao || '',
      ordem: category.ordem,
      ativo: category.ativo,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('academy_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Categoria excluída com sucesso!');
      fetchCategories();
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      ordem: 0,
      ativo: true,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias da Academy</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as categorias de materiais e cursos
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Categoria</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Cases, Mentorias, Profissionalize"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Breve descrição da categoria"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem de Exibição</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={formData.ordem}
                  onChange={(e) =>
                    setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, ativo: checked })
                  }
                />
                <Label htmlFor="ativo">Categoria Ativa</Label>
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

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma categoria cadastrada ainda.
              </p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{category.nome}</h3>
                        {!category.ativo && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                            Inativa
                          </span>
                        )}
                      </div>
                      {category.descricao && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.descricao}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Ordem: {category.ordem}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
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
