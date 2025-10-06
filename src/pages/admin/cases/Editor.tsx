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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { IconPicker } from "@/components/editor/IconPicker";
import type {
  HeroBlockContent,
  TextColumnsBlockContent,
  BenefitsBlockContent,
} from "@/hooks/useCaseBlocks";

export default function CaseEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: caseData, isLoading: caseLoading } = useCase(id!);
  const { data: blocks, isLoading: blocksLoading } = useCaseBlocks(id!);
  const saveMutation = useSaveCaseBlock();

  const [heroData, setHeroData] = useState<HeroBlockContent>({
    logo_url: "",
    titulo: "",
    subtitulo: "",
    descricao: "",
    tags: [],
    imagem_principal: "",
    background_color: "#000000",
  });

  const [textColumnsData, setTextColumnsData] = useState<TextColumnsBlockContent>({
    coluna_esquerda: "",
    coluna_direita: "",
    background_color: "#000000",
  });

  const [benefitsData, setBenefitsData] = useState<BenefitsBlockContent>({
    benefits: [
      { icon: "TrendingUp", titulo: "", descricao: "" },
      { icon: "Users", titulo: "", descricao: "" },
      { icon: "ShoppingCart", titulo: "", descricao: "" },
      { icon: "Award", titulo: "", descricao: "" },
    ],
    background_color: "#000000",
  });

  useEffect(() => {
    if (blocks) {
      blocks.forEach((block) => {
        switch (block.block_type) {
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

  const handleSaveTextColumns = () => {
    saveMutation.mutate({
      caseId: id!,
      blockType: "text_columns",
      content: textColumnsData,
      position: 1,
      blockId: getBlockId("text_columns"),
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

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="text-columns">Colunas de Texto</TabsTrigger>
          <TabsTrigger value="benefits">Benefícios</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Logo URL</Label>
                <Input
                  value={heroData.logo_url || ""}
                  onChange={(e) => setHeroData({ ...heroData, logo_url: e.target.value })}
                  placeholder="URL da logo"
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
                <Label>Subtítulo</Label>
                <Input
                  value={heroData.subtitulo}
                  onChange={(e) => setHeroData({ ...heroData, subtitulo: e.target.value })}
                  placeholder="Subtítulo"
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
                <Label>Imagem Principal URL</Label>
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
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(t => t !== ""),
                    })
                  }
                  placeholder="Tag1, Tag2, Tag3"
                />
              </div>
              <div>
                <Label>Cor de Fundo</Label>
                <Input
                  type="color"
                  value={heroData.background_color || "#000000"}
                  onChange={(e) => setHeroData({ ...heroData, background_color: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveHero} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Hero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text-columns">
          <Card>
            <CardHeader>
              <CardTitle>Colunas de Texto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Coluna Esquerda</Label>
                <Textarea
                  value={textColumnsData.coluna_esquerda}
                  onChange={(e) => setTextColumnsData({ ...textColumnsData, coluna_esquerda: e.target.value })}
                  placeholder="Texto da coluna esquerda"
                  rows={8}
                />
              </div>
              <div>
                <Label>Coluna Direita</Label>
                <Textarea
                  value={textColumnsData.coluna_direita}
                  onChange={(e) => setTextColumnsData({ ...textColumnsData, coluna_direita: e.target.value })}
                  placeholder="Texto da coluna direita"
                  rows={8}
                />
              </div>
              <div>
                <Label>Cor de Fundo</Label>
                <Input
                  type="color"
                  value={textColumnsData.background_color || "#000000"}
                  onChange={(e) => setTextColumnsData({ ...textColumnsData, background_color: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveTextColumns} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Colunas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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
              <div>
                <Label>Cor de Fundo</Label>
                <Input
                  type="color"
                  value={benefitsData.background_color || "#000000"}
                  onChange={(e) => setBenefitsData({ ...benefitsData, background_color: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveBenefits} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Benefícios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
