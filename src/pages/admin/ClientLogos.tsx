import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit2, X, Check, Building2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import {
  useClientLogos,
  useCreateClientLogo,
  useUpdateClientLogo,
  useDeleteClientLogo,
} from "@/hooks/useClientLogos";
import { useCases } from "@/hooks/useCases";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ClientLogos = () => {
  const { data: logos, isLoading } = useClientLogos(false);
  const { data: casesData } = useCases();
  const allCases = [...(casesData?.featured || []), ...(casesData?.regular || [])];
  const createLogo = useCreateClientLogo();
  const updateLogo = useUpdateClientLogo();
  const deleteLogo = useDeleteClientLogo();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLogo, setNewLogo] = useState({ nome: "", logo_url: "", case_id: "", ordem: 0 });
  const [editData, setEditData] = useState({ nome: "", logo_url: "", case_id: "", ordem: 0 });

  const handleAdd = async () => {
    if (!newLogo.nome || !newLogo.logo_url) return;
    await createLogo.mutateAsync({
      nome: newLogo.nome,
      logo_url: newLogo.logo_url,
      case_id: newLogo.case_id || null,
      ordem: newLogo.ordem,
      ativo: true,
    });
    setNewLogo({ nome: "", logo_url: "", case_id: "", ordem: 0 });
    setIsAdding(false);
  };

  const handleUpdate = async (id: string) => {
    await updateLogo.mutateAsync({
      id,
      nome: editData.nome,
      logo_url: editData.logo_url,
      case_id: editData.case_id || null,
      ordem: editData.ordem,
    });
    setEditingId(null);
  };

  const handleToggleActive = async (id: string, ativo: boolean) => {
    await updateLogo.mutateAsync({ id, ativo: !ativo });
  };

  const startEdit = (logo: any) => {
    setEditingId(logo.id);
    setEditData({
      nome: logo.nome,
      logo_url: logo.logo_url,
      case_id: logo.case_id || "",
      ordem: logo.ordem || 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Logos de Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie as logos exibidas nos carrosséis de clientes
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Logo
          </Button>
        </div>

        {isAdding && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Logo de Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={newLogo.nome}
                    onChange={(e) => setNewLogo({ ...newLogo, nome: e.target.value })}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={newLogo.ordem}
                    onChange={(e) => setNewLogo({ ...newLogo, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Case Vinculado (opcional)</Label>
                <Select
                  value={newLogo.case_id}
                  onValueChange={(value) => setNewLogo({ ...newLogo, case_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {allCases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FileUpload
                label="Logo"
                onUploadComplete={(url) => setNewLogo({ ...newLogo, logo_url: url })}
                accept="image/*"
                currentUrl={newLogo.logo_url}
              />
              <div className="flex gap-2">
                <Button onClick={handleAdd} disabled={!newLogo.nome || !newLogo.logo_url}>
                  <Check className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : logos?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma logo cadastrada</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logos?.map((logo) => (
              <Card key={logo.id} className={!logo.ativo ? "opacity-50" : ""}>
                <CardContent className="p-4">
                  {editingId === logo.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editData.nome}
                        onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                        placeholder="Nome"
                      />
                      <Input
                        type="number"
                        value={editData.ordem}
                        onChange={(e) => setEditData({ ...editData, ordem: parseInt(e.target.value) || 0 })}
                        placeholder="Ordem"
                      />
                      <Select
                        value={editData.case_id}
                        onValueChange={(value) => setEditData({ ...editData, case_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Case vinculado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nenhum</SelectItem>
                          {allCases.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FileUpload
                        label="Logo"
                        onUploadComplete={(url) => setEditData({ ...editData, logo_url: url })}
                        accept="image/*"
                        currentUrl={editData.logo_url}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(logo.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center h-24 bg-muted rounded mb-3">
                        <img
                          src={logo.logo_url}
                          alt={logo.nome}
                          className="max-h-20 max-w-full object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-sm">{logo.nome}</p>
                        <p className="text-xs text-muted-foreground">Ordem: {logo.ordem}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={logo.ativo ?? true}
                              onCheckedChange={() => handleToggleActive(logo.id, logo.ativo ?? true)}
                            />
                            <span className="text-xs">{logo.ativo ? "Ativo" : "Inativo"}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => startEdit(logo)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteLogo.mutate(logo.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
};

export default ClientLogos;
