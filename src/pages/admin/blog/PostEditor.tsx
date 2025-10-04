// ============================================
// PÁGINA DE EDIÇÃO/CRIAÇÃO DE POST
// ============================================
// Editor completo estilo WordPress para criar e editar posts
// Acesse via: /admin/blog/posts/new ou /admin/blog/posts/edit/:id

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { MediaSelector } from '@/components/editor/MediaSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Clock, CheckCircle2 } from 'lucide-react';
import { PostFormData, PostStatus, Category } from '@/types/editor';
import { generateUniqueSlug, isValidSlug } from '@/utils/slugUtils';
import { calculateReadingStats } from '@/utils/editorUtils';
import { BlockEditor } from '@/components/editor/BlockEditor';

export default function PostEditor() {
  const { id } = useParams(); // ID do post se for edição
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState<PostFormData>({
    titulo: '',
    slug: '',
    excerpt: '',
    conteudo: [], // Array de blocos (será implementado)
    featured_image: '',
    categoria_id: '',
    categoriesIds: [],
    status: 'draft',
    scheduled_at: undefined,
    is_featured: false,
    seoMeta: {},
  });

  // Estados auxiliares
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // ============================================
  // CARREGAMENTO INICIAL
  // ============================================
  
  useEffect(() => {
    fetchCategories();
    if (id) {
      loadPost(id);
    }
  }, [id]);

  // Carrega categorias do tipo blog
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('tipo', 'blog')
        .order('nome');

      if (error) throw error;
      setCategories((data || []) as Category[]);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  // Carrega post existente para edição
  const loadPost = async (postId: string) => {
    try {
      setLoading(true);
      
      const { data: post, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_meta (*)
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;

      // Buscar categorias associadas
      const { data: postCategoriesData } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', postId);

      const categoriesIds = postCategoriesData?.map(pc => pc.category_id) || [];

      // Preenche o formulário com os dados do post
      setFormData({
        titulo: post.titulo || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        conteudo: post.conteudo ? JSON.parse(post.conteudo) : [],
        featured_image: post.featured_image || '',
        categoria_id: post.categoria_id || '',
        categoriesIds,
        status: post.status || 'draft',
        scheduled_at: post.scheduled_at ? new Date(post.scheduled_at) : undefined,
        is_featured: post.is_featured || false,
        seoMeta: post.post_meta?.[0] || {},
      });

      // Atualiza estatísticas
      setWordCount(post.word_count || 0);
      setReadingTime(post.reading_time || 0);
      
    } catch (error: any) {
      console.error('Erro ao carregar post:', error);
      toast.error('Erro ao carregar post');
      navigate('/admin/blog/posts');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // MANIPULADORES DE EVENTOS
  // ============================================

  // Atualiza o título e gera slug automaticamente
  const handleTitleChange = async (value: string) => {
    setFormData(prev => ({ ...prev, titulo: value }));
    
    // Se não está editando o slug manualmente, gera automaticamente
    if (!isEditingSlug && value.length > 0) {
      const newSlug = await generateUniqueSlug(value, id);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };

  // Valida e atualiza o slug manualmente
  const handleSlugChange = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }));
  };

  const handleSlugBlur = async () => {
    if (!formData.slug) {
      // Se slug está vazio, gera a partir do título
      if (formData.titulo) {
        const newSlug = await generateUniqueSlug(formData.titulo, id);
        setFormData(prev => ({ ...prev, slug: newSlug }));
      }
      return;
    }

    // Valida o formato do slug
    if (!isValidSlug(formData.slug)) {
      toast.error('Slug inválido. Use apenas letras minúsculas, números e hífens.');
      return;
    }
  };

  // Atualiza estatísticas de leitura quando o conteúdo muda
  useEffect(() => {
    if (formData.conteudo.length > 0) {
      const stats = calculateReadingStats(formData.conteudo);
      setWordCount(stats.wordCount);
      setReadingTime(stats.readingTime);
    } else {
      setWordCount(0);
      setReadingTime(0);
    }
  }, [formData.conteudo]);

  // ============================================
  // SALVAR POST
  // ============================================

  const handleSave = async (newStatus?: PostStatus) => {
    // Validações básicas
    if (!formData.titulo.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('O slug é obrigatório');
      return;
    }

    try {
      setIsSaving(true);

      // Dados do post
      const postData = {
        titulo: formData.titulo,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        conteudo: JSON.stringify(formData.conteudo),
        featured_image: formData.featured_image || null,
        categoria_id: formData.categoria_id || null,
        status: newStatus || formData.status,
        scheduled_at: formData.scheduled_at?.toISOString() || null,
        is_featured: formData.is_featured,
        autor_id: user?.id,
        word_count: wordCount,
        reading_time: readingTime,
        publicado: (newStatus || formData.status) === 'published',
      };

      let postId = id;

      if (id) {
        // Atualizar post existente
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Post atualizado com sucesso!');
      } else {
        // Criar novo post
        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select()
          .single();

        if (error) throw error;
        postId = data.id;
        toast.success('Post criado com sucesso!');
        
        // Redireciona para a edição do post recém-criado
        navigate(`/admin/blog/posts/edit/${postId}`, { replace: true });
      }

      // Salva metadados de SEO se houver
      if (postId && Object.keys(formData.seoMeta).length > 0) {
        const seoData = {
          post_id: postId,
          ...formData.seoMeta,
        };

        // Verifica se já existe meta para esse post
        const { data: existingMeta } = await supabase
          .from('post_meta')
          .select('id')
          .eq('post_id', postId)
          .single();

        if (existingMeta) {
          // Atualiza meta existente
          await supabase
            .from('post_meta')
            .update(seoData)
            .eq('post_id', postId);
        } else {
          // Cria novo meta
          await supabase
            .from('post_meta')
            .insert(seoData);
        }
      }

      // Gerenciar categorias via post_categories
      if (postId) {
        // Remover todas as relações existentes
        const { error: deleteError } = await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', postId);

        if (deleteError) {
          console.error('Erro ao deletar categorias antigas:', deleteError);
          toast.error('Não foi possível salvar as categorias. Verifique suas permissões.');
          setIsSaving(false);
          return;
        }

        // Inserir novas relações
        if (formData.categoriesIds.length > 0) {
          const { error: catError } = await supabase
            .from('post_categories')
            .insert(
              formData.categoriesIds.map(categoryId => ({
                post_id: postId,
                category_id: categoryId,
              }))
            );

          if (catError) {
            console.error('Erro ao inserir categorias:', catError);
            toast.error('Não foi possível salvar as categorias. Verifique suas permissões.');
            setIsSaving(false);
            return;
          }

          // Verificar categorias salvas e atualizar o estado
          const { data: savedCategories } = await supabase
            .from('post_categories')
            .select('category_id')
            .eq('post_id', postId);

          if (savedCategories) {
            setFormData(prev => ({
              ...prev,
              categoriesIds: savedCategories.map(c => c.category_id)
            }));
          }
        }
      }

    } catch (error: any) {
      console.error('Erro ao salvar post:', error);
      toast.error(error.message || 'Erro ao salvar post');
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // AÇÕES RÁPIDAS
  // ============================================

  const handlePublish = () => handleSave('published');
  const handleSaveDraft = () => handleSave('draft');
  const handleSchedule = () => handleSave('scheduled');

  const handlePreview = () => {
    if (!id) {
      toast.error('Salve o post antes de visualizar o preview');
      return;
    }
    
    window.open(`/blog/preview/${id}`, '_blank');
    toast.success('Preview aberto em nova aba');
  };

  const handleBack = () => {
    navigate('/admin/blog/posts');
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando post...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MediaSelector
        open={mediaSelectorOpen}
        onClose={() => setMediaSelectorOpen(false)}
        onSelect={(url) => {
          setFormData(prev => ({ ...prev, featured_image: url }));
          setMediaSelectorOpen(false);
        }}
      />
      
      <div className="min-h-screen bg-background">
        {/* ============================================
            BARRA SUPERIOR - AÇÕES E STATUS
            ============================================ */}
      <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Voltar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            {/* Estatísticas */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{wordCount} palavras</span>
              <span>•</span>
              <span>{readingTime} min de leitura</span>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Rascunho
              </Button>

              {formData.status === 'scheduled' ? (
                <Button
                  size="sm"
                  onClick={handleSchedule}
                  disabled={isSaving}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={isSaving}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Publicar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          CONTEÚDO PRINCIPAL
          ============================================ */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============================================
              COLUNA PRINCIPAL - EDITOR
              ============================================ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Digite o título do post..."
                value={formData.titulo}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-4xl font-bold border-0 focus-visible:ring-0 px-0 h-auto"
              />
            </div>

            {/* Slug/Permalink */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">URL:</span>
              <span className="text-muted-foreground">/blog/</span>
              {isEditingSlug ? (
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onBlur={handleSlugBlur}
                  className="h-6 px-2 py-0 text-sm w-auto min-w-[200px]"
                  autoFocus
                />
              ) : (
                <span className="text-primary">{formData.slug || 'slug-do-post'}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setIsEditingSlug(!isEditingSlug)}
              >
                {isEditingSlug ? 'OK' : 'Editar'}
              </Button>
            </div>

            {/* Resumo/Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo (Excerpt)</Label>
              <Textarea
                id="excerpt"
                placeholder="Escreva um breve resumo do post..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                maxLength={300}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.excerpt.length}/300 caracteres
              </p>
            </div>

            {/* Editor de Conteúdo */}
            <BlockEditor
              blocks={formData.conteudo}
              onChange={(blocks) => setFormData(prev => ({ ...prev, conteudo: blocks }))}
              placeholder="Comece a escrever seu conteúdo. Clique em '+ Adicionar Bloco' para inserir texto, imagens, listas e muito mais..."
            />
          </div>

          {/* ============================================
              COLUNA LATERAL - CONFIGURAÇÕES
              ============================================ */}
          <div className="space-y-6">
            {/* Status */}
            <div className="border rounded-lg p-4 bg-card space-y-4">
              <h3 className="font-semibold">Publicação</h3>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as PostStatus }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.status === 'scheduled' && (
                <div className="space-y-2">
                  <Label>Data de Publicação</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_at?.toISOString().slice(0, 16) || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      scheduled_at: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
              )}
            </div>

            {/* Categoria */}
            <div className="border rounded-lg p-4 bg-card space-y-4">
              <h3 className="font-semibold">Categorias</h3>
              <p className="text-sm text-muted-foreground">
                {formData.categoriesIds.length} selecionada(s)
              </p>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {categories.map((category) => {
                  const isChecked = formData.categoriesIds.includes(category.id);
                  return (
                    <div 
                      key={category.id} 
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          setFormData(prev => {
                            const newIds = checked
                              ? [...prev.categoriesIds, category.id]
                              : prev.categoriesIds.filter(id => id !== category.id);
                            return {
                              ...prev,
                              categoriesIds: newIds,
                              categoria_id: newIds[0] || ''
                            };
                          });
                        }}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer flex-1 leading-relaxed"
                      >
                        {category.nome}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Post em Destaque */}
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is-featured" className="text-base font-semibold">
                    Post em Destaque
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Posts em destaque aparecem no topo da listagem do blog
                  </p>
                </div>
                <Switch
                  id="is-featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, is_featured: checked }))
                  }
                />
              </div>
            </div>

            {/* Imagem Destacada */}
            <div className="border rounded-lg p-4 bg-card space-y-4">
              <h3 className="font-semibold">Imagem Destacada</h3>
              
              {formData.featured_image ? (
                <div className="space-y-2">
                  <img
                    src={formData.featured_image}
                    alt="Imagem destacada"
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                  >
                    Remover Imagem
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setMediaSelectorOpen(true)}
                >
                  Definir Imagem Destacada
                </Button>
              )}
            </div>

            {/* SEO */}
            <div className="border rounded-lg p-4 bg-card space-y-4">
              <h3 className="font-semibold">SEO</h3>
              <p className="text-sm text-muted-foreground">
                Painel de SEO completo será implementado aqui
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
