import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit2, X, Check, Award, GripVertical, Eye, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FileUpload from "@/components/admin/FileUpload";
import {
  usePartnerLogos,
  useCreatePartnerLogo,
  useUpdatePartnerLogo,
  useDeletePartnerLogo,
  PartnerLogo,
} from "@/hooks/usePartnerLogos";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

// Sortable Logo Item Component
const SortableLogoItem = ({ 
  logo, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: { 
  logo: PartnerLogo; 
  onEdit: (logo: PartnerLogo) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, ativo: boolean) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: logo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`${!logo.ativo ? "opacity-50" : ""} ${isDragging ? "ring-2 ring-primary shadow-2xl" : ""}`}
    >
      <CardContent className="p-4">
        <div 
          {...attributes} 
          {...listeners}
          className="flex items-center justify-center h-24 bg-checkerboard rounded mb-3 cursor-grab active:cursor-grabbing group relative"
        >
          <img
            src={logo.logo_url}
            alt={logo.nome}
            className="max-h-20 max-w-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors rounded">
            <GripVertical className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm truncate flex-1">{logo.nome}</p>
            <Badge variant="secondary" className="text-xs ml-2">#{(logo.ordem ?? 0) + 1}</Badge>
          </div>
          {logo.site_url && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="w-3 h-3" />
              <span className="truncate">{logo.site_url.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={logo.ativo ?? true}
                onCheckedChange={() => onToggleActive(logo.id, logo.ativo ?? true)}
              />
              <span className="text-xs">{logo.ativo ? "Ativo" : "Inativo"}</span>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => onEdit(logo)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => onDelete(logo.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PartnerLogos = () => {
  const { data: logos, isLoading } = usePartnerLogos(false);
  const createLogo = useCreatePartnerLogo();
  const updateLogo = useUpdatePartnerLogo();
  const deleteLogo = useDeletePartnerLogo();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLogo, setNewLogo] = useState({ nome: "", logo_url: "", site_url: "", ordem: 0 });
  const [editData, setEditData] = useState({ nome: "", logo_url: "", site_url: "", ordem: 0 });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get logos sorted by ordem
  const sortedLogos = logos?.slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)) || [];

  const handleAdd = async () => {
    if (!newLogo.nome || !newLogo.logo_url) return;
    await createLogo.mutateAsync({
      nome: newLogo.nome,
      logo_url: newLogo.logo_url,
      site_url: newLogo.site_url || null,
      ordem: sortedLogos.length,
      ativo: true,
    });
    setNewLogo({ nome: "", logo_url: "", site_url: "", ordem: 0 });
    setIsAdding(false);
  };

  const handleUpdate = async (id: string) => {
    await updateLogo.mutateAsync({
      id,
      nome: editData.nome,
      logo_url: editData.logo_url,
      site_url: editData.site_url || null,
      ordem: editData.ordem,
    });
    setEditingId(null);
  };

  const handleToggleActive = async (id: string, ativo: boolean) => {
    await updateLogo.mutateAsync({ id, ativo: !ativo });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta logo?")) {
      await deleteLogo.mutateAsync(id);
    }
  };

  const startEdit = (logo: PartnerLogo) => {
    setEditingId(logo.id);
    setEditData({
      nome: logo.nome,
      logo_url: logo.logo_url,
      site_url: logo.site_url || "",
      ordem: logo.ordem || 0,
    });
  };

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedLogos.findIndex((p) => p.id === active.id);
      const newIndex = sortedLogos.findIndex((p) => p.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedLogos = arrayMove(sortedLogos, oldIndex, newIndex);
        
        toast.promise(
          Promise.all(
            reorderedLogos.map((logo, index) =>
              updateLogo.mutateAsync({ id: logo.id, ordem: index })
            )
          ),
          {
            loading: 'Reordenando logos...',
            success: 'Logos reordenadas!',
            error: 'Erro ao reordenar logos',
          }
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Parceiros e Certificados</h1>
          <p className="text-muted-foreground">
            Gerencie as logos de parceiros e certificações
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
            <CardTitle>Nova Logo de Parceiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Parceiro</Label>
                <Input
                  value={newLogo.nome}
                  onChange={(e) => setNewLogo({ ...newLogo, nome: e.target.value })}
                  placeholder="Nome do parceiro"
                />
              </div>
              <div className="space-y-2">
                <Label>Site do Parceiro (opcional)</Label>
                <Input
                  value={newLogo.site_url}
                  onChange={(e) => setNewLogo({ ...newLogo, site_url: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>
            </div>
            <FileUpload
              label="Logo"
              onUploadComplete={(url) => setNewLogo({ ...newLogo, logo_url: url })}
              accept="image/*"
              currentUrl={newLogo.logo_url}
              folder="partner-logos"
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

      {/* Edit Dialog */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Parceiro</Label>
                <Input
                  value={editData.nome}
                  onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                  placeholder="Nome"
                />
              </div>
              <div className="space-y-2">
                <Label>Site do Parceiro (opcional)</Label>
                <Input
                  value={editData.site_url}
                  onChange={(e) => setEditData({ ...editData, site_url: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>
            </div>
            <FileUpload
              label="Logo"
              onUploadComplete={(url) => setEditData({ ...editData, logo_url: url })}
              accept="image/*"
              currentUrl={editData.logo_url}
              folder="partner-logos"
            />
            <div className="flex gap-2">
              <Button onClick={() => handleUpdate(editingId)}>
                <Check className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Prévia do Carrossel</h2>
          <Badge variant="secondary">{sortedLogos.length} logos</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          💡 <strong>Arraste</strong> as logos para reordenar. Clique no lápis para editar.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : logos?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma logo cadastrada</p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortedLogos.map(l => l.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {sortedLogos.map((logo) => (
                <SortableLogoItem
                  key={logo.id}
                  logo={logo}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default PartnerLogos;
