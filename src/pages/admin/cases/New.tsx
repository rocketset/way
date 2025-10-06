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
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { IconPicker } from "@/components/editor/IconPicker";
import type {
  HeroBlockContent,
  WhyChooseBlockContent,
  BenefitsBlockContent,
  PlatformIdealBlockContent,
} from "@/hooks/useCaseBlocks";

export default function NewCase() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              <Label htmlFor="imagem_url">URL da Imagem</Label>
              <Input
                id="imagem_url"
                value={basicInfo.imagem_url}
                onChange={(e) => setBasicInfo({ ...basicInfo, imagem_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                type="url"
              />
              <p className="text-sm text-muted-foreground">URL da imagem de capa do case</p>
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
                <Label>Logo Pequena (URL)</Label>
                <Input
                  value={heroData.logo_pequena || ""}
                  onChange={(e) => setHeroData({ ...heroData, logo_pequena: e.target.value })}
                  placeholder="URL da logo"
                />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Texto do CTA</Label>
                <Input
                  value={heroData.cta_text || ""}
                  onChange={(e) => setHeroData({ ...heroData, cta_text: e.target.value })}
                  placeholder="Ex: Falar com especialista"
                />
              </div>
              <div className="space-y-2">
                <Label>Imagem Principal (URL)</Label>
                <Input
                  value={heroData.imagem_principal || ""}
                  onChange={(e) => setHeroData({ ...heroData, imagem_principal: e.target.value })}
                  placeholder="URL da imagem principal"
                />
              </div>
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
              <Label>Imagem (URL)</Label>
              <Input
                value={whyChooseData.imagem || ""}
                onChange={(e) => setWhyChooseData({ ...whyChooseData, imagem: e.target.value })}
                placeholder="URL da imagem"
              />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Imagem (URL)</Label>
                <Input
                  value={platformData.imagem || ""}
                  onChange={(e) => setPlatformData({ ...platformData, imagem: e.target.value })}
                  placeholder="URL da imagem"
                />
              </div>
              <div className="space-y-2">
                <Label>Texto do CTA</Label>
                <Input
                  value={platformData.cta_text || ""}
                  onChange={(e) => setPlatformData({ ...platformData, cta_text: e.target.value })}
                  placeholder="Ex: Falar com especialista"
                />
              </div>
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
    </div>
  );
}
