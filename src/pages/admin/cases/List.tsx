// Página de gerenciamento de Cases
// CRUD completo para cases de sucesso

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCaseCategories } from '@/hooks/useCaseCategories';
import { Button } from '@/components/ui/button';
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
import { Plus, Pencil, Trash2, Eye, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Case {
  id: string;
  titulo: string;
  descricao: string;
  categoria_id: string | null;
  imagem_url: string | null;
  publicado: boolean;
  content_status: 'rascunho' | 'em_edicao' | 'publicado' | 'excluido';
  is_featured: boolean;
  criado_em: string;
  ordem: number;
  categories?: { nome: string };
}

// Componente de linha arrastável
function SortableRow({ 
  caseItem, 
  categories, 
  onStatusChange, 
  onCategoryChange, 
  onToggleFeatured, 
  onDelete, 
  onView, 
  onEdit 
}: {
  caseItem: Case;
  categories: { id: string; nome: string }[] | undefined;
  onStatusChange: (id: string, status: 'rascunho' | 'em_edicao' | 'publicado' | 'excluido') => void;
  onCategoryChange: (id: string, categoryId: string | null) => void;
  onToggleFeatured: (id: string, currentValue: boolean) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: caseItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted' : ''}>
      <TableCell className="w-[50px]">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{caseItem.titulo}</TableCell>
      <TableCell>
        <Select
          value={caseItem.categoria_id || 'sem-categoria'}
          onValueChange={(value) => onCategoryChange(caseItem.id, value === 'sem-categoria' ? null : value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sem-categoria">Sem categoria</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={caseItem.content_status || 'rascunho'}
          onValueChange={(value) => onStatusChange(caseItem.id, value as 'rascunho' | 'em_edicao' | 'publicado' | 'excluido')}
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
        <Switch
          checked={caseItem.is_featured || false}
          onCheckedChange={() => onToggleFeatured(caseItem.id, caseItem.is_featured || false)}
        />
      </TableCell>
      <TableCell>
        {new Date(caseItem.criado_em).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell className="text-right space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(caseItem.id)}
          title="Visualizar case"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(caseItem.id)}
          title="Editar case"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(caseItem.id)}
          title="Deletar"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function CasesList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: categories } = useCaseCategories();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Carrega cases ao montar o componente
  useEffect(() => {
    fetchCases();
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
        .order('ordem', { ascending: true });

      if (error) throw error;
      setCases(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar cases');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para reordenar após drag
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cases.findIndex((c) => c.id === active.id);
      const newIndex = cases.findIndex((c) => c.id === over.id);

      const newCases = arrayMove(cases, oldIndex, newIndex);
      setCases(newCases);

      // Atualizar ordem no banco de dados
      try {
        const updates = newCases.map((c, index) => ({
          id: c.id,
          ordem: index + 1,
        }));

        for (const update of updates) {
          await supabase
            .from('cases')
            .update({ ordem: update.ordem })
            .eq('id', update.id);
        }

        toast.success('Ordem atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
        toast.error('Erro ao salvar nova ordem');
        fetchCases(); // Recarrega para reverter
      }
    }
  };

  // Função para alterar status
  const handleStatusChange = async (id: string, newStatus: 'rascunho' | 'em_edicao' | 'publicado' | 'excluido') => {
    try {
      const { error } = await supabase
        .from('cases')
        .update({ content_status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      const statusLabels: Record<string, string> = {
        rascunho: 'Rascunho',
        em_edicao: 'Em Edição',
        publicado: 'Publicado',
        excluido: 'Excluído'
      };
      
      toast.success(`Status alterado para: ${statusLabels[newStatus]}`);
      fetchCases();
    } catch (error: any) {
      toast.error('Erro ao atualizar status');
      console.error('Erro:', error);
    }
  };

  // Função para alterar categoria
  const handleCategoryChange = async (id: string, categoryId: string | null) => {
    try {
      const { error } = await supabase
        .from('cases')
        .update({ categoria_id: categoryId })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Categoria atualizada com sucesso!');
      fetchCases();
    } catch (error: any) {
      toast.error('Erro ao atualizar categoria');
      console.error('Erro:', error);
    }
  };

  // Função para alternar destaque
  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('cases')
        .update({ is_featured: !currentValue })
        .eq('id', id);

      if (error) throw error;
      toast.success(
        !currentValue 
          ? 'Case marcado como destaque!' 
          : 'Case removido dos destaques'
      );
      fetchCases();
    } catch (error: any) {
      toast.error('Erro ao atualizar case');
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

  // Redireciona para a página de criação de case
  const handleCreate = () => {
    navigate('/admin/cases/new');
  };

  const handleView = (id: string) => {
    window.open(`/cases/${id}`, '_blank');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/cases/${id}/editor`);
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
            Gerencie os cases da sua empresa. Arraste para reordenar a prioridade de exibição.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Case
        </Button>
      </div>

      {/* Tabela de cases com drag-and-drop */}
      <div className="border rounded-lg">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Ordem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum case cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={cases.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {cases.map((caseItem) => (
                    <SortableRow
                      key={caseItem.id}
                      caseItem={caseItem}
                      categories={categories}
                      onStatusChange={handleStatusChange}
                      onCategoryChange={handleCategoryChange}
                      onToggleFeatured={handleToggleFeatured}
                      onDelete={handleDelete}
                      onView={handleView}
                      onEdit={handleEdit}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
