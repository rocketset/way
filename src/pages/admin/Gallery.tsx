import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon, Eye } from "lucide-react";
import { useGalleryPhotos, useCreateGalleryPhoto, useUpdateGalleryPhoto, useDeleteGalleryPhoto, GalleryPhoto } from "@/hooks/useGalleryPhotos";
import { Skeleton } from "@/components/ui/skeleton";
import FileUpload from "@/components/admin/FileUpload";
import ImagePositionPicker from "@/components/admin/ImagePositionPicker";
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

const Gallery = () => {
  const { data: photos, isLoading } = useGalleryPhotos(false);
  const createPhoto = useCreateGalleryPhoto();
  const updatePhoto = useUpdateGalleryPhoto();
  const deletePhoto = useDeleteGalleryPhoto();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [formData, setFormData] = useState({
    image_url: "",
    alt_text: "",
    ordem: 0,
    ativo: true,
    object_fit: "cover" as 'cover' | 'contain' | 'fill',
    object_position: "50% 50%",
    row_span: 1,
  });

  // Get photos sorted by ordem for display
  const sortedPhotos = photos?.slice().sort((a, b) => a.ordem - b.ordem) || [];
  
  // Create preview - show actual photos + placeholders to fill 10 minimum positions
  const minPositions = 10;
  const totalPositions = Math.max(minPositions, sortedPhotos.length + 1);
  
  const getColSpan = (index: number) => {
    // Wide positions: 0, 5, 6, 9 (and continue pattern for more)
    const widePositions = [0, 5, 6, 9];
    return widePositions.includes(index % 10) ? 2 : 1;
  };

  const resetForm = () => {
    setFormData({
      image_url: "",
      alt_text: "",
      ordem: photos?.length ?? 0,
      ativo: true,
      object_fit: "cover",
      object_position: "50% 50%",
      row_span: 1,
    });
    setEditingPhoto(null);
  };

  const handleOpenDialogForNew = (position?: number) => {
    setEditingPhoto(null);
    setFormData({
      image_url: "",
      alt_text: "",
      ordem: position ?? photos?.length ?? 0,
      ativo: true,
      object_fit: "cover",
      object_position: "50% 50%",
      row_span: 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialogForEdit = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setFormData({
      image_url: photo.image_url,
      alt_text: photo.alt_text || "",
      ordem: photo.ordem,
      ativo: photo.ativo,
      object_fit: photo.object_fit || "cover",
      object_position: photo.object_position || "50% 50%",
      row_span: photo.row_span || 1,
    });
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
            Gerencie as fotos exibidas na página "Por Que Way"
          </p>
        </div>
        <Button onClick={() => handleOpenDialogForNew()}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Foto
        </Button>
      </div>

      {/* Preview Section - Same layout as public page */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Prévia do Layout (como aparece no site)</h2>
          <Badge variant="secondary">{sortedPhotos.length} fotos</Badge>
        </div>
        
        <Card className="p-6 bg-muted/30">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[180px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className={`rounded-xl ${getColSpan(i) === 2 ? 'col-span-2' : 'col-span-1'}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[180px]">
              {Array.from({ length: totalPositions }).map((_, index) => {
                const photo = sortedPhotos.find(p => p.ordem === index);
                const fallbackImage = staticGalleryPhotos[index];
                const hasPhoto = photo !== undefined;
                const imageUrl = hasPhoto ? photo.image_url : fallbackImage;
                const isInactive = hasPhoto && !photo.ativo;
                const objectFit = hasPhoto ? photo.object_fit || 'cover' : 'cover';
                const objectPosition = hasPhoto ? photo.object_position || '50% 50%' : '50% 50%';
                const rowSpan = hasPhoto ? photo.row_span || 1 : 1;
                const colSpan = getColSpan(index);
                
                const handleClick = () => {
                  if (hasPhoto && photo) {
                    handleOpenDialogForEdit(photo);
                  } else {
                    handleOpenDialogForNew(index);
                  }
                };
                
                return (
                  <div
                    key={index}
                    className={`
                      relative overflow-hidden rounded-xl border-2 
                      ${hasPhoto ? 'border-primary/50 bg-primary/5' : fallbackImage ? 'border-border bg-muted/50' : 'border-dashed border-border bg-muted/30'}
                      ${colSpan === 2 ? 'col-span-2' : 'col-span-1'}
                      group cursor-pointer hover:border-primary transition-all duration-300
                      ${isInactive ? 'opacity-50' : ''}
                    `}
                    style={{ gridRow: `span ${rowSpan}` }}
                    onClick={handleClick}
                  >
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={hasPhoto ? photo.alt_text || "Foto da galeria" : "Placeholder"}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                          style={{ 
                            objectFit: objectFit,
                            objectPosition: objectPosition
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          {hasPhoto ? (
                            <Button size="sm" variant="secondary" className="gap-2">
                              <Pencil className="w-4 h-4" />
                              Editar Foto
                            </Button>
                          ) : (
                            <Button size="sm" variant="secondary" className="gap-2">
                              <Plus className="w-4 h-4" />
                              Adicionar Foto
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2 p-4">
                        <Plus className="w-8 h-8" />
                        <span className="text-xs text-center">Adicionar foto</span>
                      </div>
                    )}
                    
                    {/* Position badge */}
                    <Badge 
                      variant={hasPhoto ? "default" : "secondary"} 
                      className="absolute top-2 left-2 text-xs"
                    >
                      #{index + 1} {hasPhoto ? '✓' : ''}
                    </Badge>
                    
                    {/* Status badges */}
                    {hasPhoto && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        {isInactive && (
                          <Badge variant="destructive" className="text-xs">Inativo</Badge>
                        )}
                      </div>
                    )}
                    
                    {!hasPhoto && fallbackImage && (
                      <Badge variant="outline" className="absolute top-2 right-2 text-xs bg-background/80">
                        Fallback
                      </Badge>
                    )}
                    
                    {/* Quick actions on hover */}
                    {hasPhoto && photo && (
                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(photo);
                          }}
                        >
                          <Switch checked={photo.ativo} className="pointer-events-none scale-75" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(photo.id);
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
          💡 Clique em qualquer posição para adicionar ou editar. Posições 1, 6, 7 e 10 ocupam 2 colunas. Você pode adicionar mais de 10 fotos!
        </p>
      </div>

      {/* All Photos List */}
      {photos && photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Todas as Fotos ({photos.length})</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sortedPhotos.map((photo) => (
              <Card 
                key={photo.id} 
                className={`overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all ${!photo.ativo ? "opacity-50" : ""}`}
                onClick={() => handleOpenDialogForEdit(photo)}
              >
                <div className="relative aspect-square">
                  <img
                    src={photo.image_url}
                    alt={photo.alt_text || "Foto da galeria"}
                    className="w-full h-full"
                    style={{ 
                      objectFit: photo.object_fit || 'cover',
                      objectPosition: photo.object_position || 'center'
                    }}
                  />
                  <Badge className="absolute top-1 left-1 text-xs">#{photo.ordem + 1}</Badge>
                  {!photo.ativo && (
                    <Badge variant="destructive" className="absolute top-1 right-1 text-xs">Inativo</Badge>
                  )}
                </div>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate flex-1">
                      {photo.alt_text || "Sem descrição"}
                    </span>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialogForEdit(photo);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-destructive" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id);
                        }}
                      >
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

      {/* Empty state */}
      {!isLoading && (!photos || photos.length === 0) && (
        <Card className="p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma foto na galeria</h3>
          <p className="text-muted-foreground mb-4">
            Clique nos quadros acima ou no botão "Adicionar Foto" para começar
          </p>
        </Card>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPhoto ? `Editar Foto #${editingPhoto.ordem + 1}` : `Adicionar Foto - Posição ${formData.ordem + 1}`}
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
              <Label htmlFor="ordem">Posição no Grid</Label>
              <Input
                id="ordem"
                type="number"
                min="0"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Posições 1, 6, 7 e 10 (e múltiplos) ocupam 2 colunas
              </p>
            </div>

            {/* Display Settings */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Ajustes de Exibição</h4>
              
              <div className="space-y-2">
                <Label htmlFor="object_fit">Modo de Corte</Label>
                <select
                  id="object_fit"
                  value={formData.object_fit}
                  onChange={(e) => setFormData({ ...formData, object_fit: e.target.value as 'cover' | 'contain' | 'fill' })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="cover">Preencher (corta)</option>
                  <option value="contain">Encaixar (não corta)</option>
                  <option value="fill">Esticar</option>
                </select>
              </div>

              {/* Interactive Position Picker */}
              {formData.image_url && formData.object_fit === 'cover' && (
                <ImagePositionPicker
                  imageUrl={formData.image_url}
                  position={{
                    x: parseFloat(formData.object_position.split(' ')[0]) || 50,
                    y: parseFloat(formData.object_position.split(' ')[1] || formData.object_position.split(' ')[0]) || 50,
                  }}
                  onChange={({ x, y }) => setFormData({ ...formData, object_position: `${x}% ${y}%` })}
                  objectFit={formData.object_fit}
                />
              )}

              <div className="space-y-2">
                <Label htmlFor="row_span">Altura do Quadro</Label>
                <select
                  id="row_span"
                  value={formData.row_span}
                  onChange={(e) => setFormData({ ...formData, row_span: parseInt(e.target.value) })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value={1}>Normal (1x)</option>
                  <option value={2}>Alto (2x)</option>
                  <option value={3}>Extra Alto (3x)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Aumentar a altura mostra mais da imagem sem cortar
                </p>
              </div>
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
