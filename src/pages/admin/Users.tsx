// Página de gerenciamento de Usuários
// Visualização e edição de usuários do sistema

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, User, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { MediaSelector } from '@/components/editor/MediaSelector';

type UserRole = 'administrador' | 'colunista' | 'membro' | 'gestor_conteudo' | 'cliente';

interface Profile {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string | null;
  whatsapp?: string | null;
  email_principal?: string | null;
  empresa?: string | null;
  site_empresa?: string | null;
  intencao_cadastro?: string | null;
  criado_em: string;
  role?: UserRole;
}

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    avatar_url: '',
    whatsapp: '',
    email_principal: '',
    empresa: '',
    site_empresa: '',
    intencao_cadastro: '',
    role: 'membro' as UserRole,
  });
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);

  // Carrega usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para buscar todos os usuários
  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      // Busca roles para cada usuário
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id)
            .maybeSingle();
          
          return { ...profile, role: roleData?.role };
        })
      );

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      avatar_url: '',
      whatsapp: '',
      email_principal: '',
      empresa: '',
      site_empresa: '',
      intencao_cadastro: '',
      role: 'membro',
    });
    setDialogOpen(true);
  };

  // Abre o dialog para editar usuário existente
  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      senha: '',
      avatar_url: user.avatar_url || '',
      whatsapp: user.whatsapp || '',
      email_principal: user.email_principal || '',
      empresa: user.empresa || '',
      site_empresa: user.site_empresa || '',
      intencao_cadastro: user.intencao_cadastro || '',
      role: user.role || 'membro',
    });
    setDialogOpen(true);
  };

  // Função para selecionar imagem da biblioteca de mídia
  const handleMediaSelect = (url: string) => {
    setFormData({ ...formData, avatar_url: url });
    setMediaSelectorOpen(false);
  };

  // Função para salvar (criar ou atualizar) usuário
  const handleSave = async () => {
    if (!formData.nome.trim() || !formData.email.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!editingUser && !formData.senha) {
      toast.error('Senha é obrigatória para novos usuários');
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      if (editingUser) {
        // Atualiza usuário existente
        const { error } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            email: formData.email,
            avatar_url: formData.avatar_url || null,
            whatsapp: formData.whatsapp || null,
            email_principal: formData.email_principal || null,
            empresa: formData.empresa || null,
            site_empresa: formData.site_empresa || null,
            intencao_cadastro: formData.intencao_cadastro || null,
          })
          .eq('id', editingUser.id);

        if (error) throw error;

        // Atualiza senha se fornecida
        if (formData.senha) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            editingUser.id,
            { password: formData.senha }
          );
          
          if (passwordError) throw passwordError;
          toast.success('Senha atualizada com sucesso!');
        }

        // Atualiza role se necessário
        const currentRole = editingUser.role;
        if (currentRole !== formData.role) {
          // Remove role antiga
          if (currentRole) {
            await supabase
              .from('user_roles')
              .delete()
              .eq('user_id', editingUser.id);
          }

          // Adiciona nova role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{
              user_id: editingUser.id,
              role: formData.role,
            }]);
          
          if (roleError) throw roleError;
        }

        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Cria novo usuário através do Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.senha,
          options: {
            data: {
              nome: formData.nome,
            },
            emailRedirectTo: `${window.location.origin}/auth/login`,
          }
        });

        if (authError) throw authError;

        // Adiciona role ao novo usuário
        if (authData.user) {
          await supabase
            .from('user_roles')
            .insert([{
              user_id: authData.user.id,
              role: formData.role,
            }]);
        }

        toast.success('Usuário criado com sucesso!');
      }

      setDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar usuário');
      console.error('Erro:', error);
    }
  };

  // Função para deletar usuário
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) return;

    try {
      // O trigger ON DELETE CASCADE irá remover o perfil automaticamente
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;
      toast.success('Usuário excluído com sucesso!');
      fetchUsers();
    } catch (error: any) {
      toast.error('Erro ao excluir usuário. Você pode não ter permissões suficientes.');
      console.error('Erro:', error);
    }
  };

  // Função auxiliar para obter o badge de role
  const getRoleBadge = (user: Profile) => {
    if (!user.role) {
      return <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Sem papel</span>;
    }
    
    switch (user.role) {
      case 'administrador':
        return <span className="inline-flex px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Administrador</span>;
      case 'colunista':
        return <span className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Colunista</span>;
      case 'membro':
        return <span className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Membro</span>;
      case 'gestor_conteudo':
        return <span className="inline-flex px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Gestor de Conteúdo</span>;
      case 'cliente':
        return <span className="inline-flex px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">Cliente</span>;
      default:
        return <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{user.role}</span>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Usuário
        </Button>
      </div>

      {/* Tabela de usuários */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum usuário cadastrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user)}</TableCell>
                  <TableCell>
                    {new Date(user.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para criar/editar usuário */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Atualize as informações do usuário'
                : 'Preencha os dados para criar um novo usuário'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview e Seleção de Foto */}
            <div className="space-y-2">
              <Label>Foto do Perfil</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => setMediaSelectorOpen(true)}
                     className="w-full"
                   >
                     <ImageIcon className="w-4 h-4 mr-2" />
                     Selecionar Imagem
                   </Button>
                   <p className="text-xs text-muted-foreground mt-2">
                     Tamanho recomendado: 400x400px (formato quadrado)
                   </p>
                </div>
              </div>
            </div>

            {/* Campo Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            {/* Campo E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                disabled={!!editingUser}
              />
              {editingUser && (
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado
                </p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="senha">
                {editingUser ? 'Nova Senha (opcional)' : 'Senha *'}
              </Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : 'Mínimo 6 caracteres'}
                minLength={6}
              />
              {editingUser && (
                <p className="text-xs text-muted-foreground">
                  Preencha apenas se deseja alterar a senha do usuário
                </p>
              )}
            </div>

            {/* Novos campos */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+5511999999999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_principal">E-mail Principal</Label>
              <Input
                id="email_principal"
                type="email"
                value={formData.email_principal}
                onChange={(e) => setFormData({ ...formData, email_principal: e.target.value })}
                placeholder="melhor.contato@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_empresa">Site da Empresa</Label>
              <Input
                id="site_empresa"
                type="url"
                value={formData.site_empresa}
                onChange={(e) => setFormData({ ...formData, site_empresa: e.target.value })}
                placeholder="https://www.empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intencao_cadastro">Intenção de Cadastro</Label>
              <Input
                id="intencao_cadastro"
                value={formData.intencao_cadastro}
                onChange={(e) => setFormData({ ...formData, intencao_cadastro: e.target.value })}
                placeholder="Ex: Cliente, Parceiro..."
              />
            </div>

            {/* Campo Tipo de Usuário */}
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuário *</Label>
              <Select
                open={roleSelectOpen}
                onOpenChange={setRoleSelectOpen}
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-[100] pointer-events-auto">
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="gestor_conteudo">Gestor de Conteúdo</SelectItem>
                  <SelectItem value="colunista">Colunista</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingUser ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Selector Modal */}
      <MediaSelector
        open={mediaSelectorOpen}
        onClose={() => setMediaSelectorOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
