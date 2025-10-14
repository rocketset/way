import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Lock, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function Permissions() {
  const { permissions, isLoading, updatePermission } = useRolePermissions();
  const [activeRole, setActiveRole] = useState<string>('administrador');

  // Agrupar permissões por role
  const permissionsByRole = permissions.reduce((acc, perm) => {
    if (!acc[perm.role]) {
      acc[perm.role] = [];
    }
    acc[perm.role].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  // Agrupar por módulo dentro da role
  const groupByModule = (perms: typeof permissions) => {
    return perms.reduce((acc, perm) => {
      if (!acc[perm.modulo]) {
        acc[perm.modulo] = [];
      }
      acc[perm.modulo].push(perm);
      return acc;
    }, {} as Record<string, typeof permissions>);
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
        <Shield className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permissões</CardTitle>
          <CardDescription>
            Ative ou desative funcionalidades específicas para cada perfil de usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeRole} onValueChange={setActiveRole}>
            <TabsList className="grid w-full grid-cols-4">
              {Object.keys(permissionsByRole).map((role) => (
                <TabsTrigger key={role} value={role}>
                  {roleLabels[role] || role}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(permissionsByRole).map(([role, perms]) => {
              const moduleGroups = groupByModule(perms);
              
              return (
                <TabsContent key={role} value={role} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-sm">
                      {roleLabels[role] || role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {perms.filter(p => p.ativo).length} de {perms.length} permissões ativas
                    </span>
                  </div>

                  {Object.entries(moduleGroups).map(([modulo, modulePerms]) => (
                    <Card key={modulo}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          {moduloLabels[modulo] || modulo}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
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
                                <TableRow key={perm.id}>
                                  <TableCell className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    {permissaoLabels[perm.permissao] || perm.permissao}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={perm.ativo ? 'default' : 'secondary'}>
                                      {perm.ativo ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Switch
                                      checked={perm.ativo}
                                      onCheckedChange={(checked) => 
                                        updatePermission({ id: perm.id, ativo: checked })
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
                  ))}
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
