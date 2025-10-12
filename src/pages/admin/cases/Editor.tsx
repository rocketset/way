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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { IconPicker } from "@/components/editor/IconPicker";
import { TagsAutocomplete } from "@/components/editor/TagsAutocomplete";
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
    banner_url: "",
    sobre_cliente_texto: "",
  });

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

  const getBlockId = (blockType: string) => {
    return blocks?.find((b) => b.block_type === blockType)?.id;
  };

  const handleSaveHero = async () => {
    try {
      // Save hero block content
      await saveMutation.mutateAsync({
        caseId: id!,
        blockType: "hero",
        content: heroData,
        position: 0,
        blockId: getBlockId("hero"),
      });

      // Update case tags
      // First delete existing tags
      await supabase
        .from('case_tags')
        .delete()
        .eq('case_id', id!);
      
      // Then insert new tags
      if (selectedTagIds.length > 0) {
        const tagRelations = selectedTagIds.map(tagId => ({
          case_id: id!,
          tag_id: tagId
        }));
        
        await supabase
          .from('case_tags')
          .insert(tagRelations);
      }
      
      toast.success('Hero e tags salvos com sucesso!');
    } catch (error) {
      console.error('Error saving hero:', error);
      toast.error('Erro ao salvar');
    }
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

  const handleSaveClientInfo = () => {
    saveMutation.mutate({
      caseId: id!,
      blockType: "client_info",
      content: clientInfoData,
      position: -1, // Position before hero
      blockId: getBlockId("client_info"),
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

      <Tabs defaultValue="client-info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="client-info">Info Cliente</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="text-columns">Colunas</TabsTrigger>
          <TabsTrigger value="benefits">Benefícios</TabsTrigger>
        </TabsList>

        <TabsContent value="client-info">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Banner URL</Label>
                <Input
                  value={clientInfoData.banner_url || ""}
                  onChange={(e) => setClientInfoData({ ...clientInfoData, banner_url: e.target.value })}
                  placeholder="URL do banner do cliente"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Banner grande que aparecerá acima do título do case
                </p>
              </div>
              <div>
                <Label>Sobre o Cliente</Label>
                <Textarea
                  value={clientInfoData.sobre_cliente_texto}
                  onChange={(e) => setClientInfoData({ ...clientInfoData, sobre_cliente_texto: e.target.value })}
                  placeholder="Texto descritivo sobre o cliente"
                  rows={8}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use quebras de linha para separar parágrafos
                </p>
              </div>
              <Button onClick={handleSaveClientInfo} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Info Cliente
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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
                <Label>Tags</Label>
                <TagsAutocomplete
                  selectedTagIds={selectedTagIds}
                  onChange={setSelectedTagIds}
                  allTags={caseTags}
                  tipo="case"
                  queryKey={['case-tags']}
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
