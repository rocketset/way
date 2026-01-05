import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Code, 
  Palette,
  FileCode,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  useCustomPageById, 
  useCreateCustomPage, 
  useUpdateCustomPage,
} from '@/hooks/useCustomPages';
import { toast } from '@/hooks/use-toast';

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: existingPage, isLoading } = useCustomPageById(id);
  const createMutation = useCreateCustomPage();
  const updateMutation = useUpdateCustomPage();

  // Form state
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [jsContent, setJsContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [noindex, setNoindex] = useState(false);
  const [layout, setLayout] = useState('full');
  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [customHead, setCustomHead] = useState('');
  const [publicado, setPublicado] = useState(false);

  // Preview state
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('html');

  // Load existing page data
  useEffect(() => {
    if (existingPage) {
      setTitulo(existingPage.titulo);
      setSlug(existingPage.slug);
      setHtmlContent(existingPage.html_content || '');
      setCssContent(existingPage.css_content || '');
      setJsContent(existingPage.js_content || '');
      setMetaTitle(existingPage.meta_title || '');
      setMetaDescription(existingPage.meta_description || '');
      setOgImage(existingPage.og_image || '');
      setNoindex(existingPage.noindex);
      setLayout(existingPage.layout);
      setHeaderVisible(existingPage.header_visible);
      setFooterVisible(existingPage.footer_visible);
      setCustomHead(existingPage.custom_head || '');
      setPublicado(existingPage.publicado);
    }
  }, [existingPage]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitulo(value);
    if (!isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!slug.trim()) {
      toast({
        title: "Erro",
        description: "O slug é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const pageData = {
      titulo,
      slug,
      html_content: htmlContent,
      css_content: cssContent,
      js_content: jsContent,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image: ogImage || null,
      noindex,
      layout,
      header_visible: headerVisible,
      footer_visible: footerVisible,
      custom_head: customHead || null,
      publicado,
    };

    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, ...pageData });
      } else {
        const result = await createMutation.mutateAsync(pageData);
        navigate(`/admin/pages/${result.id}/edit`);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Generate preview HTML
  const getPreviewHtml = () => {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle || titulo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    ${cssContent}
  </style>
  ${customHead || ''}
</head>
<body>
  ${htmlContent}
  <script>
    try {
      ${jsContent}
    } catch(e) {
      console.error('Script error:', e);
    }
  </script>
</body>
</html>
    `;
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pages')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Editar Página' : 'Nova Página'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEditing ? `Editando: ${existingPage?.titulo}` : 'Crie uma página personalizada'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="publicado"
              checked={publicado}
              onCheckedChange={setPublicado}
            />
            <Label htmlFor="publicado" className="text-sm">
              {publicado ? 'Publicado' : 'Rascunho'}
            </Label>
          </div>
          <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Basic Info + Editors */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Nome da página"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/p/</span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="url-da-pagina"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5" />
                Editor de Código
              </CardTitle>
              <CardDescription>
                Escreva HTML, CSS e JavaScript para construir sua página
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="html" className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    HTML
                  </TabsTrigger>
                  <TabsTrigger value="css" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="js" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="html">
                  <div className="space-y-2">
                    <Label>Conteúdo HTML</Label>
                    <Textarea
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="<div class='container'>
  <h1>Título da Página</h1>
  <p>Conteúdo da página...</p>
</div>"
                      className="font-mono text-sm min-h-[400px] resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                      Escreva o conteúdo HTML da página. Use classes CSS que você definir na aba CSS.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="css">
                  <div className="space-y-2">
                    <Label>Estilos CSS</Label>
                    <Textarea
                      value={cssContent}
                      onChange={(e) => setCssContent(e.target.value)}
                      placeholder=".container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  font-size: 2.5rem;
}"
                      className="font-mono text-sm min-h-[400px] resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                      Defina os estilos CSS para sua página. Esses estilos serão aplicados apenas a esta página.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="js">
                  <div className="space-y-2">
                    <Label>JavaScript</Label>
                    <Textarea
                      value={jsContent}
                      onChange={(e) => setJsContent(e.target.value)}
                      placeholder="// Código JavaScript da página
document.addEventListener('DOMContentLoaded', function() {
  console.log('Página carregada!');
});"
                      className="font-mono text-sm min-h-[400px] resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                      Adicione interatividade com JavaScript. O código será executado após o carregamento da página.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 pb-2 border-b">
                      <Button
                        variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewDevice('desktop')}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewDevice('tablet')}
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewDevice('mobile')}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-center bg-muted/30 rounded-lg p-4 min-h-[400px]">
                      <iframe
                        srcDoc={getPreviewHtml()}
                        className="bg-white rounded-lg shadow-lg border"
                        style={{ 
                          width: getPreviewWidth(), 
                          height: '500px',
                          maxWidth: '100%',
                        }}
                        title="Preview"
                        sandbox="allow-scripts"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right: Settings */}
        <div className="space-y-6">
          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={titulo || 'Título para buscadores'}
                />
                <p className="text-xs text-muted-foreground">
                  {metaTitle.length}/60 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Descrição da página para buscadores..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {metaDescription.length}/160 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogImage">Imagem OG (compartilhamento)</Label>
                <Input
                  id="ogImage"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="noindex">Ocultar dos buscadores</Label>
                <Switch
                  id="noindex"
                  checked={noindex}
                  onCheckedChange={setNoindex}
                />
              </div>
            </CardContent>
          </Card>

          {/* Layout Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layout">Tipo de Layout</Label>
                <Select value={layout} onValueChange={setLayout}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Largura Total</SelectItem>
                    <SelectItem value="boxed">Centralizado (max-width)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="headerVisible">Mostrar Header</Label>
                <Switch
                  id="headerVisible"
                  checked={headerVisible}
                  onCheckedChange={setHeaderVisible}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="footerVisible">Mostrar Footer</Label>
                <Switch
                  id="footerVisible"
                  checked={footerVisible}
                  onCheckedChange={setFooterVisible}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Head */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scripts Customizados</CardTitle>
              <CardDescription>
                Código adicional para o &lt;head&gt;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customHead}
                onChange={(e) => setCustomHead(e.target.value)}
                placeholder="<script src='...'></script>
<link rel='stylesheet' href='...'>"
                className="font-mono text-sm min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Scripts de terceiros, fontes, etc.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}