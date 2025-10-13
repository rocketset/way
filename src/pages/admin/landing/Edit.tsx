import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { useLandingPageById } from "@/hooks/useLandingPages";
import { useLandingPageBlocks } from "@/hooks/useLandingPageBlocks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BlockType = 'hero' | 'features' | 'cta' | 'form' | 'testimonials';

export default function EditLandingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: landingPage, isLoading } = useLandingPageById(id!);
  const { data: blocks = [], refetch: refetchBlocks } = useLandingPageBlocks(id!);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descricao: "",
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    if (landingPage) {
      setFormData({
        titulo: landingPage.titulo,
        slug: landingPage.slug,
        descricao: landingPage.descricao || "",
        meta_title: landingPage.meta_title || "",
        meta_description: landingPage.meta_description || "",
      });
    }
  }, [landingPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("landing_pages")
      .update(formData)
      .eq("id", id);

    setLoading(false);

    if (error) {
      toast.error("Erro ao atualizar landing page");
      return;
    }

    toast.success("Landing page atualizada com sucesso!");
  };

  const handleAddBlock = async (blockType: BlockType) => {
    const position = blocks.length;
    const { error } = await supabase
      .from("landing_page_blocks")
      .insert([{
        landing_page_id: id,
        block_type: blockType,
        content: getDefaultContent(blockType),
        position,
      }]);

    if (error) {
      toast.error("Erro ao adicionar bloco");
      return;
    }

    toast.success("Bloco adicionado!");
    refetchBlocks();
  };

  const getDefaultContent = (blockType: BlockType) => {
    switch (blockType) {
      case 'hero':
        return { titulo: "Título Principal", subtitulo: "Subtítulo", cta_text: "Saiba Mais" };
      case 'features':
        return { items: [{ titulo: "Feature 1", descricao: "Descrição da feature" }] };
      case 'cta':
        return { titulo: "Call to Action", texto: "Descrição do CTA", botao: "Clique Aqui" };
      case 'form':
        return { titulo: "Formulário de Contato", campos: ["nome", "email", "telefone"] };
      case 'testimonials':
        return { items: [{ nome: "Cliente", texto: "Depoimento aqui" }] };
      default:
        return {};
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/landing")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Landing Page</h1>
          <p className="text-muted-foreground mt-2">{landingPage?.titulo}</p>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="blocks">Blocos de Conteúdo</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                required
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                URL: /lp/{formData.slug}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
              />
            </div>

            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Adicionar Bloco</h3>
              <Select onValueChange={(value) => handleAddBlock(value as BlockType)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tipo de bloco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="cta">Call to Action</SelectItem>
                  <SelectItem value="form">Formulário</SelectItem>
                  <SelectItem value="testimonials">Depoimentos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {blocks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum bloco adicionado. Selecione um tipo acima para começar.
                </p>
              ) : (
                blocks.map((block, index) => (
                  <Card key={block.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bloco {index + 1}: {block.block_type}</p>
                        <p className="text-sm text-muted-foreground">
                          Posição: {block.position}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implementar edição de bloco
                          toast.info("Em breve: Editor de blocos");
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) =>
                  setFormData({ ...formData, meta_title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description: e.target.value })
                }
              />
            </div>

            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar SEO"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}