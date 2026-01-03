import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Shield, Lock, Eye, Edit, Trash2, Plus, UserPlus, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { useRolePermissions, ALL_MODULES, ALL_PERMISSIONS } from '@/hooks/useRolePermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database["public"]["Enums"]["app_role"];

const roleLabels: Record<string, string> = {
  administrador: 'Administrador',
  gestor_conteudo: 'Gestor de Conteúdo',
  colunista: 'Colunista',
  cliente: 'Cliente',
};

const moduloLabels: Record<string, string> = {
  usuarios: 'Usuários',
  blog: 'Blog',
  cases: 'Cases',
  academy: 'Academy',
  landing_pages: 'Landing Pages',
  popups: 'Popups',
  briefings: 'Briefings',
  carreiras: 'Carreiras',
  configuracoes: 'Configurações',
  media: 'Mídia',
};

const permissaoIcons: Record<string, any> = {
  visualizar: Eye,
  criar: Plus,
  editar: Edit,
  excluir: Trash2,
};

const permissaoLabels: Record<string, string> = {
  visualizar: 'Visualizar',
  criar: 'Criar',
  editar: 'Editar',
  excluir: 'Excluir',
};

// Roles disponíveis no sistema (do enum do banco)
const AVAILABLE_ROLES: AppRole[] = ['administrador', 'gestor_conteudo', 'colunista', 'cliente'];

export default function Permissions() {
  const { permissions, isLoading, updatePermission, createPermission, deletePermission, ensureAllPermissionsExist } = useRolePermissions();
  const [activeRole, setActiveRole] = useState<AppRole>('administrador');
  const [isInitializing, setIsInitializing] = useState(false);
  const [newRoleDialog, setNewRoleDialog] = useState(false);
  const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<AppRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Excluir todas as permissões de um perfil
  const handleDeleteRolePermissions = async (role: AppRole) => {
    if (role === 'administrador') {
      toast.error('Não é possível excluir as permissões do Administrador');
      return;
    }
    
    setIsDeleting(true);
    try {
      const rolePerms = permissions.filter(p => p.role === role);
      for (const perm of rolePerms) {
        await supabase.from('role_permissions').delete().eq('id', perm.id);
      }
      toast.success(`Todas as permissões de ${roleLabels[role]} foram excluídas`);
      setDeleteRoleDialog(false);
      setRoleToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir permissões');
    } finally {
      setIsDeleting(false);
    }
  };

  // Gerar matriz completa de permissões para cada role
  const generateFullPermissionMatrix = (role: AppRole) => {
    const existingPerms = permissions.filter(p => p.role === role);
    const permissionMap = new Map(
      existingPerms.map(p => [`${p.modulo}-${p.permissao}`, p])
    );

    const matrix: Record<string, Array<{
      id: string | null;
      modulo: string;
      permissao: string;
      ativo: boolean;
      exists: boolean;
    }>> = {};

    for (const modulo of ALL_MODULES) {
      matrix[modulo] = [];
      for (const permissao of ALL_PERMISSIONS) {
        const key = `${modulo}-${permissao}`;
        const existing = permissionMap.get(key);
        
        matrix[modulo].push({
          id: existing?.id || null,
          modulo,
          permissao,
          ativo: existing?.ativo || false,
          exists: !!existing,
        });
      }
    }

    return matrix;
  };

  // Inicializar permissões faltantes para o role ativo
  const handleInitializePermissions = async () => {
    setIsInitializing(true);
    try {
      await ensureAllPermissionsExist(activeRole);
      toast.success(`Permissões inicializadas para ${roleLabels[activeRole]}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao inicializar permissões');
    } finally {
      setIsInitializing(false);
    }
  };

  // Inicializar todas as permissões para todos os roles
  const handleInitializeAllRoles = async () => {
    setIsInitializing(true);
    try {
      for (const role of AVAILABLE_ROLES) {
        await ensureAllPermissionsExist(role);
      }
      toast.success('Permissões inicializadas para todos os perfis');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao inicializar permissões');
    } finally {
      setIsInitializing(false);
    }
  };

  // Toggle de permissão (cria se não existir)
  const handleTogglePermission = async (
    id: string | null,
    modulo: string,
    permissao: string,
    currentValue: boolean,
    exists: boolean
  ) => {
    if (exists && id) {
      updatePermission({ id, ativo: !currentValue });
    } else {
      createPermission({ role: activeRole, modulo, permissao, ativo: true });
    }
  };

  // Toggle todas as permissões de um módulo
  const handleToggleModule = async (modulo: string, modulePerms: Array<{ id: string | null; modulo: string; permissao: string; ativo: boolean; exists: boolean }>, activate: boolean) => {
    try {
      for (const perm of modulePerms) {
        if (perm.exists && perm.id) {
          if (perm.ativo !== activate) {
            await supabase.from('role_permissions').update({ ativo: activate }).eq('id', perm.id);
          }
        } else if (activate) {
          await supabase.from('role_permissions').insert({ role: activeRole, modulo: perm.modulo, permissao: perm.permissao, ativo: true });
        }
      }
      toast.success(`Todas as permissões de ${moduloLabels[modulo]} foram ${activate ? 'ativadas' : 'desativadas'}`);
      // Invalidar cache
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar permissões');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Permissões</h1>
          <p className="text-muted-foreground mt-2">
            Configure as permissões de cada nível de acesso do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleInitializeAllRoles}
            disabled={isInitializing}
          >
            {isInitializing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Inicializar Todos
          </Button>
          <Dialog open={newRoleDialog} onOpenChange={setNewRoleDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerenciar Perfis de Usuário</DialogTitle>
                <DialogDescription>
                  Os perfis de usuário são definidos no banco de dados como um enum.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Perfis Atuais:</p>
                  <div className="space-y-2">
                    {AVAILABLE_ROLES.map((role) => {
                      const rolePermsCount = permissions.filter(p => p.role === role).length;
                      const isAdmin = role === 'administrador';
                      
                      return (
                        <div key={role} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {roleLabels[role] || role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {rolePermsCount} permissões
                            </span>
                          </div>
                          {!isAdmin && rolePermsCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setRoleToDelete(role);
                                setDeleteRoleDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && (
                            <Badge variant="secondary" className="text-xs">
                              Protegido
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Nota:</strong> Para adicionar um novo perfil (role), é necessário:
                  </p>
                  <ol className="list-decimal list-inside mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>Executar uma migração SQL para adicionar o novo valor ao enum</li>
                    <li>Atualizar o código para incluir o novo perfil</li>
                    <li>Configurar as permissões do novo perfil</li>
                  </ol>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewRoleDialog(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog de confirmação de exclusão */}
          <Dialog open={deleteRoleDialog} onOpenChange={setDeleteRoleDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Permissões do Perfil</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir todas as permissões de <strong>{roleToDelete && roleLabels[roleToDelete]}</strong>?
                  Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                  <p className="text-sm text-destructive">
                    Ao excluir as permissões, usuários com este perfil perderão todos os acessos configurados.
                    Você poderá recriar as permissões depois clicando em "Criar Permissões Faltantes".
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteRoleDialog(false)} disabled={isDeleting}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => roleToDelete && handleDeleteRolePermissions(roleToDelete)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Permissões
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Shield className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permissões</CardTitle>
          <CardDescription>
            Ative ou desative funcionalidades específicas para cada perfil de usuário.
            Todas as seções são exibidas para todos os perfis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeRole} onValueChange={(v) => setActiveRole(v as AppRole)}>
            <TabsList className="grid w-full grid-cols-4">
              {AVAILABLE_ROLES.map((role) => (
                <TabsTrigger key={role} value={role}>
                  {roleLabels[role] || role}
                </TabsTrigger>
              ))}
            </TabsList>

            {AVAILABLE_ROLES.map((role) => {
              const permissionMatrix = generateFullPermissionMatrix(role);
              const allPermsForRole = Object.values(permissionMatrix).flat();
              const activeCount = allPermsForRole.filter(p => p.ativo).length;
              const totalCount = allPermsForRole.length;
              const missingCount = allPermsForRole.filter(p => !p.exists).length;
              
              return (
                <TabsContent key={role} value={role} className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm">
                        {roleLabels[role] || role}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {activeCount} de {totalCount} permissões ativas
                      </span>
                      {missingCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {missingCount} não configuradas
                        </Badge>
                      )}
                    </div>
                    {missingCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleInitializePermissions}
                        disabled={isInitializing}
                      >
                        {isInitializing ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Plus className="h-3 w-3 mr-1" />
                        )}
                        Criar Permissões Faltantes
                      </Button>
                    )}
                  </div>

                  {Object.entries(permissionMatrix).map(([modulo, modulePerms]) => {
                    const allActive = modulePerms.every(p => p.ativo);
                    const someActive = modulePerms.some(p => p.ativo);
                    
                    return (
                    <Card key={modulo}>
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            {moduloLabels[modulo] || modulo}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {allActive ? 'Todas ativas' : someActive ? 'Parcial' : 'Todas inativas'}
                            </span>
                            <Button
                              variant={allActive ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleModule(modulo, modulePerms, !allActive)}
                            >
                              {allActive ? (
                                <>
                                  <ToggleRight className="h-4 w-4 mr-1" />
                                  Desativar Todas
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-4 w-4 mr-1" />
                                  Ativar Todas
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Permissão</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {modulePerms.map((perm) => {
                              const Icon = permissaoIcons[perm.permissao] || Shield;
                              
                              return (
                                <TableRow key={`${modulo}-${perm.permissao}`} className={!perm.exists ? 'opacity-60' : ''}>
                                  <TableCell className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    {permissaoLabels[perm.permissao] || perm.permissao}
                                    {!perm.exists && (
                                      <Badge variant="outline" className="text-xs ml-2">
                                        Não configurada
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={perm.ativo ? 'default' : 'secondary'}>
                                      {perm.ativo ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Switch
                                      checked={perm.ativo}
                                      onCheckedChange={() => 
                                        handleTogglePermission(
                                          perm.id,
                                          perm.modulo,
                                          perm.permissao,
                                          perm.ativo,
                                          perm.exists
                                        )
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    );
                  })}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">ℹ️ Sobre as Permissões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Administrador:</strong> Acesso total ao sistema, incluindo gestão de usuários e permissões.</p>
          <p><strong>Gestor de Conteúdo:</strong> Pode gerenciar posts, cases e conteúdo da Academy.</p>
          <p><strong>Colunista:</strong> Pode criar e editar apenas seus próprios posts no blog.</p>
          <p><strong>Cliente:</strong> Acesso restrito à visualização de conteúdo da Academy e blog.</p>
        </CardContent>
      </Card>
    </div>
  );
}
