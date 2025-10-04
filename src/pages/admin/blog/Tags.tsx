// Página de gerenciamento de Tags do Blog
// CRUD completo para tags

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

interface Tag {
  id: string;
  nome: string;
  criado_em: string;
}

export default function BlogTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [nome, setNome] = useState('');

  // Carrega tags ao montar o componente
  useEffect(() => {
    fetchTags();
  }, []);

  // Função para buscar tags do tipo blog
  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('tipo', 'blog')
        .order('nome');

      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar tags');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Abre o dialog para criar nova tag
  const handleCreate = () => {
    setEditingTag(null);
    setNome('');
    setDialogOpen(true);
  };

  // Abre o dialog para editar tag existente
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNome(tag.nome);
    setDialogOpen(true);
  };

  // Função para salvar (criar ou atualizar) tag
  const handleSave = async () => {
    if (!nome.trim()) {
      toast.error('Digite o nome da tag');
      return;
    }

    try {
      if (editingTag) {
        // Atualiza tag existente
        const { error } = await supabase
          .from('tags')
          .update({ nome })
          .eq('id', editingTag.id);

        if (error) throw error;
        toast.success('Tag atualizada!');
      } else {
        // Cria nova tag
        const { error } = await supabase
          .from('tags')
          .insert({ nome, tipo: 'blog' });

        if (error) throw error;
        toast.success('Tag criada!');
      }

      setDialogOpen(false);
      fetchTags();
    } catch (error: any) {
      toast.error('Erro ao salvar tag');
      console.error('Erro:', error);
    }
  };

  // Função para deletar tag
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tag?')) return;

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Tag excluída!');
      fetchTags();
    } catch (error: any) {
      toast.error('Erro ao excluir tag');
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
          <h1 className="text-3xl font-bold">Tags do Blog</h1>
          <p className="text-muted-foreground mt-2">
            Organize seus posts com tags
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Tag
        </Button>
      </div>

      {/* Tabela de tags */}
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
            {tags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhuma tag cadastrada
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.nome}</TableCell>
                  <TableCell>
                    {new Date(tag.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tag)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tag.id)}
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
              {editingTag ? 'Editar Tag' : 'Criar Nova Tag'}
            </DialogTitle>
            <DialogDescription>
              Digite o nome da tag do blog
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: SEO, Social Media, etc."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingTag ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
