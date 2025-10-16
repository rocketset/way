import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { IconPicker } from "@/components/editor/IconPicker";
import { MediaSelector } from "@/components/editor/MediaSelector";
import { TagsAutocomplete } from "@/components/editor/TagsAutocomplete";
import { useCaseTags } from "@/hooks/useCaseTags";
import type { HeroBlockContent, BenefitsBlockContent, TextColumnsBlockContent, ClientInfoBlockContent } from "@/hooks/useCaseBlocks";

export default function NewCase() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<"hero-logo" | "hero-main" | "client-logo" | "mockup" | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [basicInfo, setBasicInfo] = useState({
    titulo: "",
    categoria_id: "",
    publicado: false,
    is_featured: false,
  });

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

  const [clientData, setClientData] = useState<ClientInfoBlockContent>({
    logo_cliente: "",
    nome_cliente: "",
    site_cliente: "",
    setor: "",
    localizacao: "",
  });

  const [mockupScreenshotUrl, setMockupScreenshotUrl] = useState<string>("");

  const { data: categories } = useQuery({
    queryKey: ["categories-case"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("tipo", "case")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  const { data: caseTags = [] } = useCaseTags();

  const handleImageSelect = (url: string) => {
    if (currentImageField === "hero-logo") {
      setHeroData({ ...heroData, logo_url: url });
    } else if (currentImageField === "hero-main") {
      setHeroData({ ...heroData, imagem_principal: url });
    } else if (currentImageField === "client-logo") {
      setClientData({ ...clientData, logo_cliente: url });
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
      setClientData({ ...clientData, logo_cliente: "" });
    } else if (field === "mockup") {
      setMockupScreenshotUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!basicInfo.titulo.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: newCase, error: caseError } = await supabase
        .from("cases")
        .insert([
          {
            titulo: basicInfo.titulo.trim(),
            descricao: heroData.descricao,
            categoria_id: basicInfo.categoria_id || null,
            imagem_url: heroData.imagem_principal || null,
            publicado: basicInfo.publicado,
            is_featured: basicInfo.is_featured,
            mockup_screenshot_url: mockupScreenshotUrl || null,
            content_status: basicInfo.publicado ? 'publicado' : 'rascunho',
          },
        ])
        .select()
        .single();

      if (caseError) throw caseError;

      // Create content blocks
      const blocksToInsert = [
        {
          case_id: newCase.id,
          block_type: "client_info",
          position: 0,
          content: clientData,
        },
        {
          case_id: newCase.id,
          block_type: "hero",
          position: 1,
          content: heroData,
        },
        {
          case_id: newCase.id,
          block_type: "text_columns",
          position: 2,
          content: textColumnsData,
        },
        {
          case_id: newCase.id,
          block_type: "benefits",
          position: 3,
          content: benefitsData,
        },
      ];

      const { error: blocksError } = await supabase
        .from("case_content_blocks")
        .insert(blocksToInsert as any);

      if (blocksError) throw blocksError;

      // Insert tags relationship
      if (selectedTagIds.length > 0) {
        const tagRelations = selectedTagIds.map(tagId => ({
          case_id: newCase.id,
          tag_id: tagId
        }));
        
        const { error: tagsError } = await supabase
          .from('case_tags')
          .insert(tagRelations);
        
        if (tagsError) throw tagsError;
      }

      toast.success(basicInfo.publicado ? "Case criado e publicado!" : "Case salvo como rascunho!");
      navigate("/admin/cases/list");
    } catch (error: any) {
      console.error("Erro ao criar case:", error);
      toast.error("Erro ao criar case. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/cases/list")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Case</h1>
          <p className="text-muted-foreground">Preencha as informações em cada aba</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="client">Cliente</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título do Case *</Label>
                  <Input
                    value={basicInfo.titulo}
                    onChange={(e) => setBasicInfo({ ...basicInfo, titulo: e.target.value })}
                    placeholder="Digite o título do case"
                    required
                  />
                </div>

                <div>
                  <Label>Categoria</Label>
                  <select
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                    value={basicInfo.categoria_id}
                    onChange={(e) => setBasicInfo({ ...basicInfo, categoria_id: e.target.value })}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
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
                    onChange={(e) =>
                      setHeroData({ ...heroData, titulo: e.target.value })
                    }
                    placeholder="Ex: JADEJADE"
                  />
                </div>

                <div>
                  <Label>Subtítulo</Label>
                  <Input
                    value={heroData.subtitulo}
                    onChange={(e) =>
                      setHeroData({ ...heroData, subtitulo: e.target.value })
                    }
                    placeholder="Ex: Loja de moda jovem e moderna"
                  />
                </div>

                <div>
                  <Label>Breve Resumo</Label>
                  <Textarea
                    value={heroData.descricao}
                    onChange={(e) =>
                      setHeroData({ ...heroData, descricao: e.target.value })
                    }
                    placeholder="Descreva o case de forma detalhada"
                    rows={4}
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
                  <Label>Coluna da Esquerda - Desafio</Label>
                  <Textarea
                    value={textColumnsData.coluna_esquerda}
                    onChange={(e) =>
                      setTextColumnsData({
                        ...textColumnsData,
                        coluna_esquerda: e.target.value,
                      })
                    }
                    placeholder="Texto da primeira coluna (use quebras de linha para parágrafos)"
                    rows={8}
                  />
                </div>

                <div>
                  <Label>Coluna da Direita - Resultado</Label>
                  <Textarea
                    value={textColumnsData.coluna_direita}
                    onChange={(e) =>
                      setTextColumnsData({
                        ...textColumnsData,
                        coluna_direita: e.target.value,
                      })
                    }
                    placeholder="Texto da segunda coluna (use quebras de linha para parágrafos)"
                    rows={8}
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
                  <p className="text-xs text-muted-foreground mb-2">Imagem do mockup do site/produto (aparece na página de listagem de cases)</p>
                  <div className="space-y-2">
                    {mockupScreenshotUrl && (
                      <div className="relative inline-block">
                        <img 
                          src={mockupScreenshotUrl} 
                          alt="Mockup preview" 
                          className="h-32 w-auto object-contain border rounded"
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
                    checked={basicInfo.publicado}
                    onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, publicado: checked })}
                  />
                  <Label>Publicar case</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={basicInfo.is_featured}
                    onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, is_featured: checked })}
                  />
                  <Label>Marcar como destaque</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Info Tab */}
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
                    {clientData.logo_cliente && (
                      <div className="relative inline-block">
                        <img 
                          src={clientData.logo_cliente} 
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
                      {clientData.logo_cliente ? "Alterar Logo" : "Selecionar Logo"}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={clientData.nome_cliente}
                    onChange={(e) => setClientData({ ...clientData, nome_cliente: e.target.value })}
                    placeholder="Ex: JADEJADE"
                  />
                </div>

                <div>
                  <Label>Site do Cliente</Label>
                  <Input
                    value={clientData.site_cliente}
                    onChange={(e) => setClientData({ ...clientData, site_cliente: e.target.value })}
                    placeholder="Ex: https://www.jadejade.com.br"
                  />
                </div>

                <div>
                  <Label>Setor/Segmento</Label>
                  <Input
                    value={clientData.setor}
                    onChange={(e) => setClientData({ ...clientData, setor: e.target.value })}
                    placeholder="Ex: Moda e Vestuário"
                  />
                </div>

                <div>
                  <Label>Localização</Label>
                  <Input
                    value={clientData.localizacao}
                    onChange={(e) => setClientData({ ...clientData, localizacao: e.target.value })}
                    placeholder="Ex: São Paulo, Brasil"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/cases/list")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Salvando..." : "Criar Case"}
          </Button>
        </div>
      </form>

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
