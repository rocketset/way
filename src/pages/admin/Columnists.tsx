import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Edit, User, Upload, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import imageCompression from 'browser-image-compression';

interface Profile {
  id: string;
  nome: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  cargo: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  site_pessoal: string | null;
  is_colunista: boolean;
}

const Columnists = () => {
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('nome');

      if (error) throw error;
      return data as Profile[];
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profile: Partial<Profile> & { id: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      toast.success('Perfil atualizado com sucesso!');
      setEditingProfile(null);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    },
  });

  const toggleColumnistMutation = useMutation({
    mutationFn: async ({ id, is_colunista }: { id: string; is_colunista: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_colunista })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      toast.success('Status de colunista atualizado!');
    },
    onError: (error) => {
      console.error('Error toggling columnist:', error);
      toast.error('Erro ao atualizar status');
    },
  });

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData(profile);
    setPreviewImage(profile.avatar_url);
  };

  const handleSave = () => {
    if (editingProfile) {
      updateProfileMutation.mutate({ ...formData, id: editingProfile.id });
    }
  };

  // Função para fazer upload da imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    setUploadingImage(true);

    try {
      // Comprimir a imagem
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // Gerar nome único para o arquivo
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrl });
      setPreviewImage(publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  // Função para selecionar imagem da biblioteca de mídia
  const handleSelectFromLibrary = async () => {
    try {
      const { data: mediaFiles, error } = await supabase
        .from('media_library')
        .select('*')
        .eq('mime_type', 'image/jpeg')
        .or('mime_type.eq.image/png,mime_type.eq.image/webp,mime_type.eq.image/jpg')
        .order('criado_em', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Aqui você pode implementar um modal para selecionar da biblioteca
      // Por enquanto, vamos apenas abrir a biblioteca
      setShowMediaLibrary(true);
    } catch (error: any) {
      console.error('Erro ao carregar biblioteca:', error);
      toast.error('Erro ao carregar biblioteca de mídia');
    }
  };

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Colunistas</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os colunistas do blog e suas informações
        </p>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.nome} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{profile.nome}</TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{profile.cargo || '-'}</TableCell>
                <TableCell>
                  {profile.is_colunista ? (
                    <Badge variant="default">Colunista</Badge>
                  ) : (
                    <Badge variant="secondary">Usuário</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={profile.is_colunista}
                      onCheckedChange={(checked) =>
                        toggleColumnistMutation.mutate({ id: profile.id, is_colunista: checked })
                      }
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(profile)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Perfil de Colunista</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Upload de Foto */}
                          <div className="space-y-2">
                            <Label>Foto do Perfil</Label>
                            <div className="flex items-start gap-4">
                              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border flex-shrink-0">
                                {previewImage ? (
                                  <img 
                                    src={previewImage} 
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-16 h-16 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <Input
                                  id="avatar-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  disabled={uploadingImage}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById('avatar-upload')?.click()}
                                  disabled={uploadingImage}
                                  className="w-full"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  {uploadingImage ? 'Enviando...' : 'Enviar Nova Foto'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => window.open('/admin/media', '_blank')}
                                  className="w-full"
                                >
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                  Escolher da Biblioteca
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  Recomendado: imagem quadrada de até 1MB
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Nome</Label>
                            <Input
                              value={formData.nome || ''}
                              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Cargo</Label>
                            <Input
                              value={formData.cargo || ''}
                              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                              placeholder="Ex: Editor-chefe, Colunista de tecnologia"
                            />
                          </div>
                          
                          <div>
                            <Label>Bio (máx. 500 caracteres)</Label>
                            <Textarea
                              value={formData.bio || ''}
                              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                              maxLength={500}
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label>Instagram</Label>
                            <Input
                              value={formData.instagram || ''}
                              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                              placeholder="https://instagram.com/usuario"
                            />
                          </div>
                          <div>
                            <Label>LinkedIn</Label>
                            <Input
                              value={formData.linkedin || ''}
                              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                              placeholder="https://linkedin.com/in/usuario"
                            />
                          </div>
                          <div>
                            <Label>Twitter</Label>
                            <Input
                              value={formData.twitter || ''}
                              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                              placeholder="https://twitter.com/usuario"
                            />
                          </div>
                          <div>
                            <Label>Site Pessoal</Label>
                            <Input
                              value={formData.site_pessoal || ''}
                              onChange={(e) => setFormData({ ...formData, site_pessoal: e.target.value })}
                              placeholder="https://seusite.com"
                            />
                          </div>
                          <Button onClick={handleSave} className="w-full">
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Columnists;
