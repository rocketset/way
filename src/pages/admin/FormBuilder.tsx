import { useState } from "react";
import { useAllFormConfigs, useFormFields, useUpdateFormConfig, useCreateFormField, useUpdateFormField, useDeleteFormField, FIELD_TYPES, FIELD_WIDTHS, FormConfig, FormField } from "@/hooks/useFormConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical, Save, X, Settings, FormInput, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FormBuilder = () => {
  const { toast } = useToast();
  const { data: formConfigs, isLoading } = useAllFormConfigs();
  const updateConfigMutation = useUpdateFormConfig();
  const createFieldMutation = useCreateFormField();
  const updateFieldMutation = useUpdateFormField();
  const deleteFieldMutation = useDeleteFormField();

  const [selectedForm, setSelectedForm] = useState<FormConfig | null>(null);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldFormData, setFieldFormData] = useState({
    nome_campo: "",
    label: "",
    placeholder: "",
    tipo_campo: "text",
    obrigatorio: false,
    ordem: 0,
    largura: "full",
    opcoes: [] as { value: string; label: string }[],
    dica: "",
    ativo: true,
  });
  const [newOption, setNewOption] = useState({ value: "", label: "" });

  const { data: formFields, refetch: refetchFields } = useFormFields(selectedForm?.id || "");

  const resetFieldForm = () => {
    setFieldFormData({
      nome_campo: "",
      label: "",
      placeholder: "",
      tipo_campo: "text",
      obrigatorio: false,
      ordem: formFields?.length || 0,
      largura: "full",
      opcoes: [],
      dica: "",
      ativo: true,
    });
    setEditingField(null);
    setNewOption({ value: "", label: "" });
  };

  const openFieldDialog = (field?: FormField) => {
    if (field) {
      setEditingField(field);
      setFieldFormData({
        nome_campo: field.nome_campo,
        label: field.label,
        placeholder: field.placeholder || "",
        tipo_campo: field.tipo_campo,
        obrigatorio: field.obrigatorio,
        ordem: field.ordem,
        largura: field.largura,
        opcoes: field.opcoes || [],
        dica: field.dica || "",
        ativo: field.ativo,
      });
    } else {
      resetFieldForm();
    }
    setIsFieldDialogOpen(true);
  };

  const handleAddOption = () => {
    if (newOption.value && newOption.label) {
      setFieldFormData({
        ...fieldFormData,
        opcoes: [...fieldFormData.opcoes, newOption],
      });
      setNewOption({ value: "", label: "" });
    }
  };

  const handleRemoveOption = (index: number) => {
    setFieldFormData({
      ...fieldFormData,
      opcoes: fieldFormData.opcoes.filter((_, i) => i !== index),
    });
  };

  const handleSaveField = async () => {
    if (!selectedForm || !fieldFormData.nome_campo || !fieldFormData.label) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }

    try {
      if (editingField) {
        await updateFieldMutation.mutateAsync({
          id: editingField.id,
          ...fieldFormData,
          opcoes: fieldFormData.opcoes.length > 0 ? fieldFormData.opcoes : null,
        });
        toast({ title: "Campo atualizado com sucesso" });
      } else {
        await createFieldMutation.mutateAsync({
          form_config_id: selectedForm.id,
          ...fieldFormData,
          opcoes: fieldFormData.opcoes.length > 0 ? fieldFormData.opcoes : null,
          validacao: null,
          valor_padrao: null,
        });
        toast({ title: "Campo criado com sucesso" });
      }
      setIsFieldDialogOpen(false);
      resetFieldForm();
      refetchFields();
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este campo?")) return;

    try {
      await deleteFieldMutation.mutateAsync(id);
      toast({ title: "Campo excluído com sucesso" });
      refetchFields();
    } catch (error: any) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateConfig = async (field: string, value: any) => {
    if (!selectedForm) return;

    try {
      await updateConfigMutation.mutateAsync({
        id: selectedForm.id,
        [field]: value,
      });
      setSelectedForm({ ...selectedForm, [field]: value });
      toast({ title: "Configuração atualizada" });
    } catch (error: any) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    }
  };

  const toggleFieldActive = async (field: FormField) => {
    try {
      await updateFieldMutation.mutateAsync({
        id: field.id,
        ativo: !field.ativo,
      });
      toast({ title: field.ativo ? "Campo desativado" : "Campo ativado" });
      refetchFields();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Construtor de Formulários</h1>
        <p className="text-muted-foreground mt-1">
          Personalize os campos e configurações de cada formulário de contato
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Lista de Formulários */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FormInput className="w-5 h-5" />
              Formulários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formConfigs?.map((form) => (
              <button
                key={form.id}
                onClick={() => setSelectedForm(form)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedForm?.id === form.id
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted border-transparent"
                }`}
              >
                <div className="font-medium">{form.nome}</div>
                <div className="text-xs text-muted-foreground">{form.slug}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Editor do Formulário */}
        <div className="lg:col-span-3">
          {selectedForm ? (
            <Tabs defaultValue="fields">
              <TabsList className="mb-4">
                <TabsTrigger value="fields" className="flex items-center gap-2">
                  <FormInput className="w-4 h-4" />
                  Campos
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fields">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Campos do Formulário</CardTitle>
                      <CardDescription>
                        {selectedForm.nome} ({formFields?.length || 0} campos)
                      </CardDescription>
                    </div>
                    <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => openFieldDialog()}>
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Campo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingField ? "Editar Campo" : "Novo Campo"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nome do Campo *</Label>
                              <Input
                                value={fieldFormData.nome_campo}
                                onChange={(e) => setFieldFormData({ ...fieldFormData, nome_campo: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                                placeholder="ex: nome_completo"
                              />
                              <p className="text-xs text-muted-foreground">
                                Identificador único (sem espaços)
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>Label (Rótulo) *</Label>
                              <Input
                                value={fieldFormData.label}
                                onChange={(e) => setFieldFormData({ ...fieldFormData, label: e.target.value })}
                                placeholder="ex: Nome Completo"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Tipo de Campo</Label>
                              <Select
                                value={fieldFormData.tipo_campo}
                                onValueChange={(value) => setFieldFormData({ ...fieldFormData, tipo_campo: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FIELD_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Largura</Label>
                              <Select
                                value={fieldFormData.largura}
                                onValueChange={(value) => setFieldFormData({ ...fieldFormData, largura: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FIELD_WIDTHS.map((width) => (
                                    <SelectItem key={width.value} value={width.value}>
                                      {width.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-2 space-y-2">
                              <Label>Placeholder</Label>
                              <Input
                                value={fieldFormData.placeholder}
                                onChange={(e) => setFieldFormData({ ...fieldFormData, placeholder: e.target.value })}
                                placeholder="Texto de exemplo dentro do campo"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Ordem</Label>
                              <Input
                                type="number"
                                value={fieldFormData.ordem}
                                onChange={(e) => setFieldFormData({ ...fieldFormData, ordem: parseInt(e.target.value) || 0 })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Dica (ajuda)</Label>
                              <Input
                                value={fieldFormData.dica}
                                onChange={(e) => setFieldFormData({ ...fieldFormData, dica: e.target.value })}
                                placeholder="Texto de ajuda abaixo do campo"
                              />
                            </div>

                            {/* Opções para select/radio */}
                            {['select', 'radio', 'checkbox'].includes(fieldFormData.tipo_campo) && fieldFormData.nome_campo !== 'assunto' && (
                              <div className="col-span-2 space-y-3">
                                <Label>Opções</Label>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Valor"
                                    value={newOption.value}
                                    onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                                  />
                                  <Input
                                    placeholder="Rótulo"
                                    value={newOption.label}
                                    onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                                  />
                                  <Button type="button" onClick={handleAddOption}>
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {fieldFormData.opcoes.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                                      <span className="flex-1">{opt.label} ({opt.value})</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveOption(idx)}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                {fieldFormData.nome_campo === 'assunto' && (
                                  <p className="text-xs text-muted-foreground">
                                    O campo "assunto" usa automaticamente as opções da tabela de intenções
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="col-span-2 flex items-center gap-6">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={fieldFormData.obrigatorio}
                                  onCheckedChange={(checked) => setFieldFormData({ ...fieldFormData, obrigatorio: checked })}
                                />
                                <Label>Campo obrigatório</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={fieldFormData.ativo}
                                  onCheckedChange={(checked) => setFieldFormData({ ...fieldFormData, ativo: checked })}
                                />
                                <Label>Campo ativo</Label>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                            <Button onClick={handleSaveField}>
                              <Save className="w-4 h-4 mr-2" />
                              {editingField ? "Atualizar" : "Criar"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {!formFields?.length ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum campo cadastrado. Clique em "Novo Campo" para adicionar.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formFields.map((field) => (
                          <div
                            key={field.id}
                            className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                              field.ativo ? "bg-card" : "bg-muted/30 opacity-60"
                            }`}
                          >
                            <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{field.label}</span>
                                <code className="text-xs bg-muted px-2 py-0.5 rounded">
                                  {field.nome_campo}
                                </code>
                                <Badge variant="outline" className="text-xs">
                                  {FIELD_TYPES.find(t => t.value === field.tipo_campo)?.label || field.tipo_campo}
                                </Badge>
                                {field.obrigatorio && (
                                  <Badge variant="secondary" className="text-xs">
                                    Obrigatório
                                  </Badge>
                                )}
                              </div>
                              {field.placeholder && (
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                  Placeholder: {field.placeholder}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.ativo}
                                onCheckedChange={() => toggleFieldActive(field)}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openFieldDialog(field)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteField(field.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações do Formulário</CardTitle>
                    <CardDescription>{selectedForm.nome}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Título do Formulário</Label>
                        <Input
                          value={selectedForm.titulo_formulario || ""}
                          onChange={(e) => setSelectedForm({ ...selectedForm, titulo_formulario: e.target.value })}
                          onBlur={(e) => handleUpdateConfig('titulo_formulario', e.target.value)}
                          placeholder="Envie sua Mensagem"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Subtítulo</Label>
                        <Input
                          value={selectedForm.subtitulo_formulario || ""}
                          onChange={(e) => setSelectedForm({ ...selectedForm, subtitulo_formulario: e.target.value })}
                          onBlur={(e) => handleUpdateConfig('subtitulo_formulario', e.target.value)}
                          placeholder="Responderemos em até 24h"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Texto do Botão Enviar</Label>
                        <Input
                          value={selectedForm.texto_botao_enviar || ""}
                          onChange={(e) => setSelectedForm({ ...selectedForm, texto_botao_enviar: e.target.value })}
                          onBlur={(e) => handleUpdateConfig('texto_botao_enviar', e.target.value)}
                          placeholder="Enviar Mensagem"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição (interna)</Label>
                        <Input
                          value={selectedForm.descricao || ""}
                          onChange={(e) => setSelectedForm({ ...selectedForm, descricao: e.target.value })}
                          onBlur={(e) => handleUpdateConfig('descricao', e.target.value)}
                          placeholder="Descrição para referência"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedForm.mostrar_whatsapp}
                          onCheckedChange={(checked) => handleUpdateConfig('mostrar_whatsapp', checked)}
                        />
                        <Label>Mostrar botão do WhatsApp</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedForm.ativo}
                          onCheckedChange={(checked) => handleUpdateConfig('ativo', checked)}
                        />
                        <Label>Formulário ativo</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <FormInput className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um formulário para editar seus campos e configurações</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
