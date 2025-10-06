import { useParams, useNavigate } from "react-router-dom";
import { useCase } from "@/hooks/useCase";
import { useCaseBlocks } from "@/hooks/useCaseBlocks";
import { useSaveCaseBlock } from "@/hooks/useSaveCaseBlock";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { IconPicker } from "@/components/editor/IconPicker";
import type {
  HeroBlockContent,
  WhyChooseBlockContent,
  BenefitsBlockContent,
  PlatformIdealBlockContent,
} from "@/hooks/useCaseBlocks";

export default function CaseEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: caseData, isLoading: caseLoading } = useCase(id!);
  const { data: blocks, isLoading: blocksLoading } = useCaseBlocks(id!);
  const saveMutation = useSaveCaseBlock();

  const [heroData, setHeroData] = useState<HeroBlockContent>({
    titulo: "",
    descricao: "",
    badge_text: "Case de Sucesso",
    tags: [],
  });

  const [whyChooseData, setWhyChooseData] = useState<WhyChooseBlockContent>({
    titulo: "",
    paragrafo_1: "",
  });

  const [benefitsData, setBenefitsData] = useState<BenefitsBlockContent>({
    benefits: [
      { icon: "TrendingUp", titulo: "", descricao: "" },
      { icon: "Users", titulo: "", descricao: "" },
      { icon: "ShoppingCart", titulo: "", descricao: "" },
      { icon: "Award", titulo: "", descricao: "" },
    ],
  });

  const [platformData, setPlatformData] = useState<PlatformIdealBlockContent>({
    titulo: "",
    descricao: "",
  });

  useEffect(() => {
    if (blocks) {
      blocks.forEach((block) => {
        switch (block.block_type) {
          case "hero":
            setHeroData(block.content as HeroBlockContent);
            break;
          case "why_choose":
            setWhyChooseData(block.content as WhyChooseBlockContent);
            break;
          case "benefits":
            setBenefitsData(block.content as BenefitsBlockContent);
            break;
          case "platform_ideal":
            setPlatformData(block.content as PlatformIdealBlockContent);
            break;
        }
      });
    }
  }, [blocks]);

  const getBlockId = (blockType: string) => {
    return blocks?.find((b) => b.block_type === blockType)?.id;
  };

  const handleSaveHero = () => {
    saveMutation.mutate({
      caseId: id!,
      blockType: "hero",
      content: heroData,
      position: 0,
      blockId: getBlockId("hero"),
    });
  };

  const handleSaveWhyChoose = () => {
    saveMutation.mutate({
      caseId: id!,
      blockType: "why_choose",
      content: whyChooseData,
      position: 1,
      blockId: getBlockId("why_choose"),
    });
  };

  const handleSaveBenefits = () => {
    saveMutation.mutate({
      caseId: id!,
      blockType: "benefits",
      content: benefitsData,
      position: 2,
      blockId: getBlockId("benefits"),
    });
  };

  const handleSavePlatform = () => {
    saveMutation.mutate({
      caseId: id!,
      blockType: "platform_ideal",
      content: platformData,
      position: 3,
      blockId: getBlockId("platform_ideal"),
    });
  };

  if (caseLoading || blocksLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/cases")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editor de Conteúdo</h1>
          <p className="text-muted-foreground">{caseData?.titulo}</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="why-choose">Por que escolher</TabsTrigger>
          <TabsTrigger value="benefits">Benefícios</TabsTrigger>
          <TabsTrigger value="platform">Plataforma Ideal</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero</CardTitle>
              <CardDescription>Configure o banner principal do case</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Logo Pequena (URL)</Label>
                <Input
                  value={heroData.logo_pequena || ""}
                  onChange={(e) => setHeroData({ ...heroData, logo_pequena: e.target.value })}
                  placeholder="URL da logo"
                />
              </div>
              <div>
                <Label>Badge</Label>
                <Input
                  value={heroData.badge_text || ""}
                  onChange={(e) => setHeroData({ ...heroData, badge_text: e.target.value })}
                  placeholder="Ex: Case de Sucesso"
                />
              </div>
              <div>
                <Label>Título</Label>
                <Input
                  value={heroData.titulo}
                  onChange={(e) => setHeroData({ ...heroData, titulo: e.target.value })}
                  placeholder="Título principal"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={heroData.descricao}
                  onChange={(e) => setHeroData({ ...heroData, descricao: e.target.value })}
                  placeholder="Descrição detalhada"
                  rows={4}
                />
              </div>
              <div>
                <Label>Texto do CTA</Label>
                <Input
                  value={heroData.cta_text || ""}
                  onChange={(e) => setHeroData({ ...heroData, cta_text: e.target.value })}
                  placeholder="Ex: Falar com especialista"
                />
              </div>
              <div>
                <Label>Imagem Principal (URL)</Label>
                <Input
                  value={heroData.imagem_principal || ""}
                  onChange={(e) => setHeroData({ ...heroData, imagem_principal: e.target.value })}
                  placeholder="URL da imagem principal"
                />
              </div>
              <div>
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
              <Button onClick={handleSaveHero} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Hero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="why-choose">
          <Card>
            <CardHeader>
              <CardTitle>Por que escolher</CardTitle>
              <CardDescription>Explique os diferenciais desta solução</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={whyChooseData.titulo}
                  onChange={(e) => setWhyChooseData({ ...whyChooseData, titulo: e.target.value })}
                  placeholder="Título da seção"
                />
              </div>
              <div>
                <Label>Primeiro Parágrafo</Label>
                <Textarea
                  value={whyChooseData.paragrafo_1}
                  onChange={(e) => setWhyChooseData({ ...whyChooseData, paragrafo_1: e.target.value })}
                  placeholder="Primeiro parágrafo explicativo"
                  rows={4}
                />
              </div>
              <div>
                <Label>Segundo Parágrafo (opcional)</Label>
                <Textarea
                  value={whyChooseData.paragrafo_2 || ""}
                  onChange={(e) => setWhyChooseData({ ...whyChooseData, paragrafo_2: e.target.value })}
                  placeholder="Segundo parágrafo"
                  rows={4}
                />
              </div>
              <div>
                <Label>Imagem (URL)</Label>
                <Input
                  value={whyChooseData.imagem || ""}
                  onChange={(e) => setWhyChooseData({ ...whyChooseData, imagem: e.target.value })}
                  placeholder="URL da imagem"
                />
              </div>
              <Button onClick={handleSaveWhyChoose} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Grid de Benefícios</CardTitle>
              <CardDescription>Configure os 4 cards de benefícios</CardDescription>
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
                        setBenefitsData({ benefits: newBenefits });
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
                        setBenefitsData({ benefits: newBenefits });
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
                        setBenefitsData({ benefits: newBenefits });
                      }}
                      placeholder="Descrição do benefício"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveBenefits} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Benefícios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle>Plataforma Ideal</CardTitle>
              <CardDescription>Descreva para quem a plataforma é ideal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={platformData.titulo}
                  onChange={(e) => setPlatformData({ ...platformData, titulo: e.target.value })}
                  placeholder="Título da seção"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={platformData.descricao}
                  onChange={(e) => setPlatformData({ ...platformData, descricao: e.target.value })}
                  placeholder="Descrição da plataforma"
                  rows={4}
                />
              </div>
              <div>
                <Label>Imagem (URL)</Label>
                <Input
                  value={platformData.imagem || ""}
                  onChange={(e) => setPlatformData({ ...platformData, imagem: e.target.value })}
                  placeholder="URL da imagem"
                />
              </div>
              <div>
                <Label>Texto do CTA</Label>
                <Input
                  value={platformData.cta_text || ""}
                  onChange={(e) => setPlatformData({ ...platformData, cta_text: e.target.value })}
                  placeholder="Ex: Falar com especialista"
                />
              </div>
              <Button onClick={handleSavePlatform} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
