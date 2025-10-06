import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { IconPicker } from "@/components/editor/IconPicker";
import { MediaSelector } from "@/components/editor/MediaSelector";
import type {
  HeroBlockContent,
  WhyChooseBlockContent,
  BenefitsBlockContent,
  PlatformIdealBlockContent,
} from "@/hooks/useCaseBlocks";

export default function NewCase() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string | null>(null);

  // Informações básicas do case
  const [basicInfo, setBasicInfo] = useState({
    titulo: "",
    descricao: "",
    categoria_id: "",
    imagem_url: "",
    publicado: false,
  });

  // Bloco Hero
  const [heroData, setHeroData] = useState<HeroBlockContent>({
    titulo: "",
    descricao: "",
    badge_text: "Case de Sucesso",
    tags: [],
  });

  // Bloco Por que escolher
  const [whyChooseData, setWhyChooseData] = useState<WhyChooseBlockContent>({
    titulo: "",
    paragrafo_1: "",
  });

  // Bloco Benefícios
  const [benefitsData, setBenefitsData] = useState<BenefitsBlockContent>({
    benefits: [
      { icon: "TrendingUp", titulo: "", descricao: "" },
      { icon: "Users", titulo: "", descricao: "" },
      { icon: "ShoppingCart", titulo: "", descricao: "" },
      { icon: "Award", titulo: "", descricao: "" },
    ],
  });

  // Bloco Plataforma Ideal
  const [platformData, setPlatformData] = useState<PlatformIdealBlockContent>({
    titulo: "",
    descricao: "",
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

  const handleImageSelect = (imageUrl: string) => {
    if (!currentImageField) return;

    const [block, field] = currentImageField.split(".");
    
    switch (block) {
      case "basic":
        setBasicInfo({ ...basicInfo, imagem_url: imageUrl });
        break;
      case "hero":
        if (field === "logo_pequena") {
          setHeroData({ ...heroData, logo_pequena: imageUrl });
        } else if (field === "imagem_principal") {
          setHeroData({ ...heroData, imagem_principal: imageUrl });
        }
        break;
      case "whyChoose":
        setWhyChooseData({ ...whyChooseData, imagem: imageUrl });
        break;
      case "platform":
        setPlatformData({ ...platformData, imagem: imageUrl });
        break;
    }
    
    setMediaSelectorOpen(false);
    setCurrentImageField(null);
  };

  const openMediaSelector = (field: string) => {
    setCurrentImageField(field);
    setMediaSelectorOpen(true);
  };

  const removeImage = (field: string) => {
    const [block, subfield] = field.split(".");
    
    switch (block) {
      case "basic":
        setBasicInfo({ ...basicInfo, imagem_url: "" });
        break;
      case "hero":
        if (subfield === "logo_pequena") {
          setHeroData({ ...heroData, logo_pequena: "" });
        } else if (subfield === "imagem_principal") {
          setHeroData({ ...heroData, imagem_principal: "" });
        }
        break;
      case "whyChoose":
        setWhyChooseData({ ...whyChooseData, imagem: "" });
        break;
      case "platform":
        setPlatformData({ ...platformData, imagem: "" });
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!basicInfo.titulo.trim() || !basicInfo.descricao.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Criar o case
      const { data: newCase, error: caseError } = await supabase
        .from("cases")
        .insert([
          {
            titulo: basicInfo.titulo.trim(),
            descricao: basicInfo.descricao.trim(),
            categoria_id: basicInfo.categoria_id || null,
            imagem_url: basicInfo.imagem_url.trim() || null,
            publicado: basicInfo.publicado,
          },
        ])
        .select()
        .single();

      if (caseError) throw caseError;

      // 2. Criar os blocos de conteúdo
      const blocks = [
        {
          case_id: newCase.id,
          block_type: "hero",
          position: 0,
          content: heroData,
        },
        {
          case_id: newCase.id,
          block_type: "why_choose",
          position: 1,
          content: whyChooseData,
        },
        {
          case_id: newCase.id,
          block_type: "benefits",
          position: 2,
          content: benefitsData,
        },
        {
          case_id: newCase.id,
          block_type: "platform_ideal",
          position: 3,
          content: platformData,
        },
      ];

      const { error: blocksError } = await supabase
        .from("case_content_blocks")
        .insert(blocks as any);

      if (blocksError) throw blocksError;

      toast.success("Case criado com sucesso!");
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
          <p className="text-muted-foreground">Preencha as informações do case</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Após criar o case, você poderá editar o conteúdo detalhado em blocos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="titulo"
                value={basicInfo.titulo}
                onChange={(e) => setBasicInfo({ ...basicInfo, titulo: e.target.value })}
                placeholder="Digite o título do case"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={basicInfo.categoria_id}
                onValueChange={(value) => setBasicInfo({ ...basicInfo, categoria_id: value })}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              {basicInfo.imagem_url ? (
                <div className="space-y-2">
                  <img src={basicInfo.imagem_url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaSelector("basic")}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Imagem
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage("basic")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMediaSelector("basic")}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                </Button>
              )}
              <p className="text-sm text-muted-foreground">Imagem de capa do case</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descricao"
                value={basicInfo.descricao}
                onChange={(e) => setBasicInfo({ ...basicInfo, descricao: e.target.value })}
                placeholder="Digite a descrição do case"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="publicado">Publicar case</Label>
                <p className="text-sm text-muted-foreground">Torne o case visível publicamente</p>
              </div>
              <Switch
                id="publicado"
                checked={basicInfo.publicado}
                onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, publicado: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Bloco Hero */}
        <Card>
          <CardHeader>
            <CardTitle>Bloco 1: Hero Section</CardTitle>
            <CardDescription>Banner principal com título, descrição e imagem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logo Pequena</Label>
                {heroData.logo_pequena ? (
                  <div className="space-y-2">
                    <img src={heroData.logo_pequena} alt="Logo" className="h-16 object-contain" />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openMediaSelector("hero.logo_pequena")}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage("hero.logo_pequena")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMediaSelector("hero.logo_pequena")}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Logo
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={heroData.badge_text || ""}
                  onChange={(e) => setHeroData({ ...heroData, badge_text: e.target.value })}
                  placeholder="Ex: Case de Sucesso"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={heroData.titulo}
                onChange={(e) => setHeroData({ ...heroData, titulo: e.target.value })}
                placeholder="Título principal do hero"
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={heroData.descricao}
                onChange={(e) => setHeroData({ ...heroData, descricao: e.target.value })}
                placeholder="Descrição do hero"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Texto do CTA</Label>
              <Input
                value={heroData.cta_text || ""}
                onChange={(e) => setHeroData({ ...heroData, cta_text: e.target.value })}
                placeholder="Ex: Falar com especialista"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem Principal</Label>
              {heroData.imagem_principal ? (
                <div className="space-y-2">
                  <img src={heroData.imagem_principal} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaSelector("hero.imagem_principal")}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Imagem
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage("hero.imagem_principal")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMediaSelector("hero.imagem_principal")}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                value={heroData.tags?.join(", ") || ""}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                placeholder="Tag1, Tag2, Tag3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bloco Por que escolher */}
        <Card>
          <CardHeader>
            <CardTitle>Bloco 2: Por que escolher</CardTitle>
            <CardDescription>Explique os diferenciais desta solução</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={whyChooseData.titulo}
                onChange={(e) => setWhyChooseData({ ...whyChooseData, titulo: e.target.value })}
                placeholder="Título da seção"
              />
            </div>

            <div className="space-y-2">
              <Label>Primeiro Parágrafo</Label>
              <Textarea
                value={whyChooseData.paragrafo_1}
                onChange={(e) => setWhyChooseData({ ...whyChooseData, paragrafo_1: e.target.value })}
                placeholder="Primeiro parágrafo explicativo"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Segundo Parágrafo (opcional)</Label>
              <Textarea
                value={whyChooseData.paragrafo_2 || ""}
                onChange={(e) => setWhyChooseData({ ...whyChooseData, paragrafo_2: e.target.value })}
                placeholder="Segundo parágrafo"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem</Label>
              {whyChooseData.imagem ? (
                <div className="space-y-2">
                  <img src={whyChooseData.imagem} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaSelector("whyChoose")}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Imagem
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage("whyChoose")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMediaSelector("whyChoose")}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bloco Benefícios */}
        <Card>
          <CardHeader>
            <CardTitle>Bloco 3: Grid de Benefícios</CardTitle>
            <CardDescription>Configure os 4 cards de benefícios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefitsData.benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">Benefício {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Ícone</Label>
                      <IconPicker
                        value={benefit.icon}
                        onChange={(iconName) => {
                          const newBenefits = [...benefitsData.benefits];
                          newBenefits[index].icon = iconName;
                          setBenefitsData({ benefits: newBenefits });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={benefit.titulo}
                        onChange={(e) => {
                          const newBenefits = [...benefitsData.benefits];
                          newBenefits[index].titulo = e.target.value;
                          setBenefitsData({ benefits: newBenefits });
                        }}
                        placeholder="Título do benefício"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={benefit.descricao}
                        onChange={(e) => {
                          const newBenefits = [...benefitsData.benefits];
                          newBenefits[index].descricao = e.target.value;
                          setBenefitsData({ benefits: newBenefits });
                        }}
                        placeholder="Descrição"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bloco Plataforma Ideal */}
        <Card>
          <CardHeader>
            <CardTitle>Bloco 4: Plataforma Ideal</CardTitle>
            <CardDescription>Descreva para quem a plataforma é ideal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={platformData.titulo}
                onChange={(e) => setPlatformData({ ...platformData, titulo: e.target.value })}
                placeholder="Título da seção"
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={platformData.descricao}
                onChange={(e) => setPlatformData({ ...platformData, descricao: e.target.value })}
                placeholder="Descrição da plataforma"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem</Label>
              {platformData.imagem ? (
                <div className="space-y-2">
                  <img src={platformData.imagem} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaSelector("platform")}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Imagem
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage("platform")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMediaSelector("platform")}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Texto do CTA</Label>
              <Input
                value={platformData.cta_text || ""}
                onChange={(e) => setPlatformData({ ...platformData, cta_text: e.target.value })}
                placeholder="Ex: Falar com especialista"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="flex gap-3 justify-end sticky bottom-0 bg-background py-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/cases/list")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Salvando..." : "Salvar Case Completo"}
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
