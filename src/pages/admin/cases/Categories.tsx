// Página de gerenciamento de Categorias de Cases
// CRUD completo para categorias de cases

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  nome: string;
  criado_em: string;
}

export default function CasesCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [nome, setNome] = useState('');

  // Carrega categorias ao montar o componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Função para buscar categorias do tipo case
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('tipo', 'case')
        .order('nome');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar categorias');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Abre o dialog para criar nova categoria
  const handleCreate = () => {
    setEditingCategory(null);
    setNome('');
    setDialogOpen(true);
  };

  // Abre o dialog para editar categoria existente
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNome(category.nome);
    setDialogOpen(true);
  };

  // Função para salvar (criar ou atualizar) categoria
  const handleSave = async () => {
    if (!nome.trim()) {
      toast.error('Digite o nome da categoria');
      return;
    }

    try {
      if (editingCategory) {
        // Atualiza categoria existente
        const { error } = await supabase
          .from('categories')
          .update({ nome })
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('Categoria atualizada!');
      } else {
        // Cria nova categoria
        const { error } = await supabase
          .from('categories')
          .insert({ nome, tipo: 'case' });

        if (error) throw error;
        toast.success('Categoria criada!');
      }

      setDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error('Erro ao salvar categoria');
      console.error('Erro:', error);
    }
  };

  // Função para deletar categoria
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Categoria excluída!');
      fetchCategories();
    } catch (error: any) {
      toast.error('Erro ao excluir categoria');
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categorias de Cases</h1>
          <p className="text-muted-foreground mt-2">
            Organize seus cases por categorias
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Categoria
        </Button>
      </div>

      {/* Tabela de categorias */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhuma categoria cadastrada
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.nome}</TableCell>
                  <TableCell>
                    {new Date(category.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para criar/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Criar Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              Digite o nome da categoria de cases
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: E-commerce, Varejo, etc."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
