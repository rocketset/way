// Página de gerenciamento de Cases
// CRUD completo para cases de sucesso

import { useEffect, useState } from 'react';
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
import { Plus, Pencil, Trash2, FileEdit } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Case {
  id: string;
  titulo: string;
  descricao: string;
  categoria_id: string | null;
  imagem_url: string | null;
  publicado: boolean;
  criado_em: string;
  categories?: { nome: string };
}

interface Category {
  id: string;
  nome: string;
}

export default function CasesList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria_id: '',
    imagem_url: '',
    publicado: false,
    is_featured: false,
  });

  // Carrega cases e categorias ao montar o componente
  useEffect(() => {
    fetchCases();
    fetchCategories();
  }, []);

  // Função para buscar todos os cases
  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          categories (nome)
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar cases');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

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
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Redireciona para a página de criação de case
  const handleCreate = () => {
    navigate('/admin/cases/new');
  };

  // Abre o dialog para editar case existente
  const handleEdit = (caseItem: Case) => {
    setEditingCase(caseItem);
    setFormData({
      titulo: caseItem.titulo,
      descricao: caseItem.descricao,
      categoria_id: caseItem.categoria_id || '',
      imagem_url: caseItem.imagem_url || '',
      publicado: caseItem.publicado,
      is_featured: (caseItem as any).is_featured || false,
    });
    setDialogOpen(true);
  };

  // Função para salvar (criar ou atualizar) case
  const handleSave = async () => {
    if (!formData.titulo.trim() || !formData.descricao.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const caseData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria_id: formData.categoria_id || null,
        imagem_url: formData.imagem_url || null,
        publicado: formData.publicado,
        is_featured: formData.is_featured,
      };

      if (editingCase) {
        // Atualiza case existente
        const { error } = await supabase
          .from('cases')
          .update(caseData)
          .eq('id', editingCase.id);

        if (error) throw error;
        toast.success('Case atualizado com sucesso!');
      } else {
        // Cria novo case
        const { error } = await supabase
          .from('cases')
          .insert(caseData);

        if (error) throw error;
        toast.success('Case criado com sucesso!');
      }

      setDialogOpen(false);
      fetchCases();
    } catch (error: any) {
      toast.error('Erro ao salvar case');
      console.error('Erro:', error);
    }
  };

  // Função para deletar case
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este case?')) return;

    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Case excluído com sucesso!');
      fetchCases();
    } catch (error: any) {
      toast.error('Erro ao excluir case');
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
          <h1 className="text-3xl font-bold">Cases de Sucesso</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os cases da sua empresa
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Case
        </Button>
      </div>

      {/* Tabela de cases */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum case cadastrado
                </TableCell>
              </TableRow>
            ) : (
              cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">{caseItem.titulo}</TableCell>
                  <TableCell>{caseItem.categories?.nome || '-'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      caseItem.publicado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {caseItem.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(caseItem.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/cases/${caseItem.id}/editor`)}
                      title="Editar conteúdo"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(caseItem)}
                      title="Editar informações básicas"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(caseItem.id)}
                      title="Deletar"
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

      {/* Dialog para criar/editar case */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCase ? 'Editar Case' : 'Criar Novo Case'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do case
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
                placeholder="Digite o título do case"
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

            {/* Campo URL da Imagem */}
            <div className="space-y-2">
              <Label htmlFor="imagem_url">URL da Imagem</Label>
              <Input
                id="imagem_url"
                value={formData.imagem_url}
                onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {/* Campo Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Digite a descrição do case"
                rows={8}
              />
            </div>

            {/* Switch Publicado */}
            <div className="flex items-center space-x-2">
              <Switch
                id="publicado"
                checked={formData.publicado}
                onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
              />
              <Label htmlFor="publicado">Publicar case</Label>
            </div>

            {/* Switch Destaque */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Marcar como destaque</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingCase ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
