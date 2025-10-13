// Página de gerenciamento de Cases
// CRUD completo para cases de sucesso

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Case {
  id: string;
  titulo: string;
  descricao: string;
  categoria_id: string | null;
  imagem_url: string | null;
  publicado: boolean;
  is_featured: boolean;
  criado_em: string;
  categories?: { nome: string };
}

export default function CasesList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

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
              <TableHead>Destaque</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                    <Switch
                      checked={caseItem.is_featured || false}
                      onCheckedChange={() => handleToggleFeatured(caseItem.id, caseItem.is_featured || false)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(caseItem.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`/cases/${caseItem.id}`, '_blank')}
                      title="Visualizar case"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/cases/${caseItem.id}/editor`)}
                      title="Editar case"
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
    </div>
  );
}
