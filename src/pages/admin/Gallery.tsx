import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon, Eye } from "lucide-react";
import { useGalleryPhotos, useCreateGalleryPhoto, useUpdateGalleryPhoto, useDeleteGalleryPhoto, GalleryPhoto } from "@/hooks/useGalleryPhotos";
import { Skeleton } from "@/components/ui/skeleton";
import FileUpload from "@/components/admin/FileUpload";
import { Badge } from "@/components/ui/badge";

// Fallback static images for preview
import galleryTeam1 from "@/assets/gallery/team-1.jpg";
import galleryTeam2 from "@/assets/gallery/team-2.jpg";
import galleryTeam3 from "@/assets/gallery/team-3.jpg";
import galleryTeam4 from "@/assets/gallery/team-4.png";
import galleryTeam5 from "@/assets/gallery/team-5.png";
import galleryTeam6 from "@/assets/gallery/team-6.png";
import galleryTeam7 from "@/assets/gallery/team-7.png";
import galleryTeam8 from "@/assets/gallery/team-8.png";
import galleryTeam9 from "@/assets/gallery/team-9.png";
import galleryTeam10 from "@/assets/gallery/team-10.png";

const staticGalleryPhotos = [galleryTeam1, galleryTeam2, galleryTeam3, galleryTeam4, galleryTeam5, galleryTeam6, galleryTeam7, galleryTeam8, galleryTeam9, galleryTeam10];

// Grid positions config - same layout as WhyWay page
const gridPositions = [
  { colSpan: 2, rowSpan: 1, label: "Posição 1 (2 colunas)" },
  { colSpan: 1, rowSpan: 1, label: "Posição 2" },
  { colSpan: 1, rowSpan: 1, label: "Posição 3" },
  { colSpan: 1, rowSpan: 1, label: "Posição 4" },
  { colSpan: 1, rowSpan: 1, label: "Posição 5" },
  { colSpan: 2, rowSpan: 1, label: "Posição 6 (2 colunas)" },
  { colSpan: 2, rowSpan: 1, label: "Posição 7 (2 colunas)" },
  { colSpan: 1, rowSpan: 1, label: "Posição 8" },
  { colSpan: 1, rowSpan: 1, label: "Posição 9" },
  { colSpan: 2, rowSpan: 1, label: "Posição 10 (2 colunas)" },
];

const Gallery = () => {
  const { data: photos, isLoading } = useGalleryPhotos(false);
  const createPhoto = useCreateGalleryPhoto();
  const updatePhoto = useUpdateGalleryPhoto();
  const deletePhoto = useDeleteGalleryPhoto();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [editingPosition, setEditingPosition] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    image_url: "",
    alt_text: "",
    ordem: 0,
    ativo: true,
  });

  // Get photos sorted by ordem for display
  const sortedPhotos = photos?.slice().sort((a, b) => a.ordem - b.ordem) || [];
  
  // Create preview array with 10 positions (same as public page)
  const galleryPreview = gridPositions.map((pos, index) => {
    const photo = sortedPhotos.find(p => p.ordem === index);
    return {
      ...pos,
      index,
      photo,
      fallbackImage: staticGalleryPhotos[index] || null,
    };
  });

  const resetForm = () => {
    setFormData({
      image_url: "",
      alt_text: "",
      ordem: editingPosition ?? photos?.length ?? 0,
      ativo: true,
    });
    setEditingPhoto(null);
    setEditingPosition(null);
  };

  const handleOpenDialog = (photo?: GalleryPhoto, position?: number) => {
    if (photo) {
      setEditingPhoto(photo);
      setFormData({
        image_url: photo.image_url,
        alt_text: photo.alt_text || "",
        ordem: photo.ordem,
        ativo: photo.ativo,
      });
    } else {
      setEditingPosition(position ?? null);
      setFormData({
        image_url: "",
        alt_text: "",
        ordem: position ?? photos?.length ?? 0,
        ativo: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPhoto) {
      await updatePhoto.mutateAsync({
        id: editingPhoto.id,
        ...formData,
      });
    } else {
      await createPhoto.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta foto?")) {
      await deletePhoto.mutateAsync(id);
    }
  };

  const handleToggleActive = async (photo: GalleryPhoto) => {
    await updatePhoto.mutateAsync({
      id: photo.id,
      ativo: !photo.ativo,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Galeria de Fotos</h1>
          <p className="text-muted-foreground">
            Gerencie as fotos exibidas na página "Por Que Way" - o layout aqui reflete exatamente como aparece no site
          </p>
        </div>
      </div>

      {/* Preview Section - Same layout as public page */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Prévia do Layout (como aparece no site)</h2>
        </div>
        
        <Card className="p-6 bg-muted/30">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[180px]">
              {gridPositions.map((pos, i) => (
                <Skeleton 
                  key={i} 
                  className={`rounded-xl ${pos.colSpan === 2 ? 'col-span-2' : 'col-span-1'}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[180px]">
              {galleryPreview.map((item) => {
                const hasPhoto = item.photo;
                const imageUrl = hasPhoto ? item.photo!.image_url : item.fallbackImage;
                const isInactive = hasPhoto && !item.photo!.ativo;
                
                return (
                  <div
                    key={item.index}
                    className={`
                      relative overflow-hidden rounded-xl border-2 border-dashed 
                      ${hasPhoto ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/50'}
                      ${item.colSpan === 2 ? 'col-span-2' : 'col-span-1'}
                      group cursor-pointer hover:border-primary transition-all duration-300
                      ${isInactive ? 'opacity-50' : ''}
                    `}
                    onClick={() => handleOpenDialog(item.photo || undefined, item.index)}
                  >
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={hasPhoto ? item.photo!.alt_text || "Foto da galeria" : "Placeholder"}
                          className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button size="sm" variant="secondary" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            {hasPhoto ? 'Editar' : 'Adicionar'}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2 p-4">
                        <Plus className="w-8 h-8" />
                        <span className="text-xs text-center">Clique para adicionar</span>
                      </div>
                    )}
                    
                    {/* Position badge */}
                    <Badge 
                      variant={hasPhoto ? "default" : "secondary"} 
                      className="absolute top-2 left-2 text-xs"
                    >
                      #{item.index + 1}
                    </Badge>
                    
                    {/* Status badges */}
                    {hasPhoto && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        {isInactive && (
                          <Badge variant="destructive" className="text-xs">Inativo</Badge>
                        )}
                        {!hasPhoto && item.fallbackImage && (
                          <Badge variant="outline" className="text-xs bg-background">Fallback</Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Quick actions on hover */}
                    {hasPhoto && (
                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(item.photo!);
                          }}
                        >
                          <Switch checked={item.photo!.ativo} className="pointer-events-none scale-75" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.photo!.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
        
        <p className="text-sm text-muted-foreground">
          💡 Clique em qualquer posição para adicionar ou editar a foto. As posições 1, 6, 7 e 10 ocupam 2 colunas no desktop.
        </p>
      </div>

      {/* All Photos List */}
      {photos && photos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Todas as Fotos ({photos.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {photos.map((photo) => (
              <Card key={photo.id} className={`overflow-hidden ${!photo.ativo ? "opacity-50" : ""}`}>
                <div className="relative aspect-square">
                  <img
                    src={photo.image_url}
                    alt={photo.alt_text || "Foto da galeria"}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-1 left-1 text-xs">#{photo.ordem}</Badge>
                </div>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">
                      {photo.alt_text || "Sem alt"}
                    </span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleOpenDialog(photo)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDelete(photo.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPhoto ? "Editar Foto" : `Adicionar Foto - Posição ${(editingPosition ?? 0) + 1}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <FileUpload
                label="Imagem"
                onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                currentUrl={formData.image_url}
                accept="image/*"
                folder="gallery"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt_text">Texto Alternativo (Alt)</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Descrição da imagem para acessibilidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordem">Posição no Grid (0-9)</Label>
              <Input
                id="ordem"
                type="number"
                min="0"
                max="9"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Posições 0, 5, 6 e 9 ocupam 2 colunas no desktop
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label htmlFor="ativo">Ativo (visível no site)</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!formData.image_url || createPhoto.isPending || updatePhoto.isPending}>
                {editingPhoto ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
