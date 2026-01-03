// Página de gerenciamento de visibilidade do menu por role
// Permite configurar quais itens do menu são visíveis para cada role

import { useState } from 'react';
import { useAllMenuVisibility, useUpdateMenuVisibility, useToggleMenuActive, MenuVisibilityItem } from '@/hooks/useMenuVisibility';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings, ChevronRight, Eye, EyeOff, RefreshCw, Shield, PenTool, User, UserCog, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Roles disponíveis
const AVAILABLE_ROLES = [
  { id: 'administrador', label: 'Administrador', icon: Shield, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { id: 'gestor_conteudo', label: 'Gestor', icon: UserCog, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'colunista', label: 'Colunista', icon: PenTool, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 'membro', label: 'Membro', icon: User, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'cliente', label: 'Cliente', icon: Briefcase, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
];

export default function MenuVisibility() {
  const { data: menuItems, isLoading, refetch } = useAllMenuVisibility();
  const updateMutation = useUpdateMenuVisibility();
  const toggleActiveMutation = useToggleMenuActive();
  
  const [editingItem, setEditingItem] = useState<MenuVisibilityItem | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Agrupa itens por parent_key
  const mainItems = menuItems?.filter(item => !item.parent_key) || [];
  const subItemsMap = menuItems?.reduce((acc, item) => {
    if (item.parent_key) {
      if (!acc[item.parent_key]) acc[item.parent_key] = [];
      acc[item.parent_key].push(item);
    }
    return acc;
  }, {} as Record<string, MenuVisibilityItem[]>) || {};

  // Abre dialog de edição
  const handleEdit = (item: MenuVisibilityItem) => {
    setEditingItem(item);
    setSelectedRoles(item.roles || []);
  };

  // Salva alterações
  const handleSave = () => {
    if (!editingItem) return;
    updateMutation.mutate({ id: editingItem.id, roles: selectedRoles });
    setEditingItem(null);
  };

  // Toggle role selecionada
  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  // Toggle item ativo
  const handleToggleActive = (item: MenuVisibilityItem) => {
    toggleActiveMutation.mutate({ id: item.id, ativo: !item.ativo });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visibilidade do Menu</h1>
          <p className="text-muted-foreground mt-1">
            Configure quais itens do menu são visíveis para cada role
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Legenda de Roles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Legenda de Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_ROLES.map(role => (
              <Badge key={role.id} variant="secondary" className={cn('flex items-center gap-1', role.color)}>
                <role.icon className="h-3 w-3" />
                {role.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Itens */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Menu</CardTitle>
          <CardDescription>
            Clique em um item para editar suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Ativo</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Caminho</TableHead>
                  <TableHead>Roles com Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mainItems.map((item) => (
                  <>
                    {/* Item Principal */}
                    <TableRow 
                      key={item.id}
                      className={cn(
                        item.is_separator && 'bg-muted/50',
                        !item.ativo && 'opacity-50'
                      )}
                    >
                      <TableCell>
                        <Switch
                          checked={item.ativo}
                          onCheckedChange={() => handleToggleActive(item)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.is_separator ? (
                            <Badge variant="outline" className="font-semibold">
                              {item.menu_label}
                            </Badge>
                          ) : (
                            <span className="font-medium">{item.menu_label}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.menu_path || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.roles?.map(roleId => {
                            const role = AVAILABLE_ROLES.find(r => r.id === roleId);
                            return role ? (
                              <Badge key={roleId} variant="secondary" className={cn('text-xs', role.color)}>
                                {role.label.substring(0, 3)}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Subitens */}
                    {subItemsMap[item.menu_key]?.map((subItem) => (
                      <TableRow 
                        key={subItem.id}
                        className={cn(
                          'bg-muted/20',
                          !subItem.ativo && 'opacity-50'
                        )}
                      >
                        <TableCell>
                          <Switch
                            checked={subItem.ativo}
                            onCheckedChange={() => handleToggleActive(subItem)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 pl-6">
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{subItem.menu_label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {subItem.menu_path || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {subItem.roles?.map(roleId => {
                              const role = AVAILABLE_ROLES.find(r => r.id === roleId);
                              return role ? (
                                <Badge key={roleId} variant="secondary" className={cn('text-xs', role.color)}>
                                  {role.label.substring(0, 3)}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(subItem)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Permissões</DialogTitle>
            <DialogDescription>
              Configure quais roles podem ver "{editingItem?.menu_label}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Selecione as roles que terão acesso a este item do menu:
            </p>
            
            <div className="space-y-3">
              {AVAILABLE_ROLES.map(role => (
                <div
                  key={role.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedRoles.includes(role.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => toggleRole(role.id)}
                >
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() => toggleRole(role.id)}
                  />
                  <role.icon className="h-4 w-4" />
                  <span className="flex-1 font-medium">{role.label}</span>
                  {selectedRoles.includes(role.id) ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
