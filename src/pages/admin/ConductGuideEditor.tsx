import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConductGuideContent, useUpdateConductGuideSection } from "@/hooks/useConductGuideContent";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

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
      content: section.content,
    });
  };

  const handleSave = () => {
    if (!formData.id) return;
    
    updateSection.mutate({
      id: formData.id,
      section_title: formData.section_title,
      section_description: formData.section_description,
      content: formData.content,
    });
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({});
  };

  const updateContentItem = (index: number, field: string, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData({ ...formData, content: newContent });
  };

  const updateContentItemList = (itemIndex: number, listIndex: number, value: string) => {
    const newContent = [...formData.content];
    const newItems = [...newContent[itemIndex].items];
    newItems[listIndex] = value;
    newContent[itemIndex] = { ...newContent[itemIndex], items: newItems };
    setFormData({ ...formData, content: newContent });
  };

  const addListItem = (itemIndex: number) => {
    const newContent = [...formData.content];
    if (!newContent[itemIndex].items) {
      newContent[itemIndex].items = [];
    }
    newContent[itemIndex].items.push("");
    setFormData({ ...formData, content: newContent });
  };

  const removeListItem = (itemIndex: number, listIndex: number) => {
    const newContent = [...formData.content];
    newContent[itemIndex].items = newContent[itemIndex].items.filter((_: any, i: number) => i !== listIndex);
    setFormData({ ...formData, content: newContent });
  };

  const addContentItem = () => {
    const newContent = [...formData.content];
    newContent.push({ title: "", content: "", items: [] });
    setFormData({ ...formData, content: newContent });
  };

  const removeContentItem = (index: number) => {
    const newContent = formData.content.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, content: newContent });
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle className="mb-3">{section.section_title}</CardTitle>
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
                  <div className="space-y-6 mt-6">
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
                      <RichTextEditor
                        label="Descrição"
                        value={formData.section_description}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            section_description: value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Itens de Conteúdo</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addContentItem}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Item
                        </Button>
                      </div>

                      {formData.content?.map((item: any, itemIndex: number) => (
                        <Card key={itemIndex} className="p-4 bg-muted/50">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 space-y-2">
                                <Label>Título</Label>
                                <Input
                                  value={item.title || ""}
                                  onChange={(e) =>
                                    updateContentItem(itemIndex, "title", e.target.value)
                                  }
                                  placeholder="Título do item"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeContentItem(itemIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {item.content !== undefined && (
                              <div className="space-y-2">
                                <RichTextEditor
                                  label="Texto"
                                  value={item.content || ""}
                                  onChange={(value) =>
                                    updateContentItem(itemIndex, "content", value)
                                  }
                                  placeholder="Texto descritivo"
                                />
                              </div>
                            )}

                            {item.items && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Lista de Itens</Label>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addListItem(itemIndex)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Item
                                  </Button>
                                </div>
                                {item.items.map((listItem: string, listIndex: number) => (
                                  <div key={listIndex} className="flex gap-2">
                                    <Input
                                      value={listItem}
                                      onChange={(e) =>
                                        updateContentItemList(itemIndex, listIndex, e.target.value)
                                      }
                                      placeholder="Item da lista"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeListItem(itemIndex, listIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
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
