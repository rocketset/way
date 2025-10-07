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
import { Edit, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  };

  const handleSave = () => {
    if (editingProfile) {
      updateProfileMutation.mutate({ ...formData, id: editingProfile.id });
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
                            <Label>URL do Avatar</Label>
                            <Input
                              value={formData.avatar_url || ''}
                              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                              placeholder="URL da foto"
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
