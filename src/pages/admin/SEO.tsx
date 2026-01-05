import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Globe, FileText, Settings2, ExternalLink, 
  Save, Plus, Trash2, Eye, AlertCircle, CheckCircle2,
  Twitter, Image, Link2, Code, MapPin
} from "lucide-react";
import {
  usePageSeoList,
  useUpdatePageSeo,
  useGlobalSeoSettings,
  useUpdateGlobalSeoSettings,
  useCreatePageSeo,
  useDeletePageSeo,
  PageSeo,
} from "@/hooks/usePageSeo";
import { useSitemapConfig, SITEMAP_URL } from "@/hooks/useSitemapConfig";

type SitemapStatus = 'pending' | 'generating' | 'success' | 'error';

const SEO = () => {
  const { data: pages, isLoading: pagesLoading } = usePageSeoList();
  const { data: globalSettings, isLoading: globalLoading } = useGlobalSeoSettings();
  const { data: sitemapConfig } = useSitemapConfig();
  const updatePageSeo = useUpdatePageSeo();
  const updateGlobalSettings = useUpdateGlobalSeoSettings();
  const createPageSeo = useCreatePageSeo();
  const deletePageSeo = useDeletePageSeo();

  const [selectedPage, setSelectedPage] = useState<PageSeo | null>(null);
  const [globalForm, setGlobalForm] = useState({
    site_name: "",
    site_title_suffix: "",
    default_og_image: "",
    twitter_site: "",
    google_site_verification: "",
    bing_site_verification: "",
    robots_txt: "",
  });
  const [pageForm, setPageForm] = useState({
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    canonical_url: "",
    noindex: false,
    nofollow: false,
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    twitter_site: "",
  });
  const [newPageDialog, setNewPageDialog] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    page_key: "",
    page_name: "",
  });

  // Carregar configurações globais
  useEffect(() => {
    if (globalSettings) {
      setGlobalForm({
        site_name: globalSettings.site_name || "",
        site_title_suffix: globalSettings.site_title_suffix || "",
        default_og_image: globalSettings.default_og_image || "",
        twitter_site: globalSettings.twitter_site || "",
        google_site_verification: globalSettings.google_site_verification || "",
        bing_site_verification: globalSettings.bing_site_verification || "",
        robots_txt: globalSettings.robots_txt || "",
      });
    }
  }, [globalSettings]);

  // Carregar dados da página selecionada
  useEffect(() => {
    if (selectedPage) {
      setPageForm({
        meta_title: selectedPage.meta_title || "",
        meta_description: selectedPage.meta_description || "",
        meta_keywords: selectedPage.meta_keywords || "",
        og_title: selectedPage.og_title || "",
        og_description: selectedPage.og_description || "",
        og_image: selectedPage.og_image || "",
        canonical_url: selectedPage.canonical_url || "",
        noindex: selectedPage.noindex || false,
        nofollow: selectedPage.nofollow || false,
        twitter_title: selectedPage.twitter_title || "",
        twitter_description: selectedPage.twitter_description || "",
        twitter_image: selectedPage.twitter_image || "",
        twitter_site: selectedPage.twitter_site || "",
      });
    }
  }, [selectedPage]);

  const handleSaveGlobalSettings = () => {
    if (!globalSettings?.id) return;
    updateGlobalSettings.mutate({
      id: globalSettings.id,
      updates: globalForm,
    });
  };

  const handleSavePageSeo = () => {
    if (!selectedPage?.id) return;
    updatePageSeo.mutate({
      id: selectedPage.id,
      updates: pageForm,
    });
  };

  const handleCreatePage = () => {
    createPageSeo.mutate({
      page_key: newPageForm.page_key,
      page_name: newPageForm.page_name,
    }, {
      onSuccess: () => {
        setNewPageDialog(false);
        setNewPageForm({ page_key: "", page_name: "" });
      }
    });
  };

  const handleDeletePage = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta página?")) {
      deletePageSeo.mutate(id);
      setSelectedPage(null);
    }
  };

  const getTitleLength = (title: string) => {
    const len = title.length;
    if (len === 0) return { status: "warning", text: "Não definido" };
    if (len < 30) return { status: "warning", text: `${len}/60 (muito curto)` };
    if (len > 60) return { status: "error", text: `${len}/60 (muito longo)` };
    return { status: "success", text: `${len}/60` };
  };

  const getDescriptionLength = (desc: string) => {
    const len = desc.length;
    if (len === 0) return { status: "warning", text: "Não definido" };
    if (len < 70) return { status: "warning", text: `${len}/160 (muito curto)` };
    if (len > 160) return { status: "error", text: `${len}/160 (muito longo)` };
    return { status: "success", text: `${len}/160` };
  };

  const normalizeTitlePart = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();

  const getDisplayTitle = (page: PageSeo) => {
    const t = (page.meta_title || "").trim();
    return t.length ? t : page.page_name;
  };

  const buildPreviewTitle = (page: PageSeo) => {
    const base = getDisplayTitle(page);
    const suffixRaw = globalForm.site_title_suffix || "";
    const suffix = suffixRaw.trim();

    if (!suffix) return base;

    if (normalizeTitlePart(base).endsWith(normalizeTitlePart(suffix))) {
      return base;
    }

    return `${base}${suffixRaw}`;
  };

  if (pagesLoading || globalLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações de SEO do site
          </p>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Páginas</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Sitemap</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Páginas */}
        <TabsContent value="pages" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de páginas */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Páginas</CardTitle>
                  <Dialog open={newPageDialog} onOpenChange={setNewPageDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Página</DialogTitle>
                        <DialogDescription>
                          Adicione uma nova página para configurar SEO
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Chave da Página</Label>
                          <Input
                            placeholder="ex: sobre-nos"
                            value={newPageForm.page_key}
                            onChange={(e) => setNewPageForm({ ...newPageForm, page_key: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Identificador único (slug)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Nome da Página</Label>
                          <Input
                            placeholder="ex: Sobre Nós"
                            value={newPageForm.page_name}
                            onChange={(e) => setNewPageForm({ ...newPageForm, page_name: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreatePage} disabled={!newPageForm.page_key || !newPageForm.page_name}>
                          Criar Página
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-1 p-3">
                    {pages?.map((page) => {
                      const titleStatus = getTitleLength(page.meta_title || "");
                      const hasIssues = titleStatus.status !== "success" || 
                        getDescriptionLength(page.meta_description || "").status !== "success";
                      
                      return (
                        <button
                          key={page.id}
                          onClick={() => setSelectedPage(page)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedPage?.id === page.id
                              ? "bg-primary/10 border border-primary"
                              : "hover:bg-muted border border-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium line-clamp-2">
                              {getDisplayTitle(page)}
                            </span>
                            {hasIssues ? (
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            /{page.page_key}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Editor da página */}
            <Card className="lg:col-span-2">
              {selectedPage ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedPage.page_name}</CardTitle>
                        <CardDescription>/{selectedPage.page_key}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePage(selectedPage.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSavePageSeo}
                          disabled={updatePageSeo.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Básico</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                        <TabsTrigger value="advanced">Avançado</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4 mt-4">
                        {/* Meta Title */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Meta Title</Label>
                            <Badge 
                              variant={
                                getTitleLength(pageForm.meta_title).status === "success" ? "default" :
                                getTitleLength(pageForm.meta_title).status === "warning" ? "secondary" : "destructive"
                              }
                            >
                              {getTitleLength(pageForm.meta_title).text}
                            </Badge>
                          </div>
                          <Input
                            value={pageForm.meta_title}
                            onChange={(e) => setPageForm({ ...pageForm, meta_title: e.target.value })}
                            placeholder="Título da página para buscadores"
                          />
                        </div>

                        {/* Meta Description */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Meta Description</Label>
                            <Badge 
                              variant={
                                getDescriptionLength(pageForm.meta_description).status === "success" ? "default" :
                                getDescriptionLength(pageForm.meta_description).status === "warning" ? "secondary" : "destructive"
                              }
                            >
                              {getDescriptionLength(pageForm.meta_description).text}
                            </Badge>
                          </div>
                          <Textarea
                            value={pageForm.meta_description}
                            onChange={(e) => setPageForm({ ...pageForm, meta_description: e.target.value })}
                            placeholder="Descrição da página para buscadores"
                            rows={3}
                          />
                        </div>

                        {/* Keywords */}
                        <div className="space-y-2">
                          <Label>Keywords</Label>
                          <Input
                            value={pageForm.meta_keywords}
                            onChange={(e) => setPageForm({ ...pageForm, meta_keywords: e.target.value })}
                            placeholder="palavra1, palavra2, palavra3"
                          />
                          <p className="text-xs text-muted-foreground">
                            Separe as palavras-chave por vírgula
                          </p>
                        </div>

                        {/* Canonical URL */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Link2 className="w-4 h-4" />
                            Canonical URL
                          </Label>
                          <Input
                            value={pageForm.canonical_url}
                            onChange={(e) => setPageForm({ ...pageForm, canonical_url: e.target.value })}
                            placeholder="https://wayecommerce.com.br/pagina"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="social" className="space-y-4 mt-4">
                        {/* Open Graph */}
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Open Graph (Facebook/LinkedIn)
                          </h4>
                          <div className="space-y-2">
                            <Label>OG Title</Label>
                            <Input
                              value={pageForm.og_title}
                              onChange={(e) => setPageForm({ ...pageForm, og_title: e.target.value })}
                              placeholder="Título para redes sociais"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>OG Description</Label>
                            <Textarea
                              value={pageForm.og_description}
                              onChange={(e) => setPageForm({ ...pageForm, og_description: e.target.value })}
                              placeholder="Descrição para redes sociais"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Image className="w-4 h-4" />
                              OG Image URL
                            </Label>
                            <Input
                              value={pageForm.og_image}
                              onChange={(e) => setPageForm({ ...pageForm, og_image: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        {/* Twitter */}
                        <div className="space-y-4 pt-4 border-t">
                          <h4 className="font-medium flex items-center gap-2">
                            <Twitter className="w-4 h-4" />
                            Twitter Card
                          </h4>
                          <div className="space-y-2">
                            <Label>Twitter Title</Label>
                            <Input
                              value={pageForm.twitter_title}
                              onChange={(e) => setPageForm({ ...pageForm, twitter_title: e.target.value })}
                              placeholder="Título para Twitter"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Twitter Description</Label>
                            <Textarea
                              value={pageForm.twitter_description}
                              onChange={(e) => setPageForm({ ...pageForm, twitter_description: e.target.value })}
                              placeholder="Descrição para Twitter"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Twitter Image URL</Label>
                            <Input
                              value={pageForm.twitter_image}
                              onChange={(e) => setPageForm({ ...pageForm, twitter_image: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Twitter @site</Label>
                            <Input
                              value={pageForm.twitter_site}
                              onChange={(e) => setPageForm({ ...pageForm, twitter_site: e.target.value })}
                              placeholder="@wayecommerce"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-4 mt-4">
                        {/* Indexação */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Indexação</h4>
                          <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                              <p className="font-medium">Noindex</p>
                              <p className="text-sm text-muted-foreground">
                                Impede que esta página seja indexada
                              </p>
                            </div>
                            <Switch
                              checked={pageForm.noindex}
                              onCheckedChange={(checked) => setPageForm({ ...pageForm, noindex: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                              <p className="font-medium">Nofollow</p>
                              <p className="text-sm text-muted-foreground">
                                Impede que links sejam seguidos
                              </p>
                            </div>
                            <Switch
                              checked={pageForm.nofollow}
                              onCheckedChange={(checked) => setPageForm({ ...pageForm, nofollow: checked })}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-[500px]">
                  <div className="text-center text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma página para editar</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Configurações Globais */}
        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais de SEO</CardTitle>
              <CardDescription>
                Configurações que se aplicam a todo o site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome do Site</Label>
                  <Input
                    value={globalForm.site_name}
                    onChange={(e) => setGlobalForm({ ...globalForm, site_name: e.target.value })}
                    placeholder="Way E-commerce"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sufixo do Título</Label>
                  <Input
                    value={globalForm.site_title_suffix}
                    onChange={(e) => setGlobalForm({ ...globalForm, site_title_suffix: e.target.value })}
                    placeholder=" | Way E-commerce"
                  />
                  <p className="text-xs text-muted-foreground">
                    Será adicionado ao final de todos os títulos
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Imagem OG Padrão
                </Label>
                <Input
                  value={globalForm.default_og_image}
                  onChange={(e) => setGlobalForm({ ...globalForm, default_og_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter @site
                  </Label>
                  <Input
                    value={globalForm.twitter_site}
                    onChange={(e) => setGlobalForm({ ...globalForm, twitter_site: e.target.value })}
                    placeholder="@wayecommerce"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Google Site Verification</Label>
                  <Input
                    value={globalForm.google_site_verification}
                    onChange={(e) => setGlobalForm({ ...globalForm, google_site_verification: e.target.value })}
                    placeholder="Código de verificação"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bing Site Verification</Label>
                <Input
                  value={globalForm.bing_site_verification}
                  onChange={(e) => setGlobalForm({ ...globalForm, bing_site_verification: e.target.value })}
                  placeholder="Código de verificação"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  robots.txt
                </Label>
                <Textarea
                  value={globalForm.robots_txt}
                  onChange={(e) => setGlobalForm({ ...globalForm, robots_txt: e.target.value })}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleSaveGlobalSettings}
                disabled={updateGlobalSettings.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Sitemap */}
        <TabsContent value="sitemap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap</CardTitle>
              <CardDescription>
                Informações sobre o sitemap do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold text-green-500">
                    {sitemapConfig?.status === 'success' ? 'Gerado' : 'Pendente'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Total de URLs</p>
                  <p className="text-2xl font-bold">{sitemapConfig?.total_urls || 0}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Última Geração</p>
                  <p className="text-lg font-medium">
                    {sitemapConfig?.last_generated_at 
                      ? new Date(sitemapConfig.last_generated_at).toLocaleDateString('pt-BR')
                      : 'Nunca'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button asChild variant="outline">
                  <a href={SITEMAP_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver sitemap.xml
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground">
                  O sitemap é gerado dinamicamente a cada acesso
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Páginas no Sitemap</h4>
                <div className="border rounded-lg divide-y">
                  {pages?.filter(p => p.ativo && !p.noindex).map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium">{getDisplayTitle(page)}</p>
                        <p className="text-sm text-muted-foreground">/{page.page_key}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Preview */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview de Busca</CardTitle>
              <CardDescription>
                Veja como suas páginas aparecem nos resultados de busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pages?.slice(0, 5).map((page) => (
                <div key={page.id} className="p-4 rounded-lg border bg-card">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      https://wayecommerce.com.br/{page.page_key === 'home' ? '' : page.page_key}
                    </p>
                    <p className="text-lg text-blue-600 hover:underline cursor-pointer font-medium">
                      {buildPreviewTitle(page)}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {page.meta_description || "Descrição não definida..."}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEO;
