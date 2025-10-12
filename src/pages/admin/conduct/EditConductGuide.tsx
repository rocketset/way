import { useState } from "react";
import { Heart, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useConductGuideContent, useUpdateConductGuideSection } from "@/hooks/useConductGuideContent";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EditConductGuide() {
  const { data: sections, isLoading } = useConductGuideContent();
  const updateSection = useUpdateConductGuideSection();
  const navigate = useNavigate();
  const [editingSections, setEditingSections] = useState<Record<string, any>>({});

  const handleSectionChange = (sectionId: string, field: string, value: any) => {
    setEditingSections((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || sections?.find(s => s.id === sectionId)),
        [field]: value,
      },
    }));
  };

  const handleContentChange = (sectionId: string, index: number, field: string, value: any) => {
    const section = editingSections[sectionId] || sections?.find(s => s.id === sectionId);
    if (!section) return;

    const newContent = [...section.content];
    newContent[index] = { ...newContent[index], [field]: value };

    handleSectionChange(sectionId, "content", newContent);
  };

  const handleItemChange = (sectionId: string, contentIndex: number, itemIndex: number, value: string) => {
    const section = editingSections[sectionId] || sections?.find(s => s.id === sectionId);
    if (!section) return;

    const newContent = [...section.content];
    const items = [...(newContent[contentIndex].items || [])];
    items[itemIndex] = value;
    newContent[contentIndex] = { ...newContent[contentIndex], items };

    handleSectionChange(sectionId, "content", newContent);
  };

  const addItem = (sectionId: string, contentIndex: number) => {
    const section = editingSections[sectionId] || sections?.find(s => s.id === sectionId);
    if (!section) return;

    const newContent = [...section.content];
    const items = [...(newContent[contentIndex].items || []), ""];
    newContent[contentIndex] = { ...newContent[contentIndex], items };

    handleSectionChange(sectionId, "content", newContent);
  };

  const removeItem = (sectionId: string, contentIndex: number, itemIndex: number) => {
    const section = editingSections[sectionId] || sections?.find(s => s.id === sectionId);
    if (!section) return;

    const newContent = [...section.content];
    const items = newContent[contentIndex].items.filter((_: any, i: number) => i !== itemIndex);
    newContent[contentIndex] = { ...newContent[contentIndex], items };

    handleSectionChange(sectionId, "content", newContent);
  };

  const handleSave = async (sectionId: string) => {
    const editedSection = editingSections[sectionId];
    if (!editedSection) return;

    await updateSection.mutateAsync({
      id: sectionId,
      section_title: editedSection.section_title,
      section_description: editedSection.section_description,
      content: editedSection.content,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Editar Guia de Boas Práticas</h1>
            <p className="text-muted-foreground">
              Edite o conteúdo das seções
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate("/admin/conduct-guide")}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-6">
          {sections?.map((section) => {
            const editedSection = editingSections[section.id] || section;

            return (
              <Card key={section.id}>
                <CardHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${section.id}`}>Título da Seção</Label>
                      <Input
                        id={`title-${section.id}`}
                        value={editedSection.section_title}
                        onChange={(e) =>
                          handleSectionChange(section.id, "section_title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`desc-${section.id}`}>Descrição da Seção</Label>
                      <Input
                        id={`desc-${section.id}`}
                        value={editedSection.section_description || ""}
                        onChange={(e) =>
                          handleSectionChange(section.id, "section_description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {editedSection.content.map((item: any, contentIndex: number) => (
                    <div key={contentIndex} className="space-y-4 p-4 border rounded-lg">
                      {item.title !== undefined && (
                        <div>
                          <Label>Título</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              handleContentChange(section.id, contentIndex, "title", e.target.value)
                            }
                          />
                        </div>
                      )}
                      {item.content !== undefined && (
                        <div>
                          <Label>Conteúdo</Label>
                          <Textarea
                            value={item.content}
                            onChange={(e) =>
                              handleContentChange(section.id, contentIndex, "content", e.target.value)
                            }
                            rows={3}
                          />
                        </div>
                      )}
                      {item.items && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Itens da Lista</Label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addItem(section.id, contentIndex)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Item
                            </Button>
                          </div>
                          {item.items.map((listItem: string, itemIndex: number) => (
                            <div key={itemIndex} className="flex gap-2">
                              <Input
                                value={listItem}
                                onChange={(e) =>
                                  handleItemChange(section.id, contentIndex, itemIndex, e.target.value)
                                }
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeItem(section.id, contentIndex, itemIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => handleSave(section.id)}
                    disabled={updateSection.isPending}
                    className="w-full gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salvar Seção
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
