import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConductGuideContent, useUpdateConductGuideSection } from "@/hooks/useConductGuideContent";
import { toast } from "@/hooks/use-toast";

export default function ConductGuideEditor() {
  const navigate = useNavigate();
  const { data: sections, isLoading } = useConductGuideContent();
  const updateSection = useUpdateConductGuideSection();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (section: any) => {
    setEditingSection(section.id);
    setFormData({
      id: section.id,
      section_title: section.section_title,
      section_description: section.section_description || "",
      content: JSON.stringify(section.content, null, 2),
    });
  };

  const handleSave = () => {
    if (!formData.id) return;

    try {
      const parsedContent = JSON.parse(formData.content);
      updateSection.mutate({
        id: formData.id,
        section_title: formData.section_title,
        section_description: formData.section_description,
        content: parsedContent,
      });
      setEditingSection(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "JSON inválido no conteúdo",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({});
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/conduct-guide")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Editar Guia de Boas Práticas</h1>
              <p className="text-muted-foreground">
                Gerencie o conteúdo do guia de conduta
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-6">
          {sections?.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{section.section_title}</CardTitle>
                    <CardDescription>{section.section_description}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      editingSection === section.id
                        ? handleCancel()
                        : handleEdit(section)
                    }
                  >
                    {editingSection === section.id ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === section.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="section_title">Título da Seção</Label>
                      <Input
                        id="section_title"
                        value={formData.section_title}
                        onChange={(e) =>
                          setFormData({ ...formData, section_title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section_description">Descrição</Label>
                      <Textarea
                        id="section_description"
                        value={formData.section_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section_description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">
                        Conteúdo (JSON)
                        <span className="text-xs text-muted-foreground ml-2">
                          Edite cuidadosamente o JSON abaixo
                        </span>
                      </Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        className="font-mono text-sm min-h-[300px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={updateSection.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Clique em "Editar" para modificar o conteúdo desta seção.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
