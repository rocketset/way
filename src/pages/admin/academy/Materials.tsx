// Página de Guias e Materiais da Way Academy
// Lista materiais e guias organizados para os clientes

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Search, 
  Clock, 
  Filter,
  BookOpen,
  File,
  Video,
  FolderOpen
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Material = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  formato: string;
  duracao: string | null;
  arquivo_url: string | null;
  capa_url: string | null;
  categoria_id: string | null;
  publicado: boolean;
  criado_em: string;
  categoria?: {
    id: string;
    nome: string;
  } | null;
};

type Category = {
  id: string;
  nome: string;
};

export default function AcademyMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_content')
        .select(`
          *,
          categoria:academy_categories(id, nome)
        `)
        .eq('tipo', 'material')
        .eq('publicado', true)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setMaterials((data || []) as Material[]);
    } catch (error: any) {
      console.error('Erro ao carregar materiais:', error);
      toast.error('Erro ao carregar materiais');
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
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const getFormatIcon = (formato: string) => {
    switch (formato) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'documento':
        return <File className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getFormatLabel = (formato: string) => {
    switch (formato) {
      case 'video':
        return 'Vídeo';
      case 'pdf':
        return 'PDF';
      case 'documento':
        return 'Documento';
      case 'zip':
        return 'Arquivo ZIP';
      default:
        return formato;
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.categoria_id === selectedCategory;
    const matchesFormat = selectedFormat === 'all' || material.formato === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Guias e Materiais</h1>
          <p className="text-muted-foreground mt-1">
            Acesse materiais de apoio, guias e documentos exclusivos
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar materiais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos formatos</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="documento">Documento</SelectItem>
                  <SelectItem value="zip">ZIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum material encontrado</h3>
            <p className="text-muted-foreground text-center mt-1">
              {searchTerm || selectedCategory !== 'all' || selectedFormat !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Novos materiais serão adicionados em breve'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="group hover:shadow-lg transition-all duration-300">
              {material.capa_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={material.capa_url}
                    alt={material.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className={material.capa_url ? 'pt-4' : ''}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getFormatIcon(material.formato)}
                    <span className="text-xs uppercase">{getFormatLabel(material.formato)}</span>
                  </div>
                  {material.categoria && (
                    <Badge variant="secondary" className="text-xs">
                      {material.categoria.nome}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-2 line-clamp-2">{material.titulo}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {material.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {material.duracao && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{material.duracao}</span>
                    </div>
                  )}
                  {material.arquivo_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="ml-auto"
                    >
                      <a href={material.arquivo_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-center text-sm text-muted-foreground">
        {filteredMaterials.length} material(is) encontrado(s)
      </div>
    </div>
  );
}
