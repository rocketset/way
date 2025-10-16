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
import { ArrowLeft, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { IconPicker } from "@/components/editor/IconPicker";
import FileUpload from "@/components/admin/FileUpload";
import { TagsAutocomplete } from "@/components/editor/TagsAutocomplete";
import { useCaseTags } from "@/hooks/useCaseTags";
import { CaseRichTextEditor } from "@/components/admin/CaseRichTextEditor";
import type { HeroBlockContent, BenefitsBlockContent, TextColumnsBlockContent, ClientInfoBlockContent } from "@/hooks/useCaseBlocks";

export default function NewCase() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="client-info">Info Cliente</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="text-columns">Colunas</TabsTrigger>
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
          <TabsContent value="client-info">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  label="Logo do Cliente"
                  accept="image/*"
                  currentUrl={clientData.logo_cliente}
                  onUploadComplete={(url) => setClientData({ ...clientData, logo_cliente: url })}
                  folder="cases/logos"
                  maxSizeMB={2}
                  showPreview={true}
                  helperText="Logo do cliente | Dimensões recomendadas: 400x400px (quadrado) | Máx: 2MB"
                />
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

          {/* Hero Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Seção Hero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  label="Logo"
                  accept="image/*"
                  currentUrl={heroData.logo_url}
                  onUploadComplete={(url) => setHeroData({ ...heroData, logo_url: url })}
                  folder="cases/logos"
                  maxSizeMB={2}
                  showPreview={true}
                  helperText="Dimensões recomendadas: 300x100px (formato 3:1) | Máx: 2MB"
                />
                <div>
                  <Label>Título</Label>
                  <Input
                    value={heroData.titulo}
                    onChange={(e) => setHeroData({ ...heroData, titulo: e.target.value })}
                    placeholder="Título principal"
                  />
                </div>
                <div>
                  <Label>Subtítulo</Label>
                  <Input
                    value={heroData.subtitulo}
                    onChange={(e) => setHeroData({ ...heroData, subtitulo: e.target.value })}
                    placeholder="Subtítulo"
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <CaseRichTextEditor
                    value={heroData.descricao}
                    onChange={(value) => setHeroData({ ...heroData, descricao: value })}
                    placeholder="Descrição detalhada"
                    minHeight="120px"
                  />
                </div>
                <FileUpload
                  label="Imagem Principal (Aparece nas Listagens)"
                  accept="image/*"
                  currentUrl={heroData.imagem_principal}
                  onUploadComplete={(url) => setHeroData({ ...heroData, imagem_principal: url })}
                  folder="cases/hero"
                  maxSizeMB={3}
                  showPreview={true}
                  helperText="Esta imagem aparece na página inicial e na lista de cases | Dimensões recomendadas: 800x800px (quadrada) | Máx: 3MB"
                />
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Columns Tab */}
          <TabsContent value="text-columns">
            <Card>
              <CardHeader>
                <CardTitle>Colunas de Texto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-primary">🎯</span> Desafio:
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Descreva o desafio enfrentado pelo cliente
                  </p>
                  <CaseRichTextEditor
                    value={textColumnsData.coluna_esquerda}
                    onChange={(value) => setTextColumnsData({ ...textColumnsData, coluna_esquerda: value })}
                    placeholder="Texto do desafio..."
                  />
                </div>
                <div>
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-accent">🏆</span> Resultado:
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Descreva os resultados alcançados
                  </p>
                  <CaseRichTextEditor
                    value={textColumnsData.coluna_direita}
                    onChange={(value) => setTextColumnsData({ ...textColumnsData, coluna_direita: value })}
                    placeholder="Texto dos resultados..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Grid de Benefícios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefitsData.benefits.map((benefit, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <h3 className="font-semibold">Benefício {index + 1}</h3>
                    <div>
                      <Label>Ícone</Label>
                      <IconPicker
                        value={benefit.icon}
                        onChange={(iconName) => {
                          const newBenefits = [...benefitsData.benefits];
                          newBenefits[index].icon = iconName;
                          setBenefitsData({ ...benefitsData, benefits: newBenefits });
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
                          setBenefitsData({ ...benefitsData, benefits: newBenefits });
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
                          setBenefitsData({ ...benefitsData, benefits: newBenefits });
                        }}
                        placeholder="Descrição do benefício"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
