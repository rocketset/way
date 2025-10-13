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
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { IconPicker } from "@/components/editor/IconPicker";
import { MediaSelector } from "@/components/editor/MediaSelector";
import { TagsAutocomplete } from "@/components/editor/TagsAutocomplete";
import { useCaseTags } from "@/hooks/useCaseTags";
import type { HeroBlockContent, BenefitsBlockContent, TextColumnsBlockContent } from "@/hooks/useCaseBlocks";

export default function NewCase() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<"basic" | "hero-logo" | "hero-main" | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [basicInfo, setBasicInfo] = useState({
    titulo: "",
    descricao: "",
    categoria_id: "",
    imagem_url: "",
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
    if (currentImageField === "basic") {
      setBasicInfo({ ...basicInfo, imagem_url: url });
    } else if (currentImageField === "hero-logo") {
      setHeroData({ ...heroData, logo_url: url });
    } else if (currentImageField === "hero-main") {
      setHeroData({ ...heroData, imagem_principal: url });
    }
    setMediaSelectorOpen(false);
    setCurrentImageField(null);
  };

  const openMediaSelector = (field: "basic" | "hero-logo" | "hero-main") => {
    setCurrentImageField(field);
    setMediaSelectorOpen(true);
  };

  const removeImage = (field: "basic" | "hero-logo" | "hero-main") => {
    if (field === "basic") {
      setBasicInfo({ ...basicInfo, imagem_url: "" });
    } else if (field === "hero-logo") {
      setHeroData({ ...heroData, logo_url: "" });
    } else if (field === "hero-main") {
      setHeroData({ ...heroData, imagem_principal: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!basicInfo.titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: newCase, error: caseError } = await supabase
        .from("cases")
        .insert([
          {
            titulo: basicInfo.titulo.trim(),
            descricao: basicInfo.descricao.trim(),
            categoria_id: basicInfo.categoria_id || null,
            imagem_url: basicInfo.imagem_url.trim() || null,
            publicado: basicInfo.publicado,
            is_featured: basicInfo.is_featured,
          },
        ])
        .select()
        .single();

      if (caseError) throw caseError;

      // Create content blocks
      const blocksToInsert = [
        {
          case_id: newCase.id,
          block_type: "hero",
          position: 0,
          content: heroData,
        },
        {
          case_id: newCase.id,
          block_type: "text_columns",
          position: 1,
          content: textColumnsData,
        },
        {
          case_id: newCase.id,
          block_type: "benefits",
          position: 2,
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

      toast({
        title: "Sucesso",
        description: basicInfo.publicado ? "Case criado e publicado!" : "Case salvo como rascunho!",
      });
      navigate("/admin/cases/list");
    } catch (error: any) {
      console.error("Erro ao criar case:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar case. Tente novamente.",
        variant: "destructive",
      });
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
          <p className="text-muted-foreground">Preencha as informações em cada aba. O título é obrigatório.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="text">Colunas de Texto</TabsTrigger>
            <TabsTrigger value="benefits">Benefícios</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título *</Label>
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
                  <Label>Imagem de Capa</Label>
                  <p className="text-xs text-muted-foreground mb-2">Tamanho recomendado: 800x600px</p>
                  <div className="space-y-2">
                    {basicInfo.imagem_url && (
                      <div className="relative inline-block">
                        <img 
                          src={basicInfo.imagem_url} 
                          alt="Capa" 
                          className="h-32 w-auto object-contain border rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeImage("basic")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openMediaSelector("basic")}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {basicInfo.imagem_url ? "Alterar Imagem" : "Selecionar Imagem"}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={basicInfo.descricao}
                    onChange={(e) => setBasicInfo({ ...basicInfo, descricao: e.target.value })}
                    placeholder="Digite a descrição do case"
                    rows={4}
                  />
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

          {/* Hero Section Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label>Descrição</Label>
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
                  <Label>Imagem Principal</Label>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Columns Tab */}
          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Colunas de Texto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Coluna Esquerda</Label>
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
                  <Label>Coluna Direita</Label>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Grid de Benefícios (4 Cards)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                            placeholder="Ex: Layout como extensão da identidade"
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
                            placeholder="Descreva o benefício em detalhes"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
