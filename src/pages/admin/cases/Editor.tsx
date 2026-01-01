import { useParams, useNavigate } from "react-router-dom";
import { useCase } from "@/hooks/useCase";
import { useCaseBlocks } from "@/hooks/useCaseBlocks";
import { useSaveCaseBlock } from "@/hooks/useSaveCaseBlock";
import { useCaseTags } from "@/hooks/useCaseTags";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { IconPicker } from "@/components/editor/IconPicker";
import { TagsAutocomplete } from "@/components/editor/TagsAutocomplete";
import { MediaSelector } from "@/components/editor/MediaSelector";
import FileUpload from "@/components/admin/FileUpload";
import { CaseRichTextEditor } from "@/components/admin/CaseRichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type {
  HeroBlockContent,
  TextColumnsBlockContent,
  BenefitsBlockContent,
  ClientInfoBlockContent,
} from "@/hooks/useCaseBlocks";

export default function CaseEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: caseData, isLoading: caseLoading } = useCase(id!);
  const { data: blocks, isLoading: blocksLoading } = useCaseBlocks(id!);
  const { data: caseTags = [] } = useCaseTags();
  const saveMutation = useSaveCaseBlock();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<"hero-logo" | "hero-main" | "client-logo" | "mockup" | null>(null);
  const [basicDescription, setBasicDescription] = useState<string>("");
  const [basicBannerUrl, setBasicBannerUrl] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const [heroData, setHeroData] = useState<HeroBlockContent>({
    logo_url: "",
    titulo: "",
    subtitulo: "",
    descricao: "",
    tags: [],
    imagem_principal: "",
  });

  const [textColumnsData, setTextColumnsData] = useState<TextColumnsBlockContent>({
    coluna_esquerda: "",
    coluna_direita: "",
  });

  const [benefitsData, setBenefitsData] = useState<BenefitsBlockContent>({
    benefits: [
      { icon: "TrendingUp", titulo: "", descricao: "" },
      { icon: "Users", titulo: "", descricao: "" },
      { icon: "ShoppingCart", titulo: "", descricao: "" },
      { icon: "Award", titulo: "", descricao: "" },
    ],
  });

  const [clientInfoData, setClientInfoData] = useState<ClientInfoBlockContent>({
    logo_cliente: "",
    nome_cliente: "",
    site_cliente: "",
    setor: "",
    localizacao: "",
  });

  const [mockupScreenshotUrl, setMockupScreenshotUrl] = useState<string>("");

  useEffect(() => {
    if (blocks) {
      blocks.forEach((block) => {
        switch (block.block_type) {
          case "client_info":
            setClientInfoData(block.content as ClientInfoBlockContent);
            break;
          case "hero":
            setHeroData(block.content as HeroBlockContent);
            break;
          case "text_columns":
            setTextColumnsData(block.content as TextColumnsBlockContent);
            break;
          case "benefits":
            setBenefitsData(block.content as BenefitsBlockContent);
            break;
        }
      });
    }
  }, [blocks]);

  // Load existing tags for this case
  useEffect(() => {
    const loadCaseTags = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('case_tags')
        .select('tag_id')
        .eq('case_id', id);
      
      if (error) {
        console.error('Error loading case tags:', error);
        return;
      }
      
      setSelectedTagIds(data.map(ct => ct.tag_id));
    };
    
    loadCaseTags();
  }, [id]);

  // Load mockup screenshot URL and basic info
  useEffect(() => {
    if (caseData?.mockup_screenshot_url) {
      setMockupScreenshotUrl(caseData.mockup_screenshot_url);
    }
    if (caseData?.descricao) {
      setBasicDescription(caseData.descricao);
    }
    if (caseData?.imagem_url) {
      setBasicBannerUrl(caseData.imagem_url);
    }
    if (caseData?.publicado !== undefined) {
      setIsPublished(caseData.publicado);
    }
    if (caseData?.is_featured !== undefined) {
      setIsFeatured(caseData.is_featured);
    }
  }, [caseData]);

  const getBlockId = (blockType: string) => {
    return blocks?.find((b) => b.block_type === blockType)?.id;
  };

  const handleImageSelect = (url: string) => {
    if (currentImageField === "hero-logo") {
      setHeroData({ ...heroData, logo_url: url });
    } else if (currentImageField === "hero-main") {
      setHeroData({ ...heroData, imagem_principal: url });
    } else if (currentImageField === "client-logo") {
      setClientInfoData({ ...clientInfoData, logo_cliente: url });
    } else if (currentImageField === "mockup") {
      setMockupScreenshotUrl(url);
    }
    setMediaSelectorOpen(false);
    setCurrentImageField(null);
  };

  const openMediaSelector = (field: "hero-logo" | "hero-main" | "client-logo" | "mockup") => {
    setCurrentImageField(field);
    setMediaSelectorOpen(true);
  };

  const removeImage = (field: "hero-logo" | "hero-main" | "client-logo" | "mockup") => {
    if (field === "hero-logo") {
      setHeroData({ ...heroData, logo_url: "" });
    } else if (field === "hero-main") {
      setHeroData({ ...heroData, imagem_principal: "" });
    } else if (field === "client-logo") {
      setClientInfoData({ ...clientInfoData, logo_cliente: "" });
    } else if (field === "mockup") {
      setMockupScreenshotUrl("");
    }
  };

  const handleSaveAll = async () => {
    try {
      // Save all blocks
      await Promise.all([
        saveMutation.mutateAsync({
          caseId: id!,
          blockType: "client_info",
          content: clientInfoData,
          position: 0,
          blockId: getBlockId("client_info"),
        }),
        saveMutation.mutateAsync({
          caseId: id!,
          blockType: "hero",
          content: heroData,
          position: 1,
          blockId: getBlockId("hero"),
        }),
        saveMutation.mutateAsync({
          caseId: id!,
          blockType: "text_columns",
          content: textColumnsData,
          position: 2,
          blockId: getBlockId("text_columns"),
        }),
        saveMutation.mutateAsync({
          caseId: id!,
          blockType: "benefits",
          content: benefitsData,
          position: 3,
          blockId: getBlockId("benefits"),
        }),
      ]);

      // Update case tags
      await supabase
        .from('case_tags')
        .delete()
        .eq('case_id', id!);
      
      if (selectedTagIds.length > 0) {
        const tagRelations = selectedTagIds.map(tagId => ({
          case_id: id!,
          tag_id: tagId
        }));
        
        await supabase
          .from('case_tags')
          .insert(tagRelations);
      }

      // Save mockup and basic info
      await supabase
        .from('cases')
        .update({ 
          mockup_screenshot_url: mockupScreenshotUrl,
          descricao: basicDescription,
          imagem_url: basicBannerUrl,
          publicado: isPublished,
          is_featured: isFeatured,
          content_status: isPublished ? 'publicado' : 'rascunho'
        })
        .eq('id', id!);
      
      toast.success('Todas as alterações foram salvas!');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Erro ao salvar');
    }
  };

  if (caseLoading || blocksLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/cases/list")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editor de Conteúdo</h1>
          <p className="text-muted-foreground">{caseData?.titulo}</p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="client">Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FileUpload
                  label="1º Imagem - Banner"
                  accept="image/*"
                  currentUrl={basicBannerUrl}
                  onUploadComplete={setBasicBannerUrl}
                  folder="cases/banners"
                  showPreview
                  helperText="Tamanho recomendado: 800x600px"
                />
              </div>

              <div>
                <Label>Logo/Marca</Label>
                <p className="text-xs text-muted-foreground mb-2">Tamanho recomendado: 400x400px (formato quadrado)</p>
                <div className="space-y-2">
                  {heroData.logo_url && (
                    <div className="relative inline-block">
                      <img 
                        src={heroData.logo_url} 
                        alt="Logo preview" 
                        className="h-20 w-auto object-contain border rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage("hero-logo")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMediaSelector("hero-logo")}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {heroData.logo_url ? "Alterar Logo" : "Selecionar Logo"}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Título Principal</Label>
                <Input
                  value={heroData.titulo}
                  onChange={(e) => setHeroData({ ...heroData, titulo: e.target.value })}
                  placeholder="Ex: JADEJADE"
                />
              </div>

              <div>
                <Label>Subtítulo</Label>
                <Input
                  value={heroData.subtitulo}
                  onChange={(e) => setHeroData({ ...heroData, subtitulo: e.target.value })}
                  placeholder="Ex: Loja de moda jovem e moderna"
                />
              </div>

              <div>
                <Label>Breve Resumo</Label>
                <CaseRichTextEditor
                  value={heroData.descricao}
                  onChange={(value) => setHeroData({ ...heroData, descricao: value })}
                  placeholder="Descreva o case de forma detalhada"
                  minHeight="150px"
                />
              </div>

              <div>
                <Label>Imagem Principal (Aparece nas Listagens)</Label>
                <p className="text-xs text-muted-foreground mb-2">Tamanho recomendado: 1920x1080px (proporção 16:9)</p>
                <div className="space-y-2">
                  {heroData.imagem_principal && (
                    <div className="relative inline-block">
                      <img 
                        src={heroData.imagem_principal} 
                        alt="Hero preview" 
                        className="h-32 w-auto object-contain border rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage("hero-main")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMediaSelector("hero-main")}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {heroData.imagem_principal ? "Alterar Imagem" : "Selecionar Imagem"}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <TagsAutocomplete
                  selectedTagIds={selectedTagIds}
                  onChange={setSelectedTagIds}
                  allTags={caseTags}
                  tipo="case"
                  queryKey={['case-tags']}
                />
                </div>

                <div>
                  <Label>Sobre o Cliente</Label>
                  <CaseRichTextEditor
                    value={basicDescription}
                    onChange={(value) => setBasicDescription(value)}
                    placeholder="Digite informações sobre o cliente"
                    minHeight="150px"
                  />
                </div>

                <div>
                  <Label>Coluna da Esquerda - Desafio</Label>
                <CaseRichTextEditor
                  value={textColumnsData.coluna_esquerda}
                  onChange={(value) =>
                    setTextColumnsData({
                      ...textColumnsData,
                      coluna_esquerda: value,
                    })
                  }
                  placeholder="Texto da primeira coluna (use quebras de linha para parágrafos)"
                  minHeight="200px"
                />
              </div>

              <div>
                <Label>Coluna da Direita - Resultado</Label>
                <CaseRichTextEditor
                  value={textColumnsData.coluna_direita}
                  onChange={(value) =>
                    setTextColumnsData({
                      ...textColumnsData,
                      coluna_direita: value,
                    })
                  }
                  placeholder="Texto da segunda coluna (use quebras de linha para parágrafos)"
                  minHeight="200px"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Grid de Benefícios (4 Cards)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefitsData.benefits.map((benefit, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Card {index + 1}</Label>
                        </div>
                        
                        <div>
                          <Label>Ícone</Label>
                          <IconPicker
                            value={benefit.icon}
                            onChange={(iconName) => {
                              const newBenefits = [...benefitsData.benefits];
                              newBenefits[index].icon = iconName;
                              setBenefitsData({
                                ...benefitsData,
                                benefits: newBenefits,
                              });
                            }}
                          />
                        </div>

                        <div>
                          <Label>Título</Label>
                          <Input
                            value={benefit.titulo}
                            onChange={(e) => {
                              const newBenefits = [...benefitsData.benefits];
                              newBenefits[index].titulo = e.target.value;
                              setBenefitsData({
                                ...benefitsData,
                                benefits: newBenefits,
                              });
                            }}
                            placeholder="Título do benefício"
                          />
                        </div>

                        <div>
                          <Label>Descrição</Label>
                          <Textarea
                            value={benefit.descricao}
                            onChange={(e) => {
                              const newBenefits = [...benefitsData.benefits];
                              newBenefits[index].descricao = e.target.value;
                              setBenefitsData({
                                ...benefitsData,
                                benefits: newBenefits,
                              });
                            }}
                            placeholder="Descrição do benefício"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label>Screenshot do Site/App (Mockup)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Imagem do mockup do site/produto (aparece na página de listagem de cases). 
                  <span className="font-semibold text-primary">Tamanho recomendado: 1920 x 2400 px</span>
                </p>
                <div className="space-y-2">
                  {mockupScreenshotUrl && (
                    <div className="relative inline-block max-w-full">
                      <img 
                        src={mockupScreenshotUrl} 
                        alt="Mockup preview" 
                        className="max-h-[400px] w-auto object-contain border rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage("mockup")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMediaSelector("mockup")}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {mockupScreenshotUrl ? "Alterar Mockup" : "Selecionar Mockup"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={isPublished}
                  onCheckedChange={(checked) => setIsPublished(checked)}
                  id="publicado"
                />
                <Label htmlFor="publicado">Publicar case</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked)}
                  id="destaque"
                />
                <Label htmlFor="destaque">Marcar como destaque</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Logo do Cliente</Label>
                <p className="text-xs text-muted-foreground mb-2">Tamanho recomendado: 400x400px (formato quadrado)</p>
                <div className="space-y-2">
                  {clientInfoData.logo_cliente && (
                    <div className="relative inline-block">
                      <img 
                        src={clientInfoData.logo_cliente} 
                        alt="Logo cliente preview" 
                        className="h-20 w-auto object-contain border rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage("client-logo")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMediaSelector("client-logo")}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {clientInfoData.logo_cliente ? "Alterar Logo" : "Selecionar Logo"}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Nome do Cliente</Label>
                <Input
                  value={clientInfoData.nome_cliente}
                  onChange={(e) => setClientInfoData({ ...clientInfoData, nome_cliente: e.target.value })}
                  placeholder="Ex: JADEJADE"
                />
              </div>

              <div>
                <Label>Site do Cliente</Label>
                <Input
                  value={clientInfoData.site_cliente}
                  onChange={(e) => setClientInfoData({ ...clientInfoData, site_cliente: e.target.value })}
                  placeholder="Ex: https://www.jadejade.com.br"
                />
              </div>

              <div>
                <Label>Setor/Segmento</Label>
                <Input
                  value={clientInfoData.setor}
                  onChange={(e) => setClientInfoData({ ...clientInfoData, setor: e.target.value })}
                  placeholder="Ex: Moda e Vestuário"
                />
              </div>

              <div>
                <Label>Localização</Label>
                <Input
                  value={clientInfoData.localizacao}
                  onChange={(e) => setClientInfoData({ ...clientInfoData, localizacao: e.target.value })}
                  placeholder="Ex: São Paulo, Brasil"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/cases/list")}>
          Cancelar
        </Button>
        <Button onClick={handleSaveAll} disabled={saveMutation.isPending}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Tudo
        </Button>
      </div>

      <MediaSelector
        open={mediaSelectorOpen}
        onClose={() => {
          setMediaSelectorOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
