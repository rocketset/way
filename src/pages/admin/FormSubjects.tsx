import { useState } from "react";
import { useAllIntencoesCadastro, useCreateIntencao, useUpdateIntencao, useDeleteIntencao, FORMULARIOS_DISPONIVEIS, IntencaoCadastro } from "@/hooks/useIntencoesCadastro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FormSubjects = () => {
  const { toast } = useToast();
  const { data: intencoes, isLoading } = useAllIntencoesCadastro();
  const createMutation = useCreateIntencao();
  const updateMutation = useUpdateIntencao();
  const deleteMutation = useDeleteIntencao();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IntencaoCadastro | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    valor_slug: "",
    descricao: "",
    exibir_em: ["todos"] as string[],
    icone: "briefcase",
    cor_destaque: "",
    ativo: true,
    ordem: 0,
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      valor_slug: "",
      descricao: "",
      exibir_em: ["todos"],
      icone: "briefcase",
      cor_destaque: "",
      ativo: true,
      ordem: intencoes?.length || 0,
    });
    setEditingItem(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: IntencaoCadastro) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      valor_slug: item.valor_slug || "",
      descricao: item.descricao || "",
      exibir_em: item.exibir_em || ["todos"],
      icone: item.icone || "briefcase",
      cor_destaque: item.cor_destaque || "",
      ativo: item.ativo,
      ordem: item.ordem,
    });
    setIsDialogOpen(true);
  };

  const handleFormulariosChange = (value: string, checked: boolean) => {
    let newExibirEm = [...formData.exibir_em];
    
    if (value === "todos") {
      newExibirEm = checked ? ["todos"] : [];
    } else {
      // Remove 'todos' se selecionar um específico
      newExibirEm = newExibirEm.filter(v => v !== "todos");
      
      if (checked) {
        newExibirEm.push(value);
      } else {
        newExibirEm = newExibirEm.filter(v => v !== value);
      }
      
      // Se nenhum selecionado, volta para 'todos'
      if (newExibirEm.length === 0) {
        newExibirEm = ["todos"];
      }
    }
    
    setFormData({ ...formData, exibir_em: newExibirEm });
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }

    // Gerar slug automaticamente se não fornecido
    const valorSlug = formData.valor_slug.trim() || 
      formData.nome.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          nome: formData.nome,
          valor_slug: valorSlug,
          descricao: formData.descricao || null,
          exibir_em: formData.exibir_em,
          icone: formData.icone || null,
          cor_destaque: formData.cor_destaque || null,
          ativo: formData.ativo,
          ordem: formData.ordem,
        });
        toast({ title: "Opção atualizada com sucesso" });
      } else {
        await createMutation.mutateAsync({
          nome: formData.nome,
          valor_slug: valorSlug,
          descricao: formData.descricao || null,
          exibir_em: formData.exibir_em,
          icone: formData.icone || null,
          cor_destaque: formData.cor_destaque || null,
          ativo: formData.ativo,
          ordem: formData.ordem,
        });
        toast({ title: "Opção criada com sucesso" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Erro ao salvar", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta opção?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Opção excluída com sucesso" });
    } catch (error: any) {
      toast({ 
        title: "Erro ao excluir", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const toggleAtivo = async (item: IntencaoCadastro) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        ativo: !item.ativo,
      });
      toast({ 
        title: item.ativo ? "Opção desativada" : "Opção ativada" 
      });
    } catch (error: any) {
      toast({ 
        title: "Erro ao alterar status", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const getFormularioLabels = (exibirEm: string[] | null) => {
    if (!exibirEm || exibirEm.includes("todos")) {
      return [{ value: "todos", label: "Todos" }];
    }
    return exibirEm.map(value => {
      const found = FORMULARIOS_DISPONIVEIS.find(f => f.value === value);
      return found || { value, label: value };
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assuntos dos Formulários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as opções de assunto que aparecem nos formulários de contato
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Opção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Opção" : "Nova Opção de Assunto"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome da Opção *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Implantação de E-commerce"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_slug">Valor/Slug</Label>
                  <Input
                    id="valor_slug"
                    value={formData.valor_slug}
                    onChange={(e) => setFormData({ ...formData, valor_slug: e.target.value })}
                    placeholder="Ex: implantacao"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se vazio, será gerado automaticamente
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ordem">Ordem</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição opcional para uso interno"
                    rows={2}
                  />
                </div>

                <div className="col-span-2 space-y-3">
                  <Label>Exibir nos Formulários</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {FORMULARIOS_DISPONIVEIS.map((form) => (
                      <div key={form.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`form-${form.value}`}
                          checked={
                            form.value === "todos" 
                              ? formData.exibir_em.includes("todos")
                              : formData.exibir_em.includes(form.value) && !formData.exibir_em.includes("todos")
                          }
                          onCheckedChange={(checked) => 
                            handleFormulariosChange(form.value, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`form-${form.value}`} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {form.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icone">Ícone (Lucide)</Label>
                  <Input
                    id="icone"
                    value={formData.icone}
                    onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
                    placeholder="Ex: briefcase, store, rocket"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cor_destaque">Cor de Destaque</Label>
                  <Input
                    id="cor_destaque"
                    value={formData.cor_destaque}
                    onChange={(e) => setFormData({ ...formData, cor_destaque: e.target.value })}
                    placeholder="Ex: #FFD700"
                  />
                </div>

                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Opção ativa</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opções de Assunto</CardTitle>
          <CardDescription>
            Estas opções aparecem no campo "Assunto" dos formulários de contato
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!intencoes?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma opção cadastrada. Clique em "Nova Opção" para adicionar.
            </div>
          ) : (
            <div className="space-y-3">
              {intencoes.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    item.ativo 
                      ? "bg-card hover:bg-muted/50" 
                      : "bg-muted/30 opacity-60"
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{item.nome}</span>
                      {item.valor_slug && (
                        <code className="text-xs bg-muted px-2 py-0.5 rounded">
                          {item.valor_slug}
                        </code>
                      )}
                    </div>
                    {item.descricao && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {item.descricao}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getFormularioLabels(item.exibir_em).map((form) => (
                        <Badge 
                          key={form.value} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {form.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.ativo}
                      onCheckedChange={() => toggleAtivo(item)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
};

export default FormSubjects;
