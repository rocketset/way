import { useState } from 'react';
import { 
  useDiagnosticHubs, 
  useDiagnosticTools, 
  useCreateHub, 
  useUpdateHub, 
  useDeleteHub,
  useCreateTool,
  useUpdateTool,
  useDeleteTool,
  DiagnosticHub,
  DiagnosticTool
} from '@/hooks/useDiagnosticConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  BarChart3,
  Users,
  Settings,
  ShoppingCart,
  DollarSign,
  Wrench,
  Target,
  Zap
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ICON_OPTIONS = [
  { value: 'BarChart3', label: 'Gráfico', icon: BarChart3 },
  { value: 'Users', label: 'Usuários', icon: Users },
  { value: 'Settings', label: 'Configurações', icon: Settings },
  { value: 'ShoppingCart', label: 'Carrinho', icon: ShoppingCart },
  { value: 'DollarSign', label: 'Dinheiro', icon: DollarSign },
  { value: 'Wrench', label: 'Ferramenta', icon: Wrench },
  { value: 'Target', label: 'Alvo', icon: Target },
  { value: 'Zap', label: 'Raio', icon: Zap },
];

const IMPORTANCE_OPTIONS = [
  { value: 'Alta', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  { value: 'Média', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  { value: 'Baixa', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
];

const getIconComponent = (iconName: string) => {
  const option = ICON_OPTIONS.find(o => o.value === iconName);
  return option?.icon || BarChart3;
};

const DiagnosticConfig = () => {
  const { data: hubs, isLoading: hubsLoading } = useDiagnosticHubs();
  const { data: allTools } = useDiagnosticTools();
  
  const createHub = useCreateHub();
  const updateHub = useUpdateHub();
  const deleteHub = useDeleteHub();
  const createTool = useCreateTool();
  const updateTool = useUpdateTool();
  const deleteTool = useDeleteTool();

  const [expandedHubs, setExpandedHubs] = useState<string[]>([]);
  const [hubDialogOpen, setHubDialogOpen] = useState(false);
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [editingHub, setEditingHub] = useState<DiagnosticHub | null>(null);
  const [editingTool, setEditingTool] = useState<DiagnosticTool | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'hub' | 'tool'; id: string; name: string } | null>(null);

  const [hubForm, setHubForm] = useState({ name: '', icon: 'BarChart3' });
  const [toolForm, setToolForm] = useState({ name: '', description: '', importance: 'Alta' });

  const toggleHub = (hubId: string) => {
    setExpandedHubs(prev => 
      prev.includes(hubId) 
        ? prev.filter(id => id !== hubId)
        : [...prev, hubId]
    );
  };

  const openHubDialog = (hub?: DiagnosticHub) => {
    if (hub) {
      setEditingHub(hub);
      setHubForm({ name: hub.name, icon: hub.icon });
    } else {
      setEditingHub(null);
      setHubForm({ name: '', icon: 'BarChart3' });
    }
    setHubDialogOpen(true);
  };

  const openToolDialog = (hubId: string, tool?: DiagnosticTool) => {
    setSelectedHubId(hubId);
    if (tool) {
      setEditingTool(tool);
      setToolForm({ name: tool.name, description: tool.description, importance: tool.importance });
    } else {
      setEditingTool(null);
      setToolForm({ name: '', description: '', importance: 'Alta' });
    }
    setToolDialogOpen(true);
  };

  const handleSaveHub = async () => {
    if (!hubForm.name.trim()) return;
    
    if (editingHub) {
      await updateHub.mutateAsync({ id: editingHub.id, ...hubForm });
    } else {
      await createHub.mutateAsync(hubForm);
    }
    setHubDialogOpen(false);
  };

  const handleSaveTool = async () => {
    if (!toolForm.name.trim() || !toolForm.description.trim()) return;
    
    if (editingTool) {
      await updateTool.mutateAsync({ id: editingTool.id, ...toolForm });
    } else {
      await createTool.mutateAsync({ hub_id: selectedHubId, ...toolForm });
    }
    setToolDialogOpen(false);
  };

  const handleToggleHubActive = async (hub: DiagnosticHub) => {
    await updateHub.mutateAsync({ id: hub.id, ativo: !hub.ativo });
  };

  const handleToggleToolActive = async (tool: DiagnosticTool) => {
    await updateTool.mutateAsync({ id: tool.id, ativo: !tool.ativo });
  };

  const openDeleteDialog = (type: 'hub' | 'tool', id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'hub') {
      await deleteHub.mutateAsync(deleteTarget.id);
    } else {
      await deleteTool.mutateAsync(deleteTarget.id);
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const getToolsForHub = (hubId: string) => {
    return allTools?.filter(t => t.hub_id === hubId) || [];
  };

  if (hubsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configurar Diagnóstico</h1>
          <p className="text-muted-foreground">Gerencie os hubs e ferramentas do diagnóstico de e-commerce</p>
        </div>
        <Button onClick={() => openHubDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Hub
        </Button>
      </div>

      <div className="space-y-4">
        {hubs?.map(hub => {
          const IconComponent = getIconComponent(hub.icon);
          const isExpanded = expandedHubs.includes(hub.id);
          const tools = getToolsForHub(hub.id);

          return (
            <Card key={hub.id} className={!hub.ativo ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => toggleHub(hub.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{hub.name}</CardTitle>
                    <Badge variant="secondary">{tools.length} ferramentas</Badge>
                    {!hub.ativo && <Badge variant="outline">Inativo</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={hub.ativo} 
                      onCheckedChange={() => handleToggleHubActive(hub)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openHubDialog(hub)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog('hub', hub.id, hub.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-sm text-muted-foreground">Ferramentas</h4>
                      <Button variant="outline" size="sm" onClick={() => openToolDialog(hub.id)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    
                    {tools.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma ferramenta cadastrada
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {tools.map(tool => {
                          const importanceStyle = IMPORTANCE_OPTIONS.find(i => i.value === tool.importance)?.color;
                          
                          return (
                            <div 
                              key={tool.id} 
                              className={`flex items-center justify-between p-3 rounded-lg border ${!tool.ativo ? 'opacity-60 bg-muted/50' : 'bg-background'}`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{tool.name}</span>
                                  <Badge className={importanceStyle}>{tool.importance}</Badge>
                                  {!tool.ativo && <Badge variant="outline">Inativo</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Switch 
                                  checked={tool.ativo} 
                                  onCheckedChange={() => handleToggleToolActive(tool)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => openToolDialog(hub.id, tool)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => openDeleteDialog('tool', tool.id, tool.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Dialog para Hub */}
      <Dialog open={hubDialogOpen} onOpenChange={setHubDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHub ? 'Editar Hub' : 'Novo Hub'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hub-name">Nome do Hub</Label>
              <Input 
                id="hub-name"
                value={hubForm.name}
                onChange={(e) => setHubForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Marketing e Tráfego"
              />
            </div>
            <div className="space-y-2">
              <Label>Ícone</Label>
              <Select 
                value={hubForm.icon} 
                onValueChange={(value) => setHubForm(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map(option => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHubDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveHub} disabled={!hubForm.name.trim()}>
              {editingHub ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Ferramenta */}
      <Dialog open={toolDialogOpen} onOpenChange={setToolDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTool ? 'Editar Ferramenta' : 'Nova Ferramenta'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tool-name">Nome da Ferramenta</Label>
              <Input 
                id="tool-name"
                value={toolForm.name}
                onChange={(e) => setToolForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Google Analytics 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tool-description">Descrição</Label>
              <Textarea 
                id="tool-description"
                value={toolForm.description}
                onChange={(e) => setToolForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva a ferramenta..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Importância</Label>
              <Select 
                value={toolForm.importance} 
                onValueChange={(value) => setToolForm(prev => ({ ...prev, importance: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMPORTANCE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <Badge className={option.color}>{option.value}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToolDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleSaveTool} 
              disabled={!toolForm.name.trim() || !toolForm.description.trim()}
            >
              {editingTool ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteTarget?.name}"? 
              {deleteTarget?.type === 'hub' && ' Todas as ferramentas deste hub também serão excluídas.'}
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiagnosticConfig;
