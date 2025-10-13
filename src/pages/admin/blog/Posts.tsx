// Página de gerenciamento de Posts do Blog
// CRUD completo: Criar, Ler, Atualizar e Deletar posts

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Post {
  id: string;
  titulo: string;
  conteudo: string;
  categoria_id: string | null;
  publicado: boolean;
  status: string;
  criado_em: string;
  categories?: { nome: string };
}

interface Category {
  id: string;
  nome: string;
}

export default function BlogPosts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    categoria_id: '',
    publicado: false,
  });

  // Carrega posts e categorias ao montar o componente
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Função para buscar todos os posts
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar posts');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar categorias do tipo blog
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('tipo', 'blog')
        .order('nome');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Redireciona para a página de criação de post
  const handleCreate = () => {
    navigate('/admin/blog/posts/new');
  };

  // Redireciona para a página de edição de post
  const handleEdit = (post: Post) => {
    navigate(`/admin/blog/posts/edit/${post.id}`);
  };

  // Função para alterar status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus as any })
        .eq('id', id);

      if (error) throw error;
      
      const statusLabels: Record<string, string> = {
        rascunho: 'Rascunho',
        em_edicao: 'Em Edição',
        publicado: 'Publicado',
        published: 'Publicado',
        excluido: 'Excluído',
        draft: 'Rascunho',
        scheduled: 'Agendado',
        archived: 'Arquivado'
      };
      
      toast.success(`Status alterado para: ${statusLabels[newStatus] || newStatus}`);
      fetchPosts();
    } catch (error: any) {
      toast.error('Erro ao atualizar status');
      console.error('Erro:', error);
    }
  };

  // Função para salvar (criar ou atualizar) post
  const handleSave = async () => {
    if (!formData.titulo.trim() || !formData.conteudo.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const postData = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        categoria_id: formData.categoria_id || null,
        publicado: formData.publicado,
        autor_id: user?.id,
      };

      if (editingPost) {
        // Atualiza post existente
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Post atualizado com sucesso!');
      } else {
        // Cria novo post
        const { error } = await supabase
          .from('posts')
          .insert(postData);

        if (error) throw error;
        toast.success('Post criado com sucesso!');
      }

      setDialogOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast.error('Erro ao salvar post');
      console.error('Erro:', error);
    }
  };

  // Função para deletar post
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Post excluído com sucesso!');
      fetchPosts();
    } catch (error: any) {
      toast.error('Erro ao excluir post');
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Posts do Blog</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os posts do seu blog
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Post
        </Button>
      </div>

      {/* Tabela de posts */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhum post cadastrado
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.titulo}</TableCell>
                  <TableCell>
                    <Select
                      value={post.status || 'rascunho'}
                      onValueChange={(value) => handleStatusChange(post.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rascunho">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-gray-500" />
                            Rascunho
                          </span>
                        </SelectItem>
                        <SelectItem value="em_edicao">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            Em Edição
                          </span>
                        </SelectItem>
                        <SelectItem value="publicado">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Publicado
                          </span>
                        </SelectItem>
                        <SelectItem value="excluido">
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Excluído
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(post.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
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

      {/* Dialog para criar/editar post */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Editar Post' : 'Criar Novo Post'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do post
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Campo Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Digite o título do post"
              />
            </div>

            {/* Campo Categoria */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
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

            {/* Campo Conteúdo */}
            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo *</Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                placeholder="Digite o conteúdo do post"
                rows={10}
              />
            </div>

            {/* Switch Publicado */}
            <div className="flex items-center space-x-2">
              <Switch
                id="publicado"
                checked={formData.publicado}
                onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
              />
              <Label htmlFor="publicado">Publicar post</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingPost ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
