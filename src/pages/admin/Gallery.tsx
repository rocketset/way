import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { useGalleryPhotos, useCreateGalleryPhoto, useUpdateGalleryPhoto, useDeleteGalleryPhoto, GalleryPhoto } from "@/hooks/useGalleryPhotos";
import { Skeleton } from "@/components/ui/skeleton";
import FileUpload from "@/components/admin/FileUpload";

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
  });

  const resetForm = () => {
    setFormData({
      image_url: "",
      alt_text: "",
      ordem: photos?.length || 0,
      ativo: true,
    });
    setEditingPhoto(null);
  };

  const handleOpenDialog = (photo?: GalleryPhoto) => {
    if (photo) {
      setEditingPhoto(photo);
      setFormData({
        image_url: photo.image_url,
        alt_text: photo.alt_text || "",
        ordem: photo.ordem,
        ativo: photo.ativo,
      });
    } else {
      resetForm();
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
              Gerencie as fotos exibidas na página "Sobre a Way"
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Foto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingPhoto ? "Editar Foto" : "Adicionar Nova Foto"}
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
                  <Label htmlFor="ordem">Ordem de Exibição</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                  />
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

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className={`overflow-hidden ${!photo.ativo ? "opacity-50" : ""}`}>
                <div className="relative aspect-video">
                  <img
                    src={photo.image_url}
                    alt={photo.alt_text || "Foto da galeria"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
                    #{photo.ordem}
                  </div>
                  {!photo.ativo && (
                    <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                      Inativo
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {photo.alt_text || "Sem descrição"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleToggleActive(photo)}
                      >
                        <Switch checked={photo.ativo} className="pointer-events-none scale-75" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(photo)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(photo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma foto na galeria</h3>
            <p className="text-muted-foreground mb-4">
              Adicione fotos para exibi-las na página "Sobre a Way"
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Foto
            </Button>
          </Card>
        )}
    </div>
  );
};

export default Gallery;
