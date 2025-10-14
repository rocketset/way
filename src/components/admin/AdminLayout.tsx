// Layout principal do painel administrativo
// Inclui sidebar de navegação com hover para expandir e submenus colapsáveis

import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mail,
  Users,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Eye,
  UserCog,
  User as UserIcon,
  Shield,
  PenTool,
  GraduationCap,
  HeadphonesIcon,
  Bell,
  Search,
  CheckSquare,
  Heart,
  FolderOpen,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import logoWayLight from '@/assets/logo-way-light.png';
import logoWayDark from '@/assets/logo-way-dark.png';
import { ThemeSelector } from './ThemeSelector';

// Definição dos itens do menu lateral com permissões
const menuItems = [
  // Menu Principal
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/admin/member-dashboard',
    roles: ['membro', 'cliente'],
  },
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/admin',
    roles: ['administrador', 'gestor_conteudo', 'colunista']
  },
  { 
    icon: FileText, 
    label: 'Blog Way', 
    path: '/admin/blog-way',
    roles: ['administrador', 'gestor_conteudo', 'colunista', 'membro', 'cliente'],
  },
  { 
    icon: Heart, 
    label: 'Guia de Boas Práticas', 
    path: '/admin/conduct-guide',
    roles: ['administrador', 'gestor_conteudo', 'colunista', 'membro', 'cliente'],
  },
  
  // Separador 1 — Site Way
  { 
    separator: true,
    label: 'Site Way',
    roles: ['administrador', 'gestor_conteudo', 'colunista']
  },
  { 
    icon: Briefcase, 
    label: 'Gerenciar Cases', 
    path: '/admin/cases/list',
    roles: ['administrador', 'gestor_conteudo'],
    subItems: [
      { label: 'Lista', path: '/admin/cases/list' },
      { label: 'Categorias', path: '/admin/cases/categories' },
      { label: 'Tags', path: '/admin/cases/tags' },
    ]
  },
  { 
    icon: FileText, 
    label: 'Gerenciar Blog', 
    path: '/admin/blog/posts',
    roles: ['administrador', 'gestor_conteudo', 'colunista'],
    subItems: [
      { label: 'Posts', path: '/admin/blog/posts' },
      { label: 'Categorias', path: '/admin/blog/categories', roles: ['administrador', 'gestor_conteudo'] },
      { label: 'Tags', path: '/admin/blog/tags', roles: ['administrador', 'gestor_conteudo'] },
      { label: 'Colunistas', path: '/admin/blog/columnists', roles: ['administrador', 'gestor_conteudo'] },
    ]
  },

  // Separador 2 — Plataforma
  { 
    separator: true,
    label: 'Plataforma',
    roles: ['administrador', 'gestor_conteudo', 'membro', 'cliente']
  },
  { icon: CheckSquare, label: 'Curadoria', path: '/admin/curation', roles: ['administrador', 'gestor_conteudo'] },
  { 
    icon: FileText, 
    label: 'Landing Pages', 
    path: '/admin/landing',
    roles: ['administrador', 'gestor_conteudo'],
  },
  { icon: Mail, label: 'Solicitações', path: '/admin/contacts', roles: ['administrador'] },
  { 
    icon: GraduationCap, 
    label: 'Way Academy', 
    path: '/admin/academy',
    roles: ['administrador', 'gestor_conteudo', 'membro', 'cliente'],
    hasCategories: true,
    subItems: [
      { label: 'Conteúdos', path: '/admin/academy' },
      { label: 'Lista de Fornecedores', path: '/admin/academy/suppliers' },
      { label: 'Gerenciar Conteúdos', path: '/admin/academy/manage', roles: ['administrador', 'gestor_conteudo'] },
      { label: 'Gerenciar Categorias', path: '/admin/academy/categories', roles: ['administrador'] },
      { label: 'Configurações', path: '/admin/academy/settings', roles: ['administrador'] },
    ]
  },
  { 
    icon: Settings, 
    label: 'Configurações', 
    path: '/admin/google-reviews',
    roles: ['administrador'],
    subItems: [
      { label: 'Avaliações Google', path: '/admin/google-reviews' },
      { label: 'Mídia', path: '/admin/media' },
      { label: 'Permissões', path: '/admin/permissions' },
      { label: 'Usuários', path: '/admin/users' },
    ]
  },

  // Item final sem separador
  { icon: HeadphonesIcon, label: 'Atendimento', path: '/admin/support', roles: ['administrador', 'gestor_conteudo', 'colunista', 'membro', 'cliente'] },
];

// Componente da Sidebar com hover expand
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut, user, isAdmin, viewMode, setViewMode, effectiveRole, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [academyCategories, setAcademyCategories] = useState<Array<{ id: string; nome: string; contentCount?: number }>>([]);
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);

  // Busca categorias da Academy
  useEffect(() => {
    fetchAcademyCategories();
    
    // Configura realtime para atualizar automaticamente
    const channel = supabase
      .channel('academy-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'academy_categories'
        },
        () => {
          fetchAcademyCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAcademyCategories = async () => {
    const { data: categories } = await supabase
      .from('academy_categories')
      .select('id, nome')
      .eq('ativo', true)
      .order('ordem', { ascending: true });
    
    if (categories) {
      // Busca a contagem de conteúdos para cada categoria
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from('academy_content')
            .select('*', { count: 'exact', head: true })
            .eq('categoria_id', category.id)
            .eq('publicado', true);
          
          return {
            ...category,
            contentCount: count || 0
          };
        })
      );
      
      setAcademyCategories(categoriesWithCount);
    }
  };

  // Função para renderizar ícone do perfil
  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'administrador':
        return <Shield className="h-4 w-4" />;
      case 'colunista':
        return <PenTool className="h-4 w-4" />;
      case 'membro':
        return <UserIcon className="h-4 w-4" />;
      case 'cliente':
        return <UserIcon className="h-4 w-4" />;
      case 'gestor_conteudo':
        return <UserCog className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  // Função para renderizar label do perfil
  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'colunista':
        return 'Colunista';
      case 'membro':
        return 'Membro';
      case 'cliente':
        return 'Cliente';
      case 'gestor_conteudo':
        return 'Gestor de Conteúdo';
      default:
        return 'Visão Real';
    }
  };

  // Alterna submenu aberto/fechado
  const toggleSubmenu = (path: string) => {
    setOpenSubmenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  // Verifica se item está ativo
  const isItemActive = (item: typeof menuItems[0]) => {
    if (item.separator) return false;
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path);
    }
    return location.pathname === item.path;
  };

  return (
    <div 
      className={cn(
        "flex h-full flex-col bg-card border-r transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => { 
        if (!isRoleSelectOpen && !isCategorySelectOpen) {
          setIsExpanded(false);
        }
      }}
    >
      {/* Header da Sidebar */}
      <div className="p-4 border-b h-16 flex items-center justify-center">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">W</span>
        </div>
        {isExpanded && (
          <div className="ml-3 overflow-hidden">
            <h2 className="text-lg font-bold whitespace-nowrap">Admin</h2>
          </div>
        )}
      </div>

      {/* Seletor de Visualização - Apenas para Admin */}
      {isAdmin && (
        <div className="p-3 border-b bg-muted/30">
          {isExpanded ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground px-1">
                <Eye className="h-3.5 w-3.5" />
                <span>Visualizar como:</span>
              </div>
              <Select
                open={isRoleSelectOpen}
                onOpenChange={setIsRoleSelectOpen}
                value={viewMode || 'real'}
                onValueChange={(value) => setViewMode(value === 'real' ? null : value as any)}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-[100] pointer-events-auto">
                  <SelectItem value="real">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(null)}
                      <span>Visão Real (Admin)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="colunista">
                    <div className="flex items-center gap-2">
                      {getRoleIcon('colunista')}
                      <span>Colunista</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="membro">
                    <div className="flex items-center gap-2">
                      {getRoleIcon('membro')}
                      <span>Membro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cliente">
                    <div className="flex items-center gap-2">
                      {getRoleIcon('cliente')}
                      <span>Cliente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gestor_conteudo">
                    <div className="flex items-center gap-2">
                      {getRoleIcon('gestor_conteudo')}
                      <span>Gestor de Conteúdo</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {viewMode && (
                <p className="text-xs text-muted-foreground px-1">
                  Simulando visão de {getRoleLabel(viewMode).toLowerCase()}
                </p>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-full relative group"
              onClick={() => setIsExpanded(true)}
            >
              {getRoleIcon(viewMode)}
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-xs">
                {viewMode ? `Visualizando: ${getRoleLabel(viewMode)}` : 'Visualizar como...'}
              </div>
            </Button>
          )}
        </div>
      )}

      {/* Menu de Navegação */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.filter(item => item.roles.includes(effectiveRole || 'membro')).map((item, index) => {
            // Renderiza separadores
            if (item.separator) {
              return (
                <div key={`separator-${index}`} className="pt-4 pb-2">
                  {isExpanded ? (
                    <div className="px-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {item.label}
                      </div>
                      <div className="h-px bg-border" />
                    </div>
                  ) : (
                    <div className="h-px bg-border mx-3" />
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = isItemActive(item);
            const hasSubmenu = !!item.subItems;
            const isSubmenuOpen = openSubmenus.includes(item.path);

            return (
              <div key={item.path}>
                {/* Link principal do menu */}
                {!hasSubmenu ? (
                  <Link
                    to={item.path}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent group relative',
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {isExpanded && (
                      <span className="whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    )}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                ) : (
                  <>
                    {/* Item com submenu */}
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          toggleSubmenu(item.path);
                        }
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent group relative',
                        isActive && 'bg-accent text-accent-foreground font-medium'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {isExpanded && (
                        <>
                          <span className="whitespace-nowrap overflow-hidden flex-1 text-left">
                            {item.label}
                          </span>
                          {isSubmenuOpen ? (
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 flex-shrink-0" />
                          )}
                        </>
                      )}
                      {!isExpanded && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </button>

                    {/* Subitens - só mostra quando expandido e aberto */}
                    {isExpanded && isSubmenuOpen && item.subItems && (
                      <div className="ml-8 mt-1 space-y-1 border-l-2 border-border pl-3">
                        {item.subItems
                          .filter(subItem => !subItem.roles || subItem.roles.includes(effectiveRole || 'membro'))
                          .map((subItem) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                onClick={onNavigate}
                                className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                                  isSubActive && 'bg-accent text-accent-foreground font-medium'
                                )}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        
                        {/* Categorias da Academy - caixa de seleção */}
                        {item.hasCategories && academyCategories.length > 0 && (
                          <div className="pt-2">
                            <Select
                              open={isCategorySelectOpen}
                              onOpenChange={setIsCategorySelectOpen}
                              onValueChange={(categoryId) => {
                                navigate(`/admin/academy?category=${categoryId}`);
                                setIsCategorySelectOpen(false);
                                onNavigate?.();
                              }}
                            >
                              <SelectTrigger className="w-full bg-background">
                                <div className="flex items-center gap-2">
                                  <FolderOpen className="h-4 w-4" />
                                  <SelectValue placeholder="Selecionar categoria" />
                                </div>
                              </SelectTrigger>
                              <SelectContent className="bg-popover border shadow-md z-[100]">
                                {academyCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    <div className="flex items-center justify-between w-full gap-4">
                                      <span>{category.nome}</span>
                                      {category.contentCount !== undefined && (
                                        <span className="text-xs text-muted-foreground">
                                          ({category.contentCount})
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Informações do usuário */}
      <div className="p-3 border-t">
        {isExpanded && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            {user?.email}
          </div>
        )}
      </div>
    </div>
  );
}

// Sidebar Mobile (usa o componente completo dentro de um Sheet)
function MobileSidebar() {
  const { signOut, user, isAdmin, viewMode, setViewMode, effectiveRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [academyCategories, setAcademyCategories] = useState<Array<{ id: string; nome: string; contentCount?: number }>>([]);
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);

  // Busca categorias da Academy
  useEffect(() => {
    fetchAcademyCategories();
    
    // Configura realtime para atualizar automaticamente
    const channel = supabase
      .channel('academy-categories-changes-mobile')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'academy_categories'
        },
        () => {
          fetchAcademyCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAcademyCategories = async () => {
    const { data: categories } = await supabase
      .from('academy_categories')
      .select('id, nome')
      .eq('ativo', true)
      .order('ordem', { ascending: true });
    
    if (categories) {
      // Busca a contagem de conteúdos para cada categoria
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from('academy_content')
            .select('*', { count: 'exact', head: true })
            .eq('categoria_id', category.id)
            .eq('publicado', true);
          
          return {
            ...category,
            contentCount: count || 0
          };
        })
      );
      
      setAcademyCategories(categoriesWithCount);
    }
  };

  // Função para renderizar ícone do perfil
  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'administrador':
        return <Shield className="h-4 w-4" />;
      case 'colunista':
        return <PenTool className="h-4 w-4" />;
      case 'membro':
        return <UserIcon className="h-4 w-4" />;
      case 'cliente':
        return <UserIcon className="h-4 w-4" />;
      case 'gestor_conteudo':
        return <UserCog className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  // Função para renderizar label do perfil
  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'colunista':
        return 'Colunista';
      case 'membro':
        return 'Membro';
      case 'cliente':
        return 'Cliente';
      case 'gestor_conteudo':
        return 'Gestor de Conteúdo';
      default:
        return 'Visão Real';
    }
  };

  const toggleSubmenu = (path: string) => {
    setOpenSubmenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const isItemActive = (item: typeof menuItems[0]) => {
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path);
    }
    return location.pathname === item.path;
  };

  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex h-full flex-col bg-card">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {user?.email}
            </p>
          </div>

          {/* Seletor de Visualização - Apenas para Admin */}
          {isAdmin && (
            <div className="p-4 border-b bg-muted/30">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Visualizar como:</span>
                </div>
                <Select
                  open={isRoleSelectOpen}
                  onOpenChange={setIsRoleSelectOpen}
                  value={viewMode || 'real'}
                  onValueChange={(value) => setViewMode(value === 'real' ? null : value as any)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-[100] pointer-events-auto">
                    <SelectItem value="real">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(null)}
                        <span>Visão Real (Admin)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="colunista">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('colunista')}
                        <span>Colunista</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="membro">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('membro')}
                        <span>Membro</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cliente">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('cliente')}
                        <span>Cliente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gestor_conteudo">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('gestor_conteudo')}
                        <span>Gestor de Conteúdo</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {viewMode && (
                  <p className="text-xs text-muted-foreground">
                    Simulando visão de {getRoleLabel(viewMode).toLowerCase()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Menu */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {menuItems.filter(item => item.roles.includes(effectiveRole || 'membro')).map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item);
                const hasSubmenu = !!item.subItems;
                const isSubmenuOpen = openSubmenus.includes(item.path);

                return (
                  <div key={item.path}>
                    {!hasSubmenu ? (
                      <Link
                        to={item.path}
                        onClick={handleNavigation}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent',
                          isActive && 'bg-accent text-accent-foreground font-medium'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleSubmenu(item.path)}
                          className={cn(
                            'w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent',
                            isActive && 'bg-accent text-accent-foreground font-medium'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {isSubmenuOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>

                        {isSubmenuOpen && item.subItems && (
                          <div className="ml-8 mt-1 space-y-1 border-l-2 border-border pl-3">
                            {item.subItems
                              .filter(subItem => !subItem.roles || subItem.roles.includes(effectiveRole || 'membro'))
                              .map((subItem) => {
                                const isSubActive = location.pathname === subItem.path;
                                return (
                                  <Link
                                    key={subItem.path}
                                    to={subItem.path}
                                    onClick={handleNavigation}
                                    className={cn(
                                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                                      isSubActive && 'bg-accent text-accent-foreground font-medium'
                                    )}
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {subItem.label}
                                  </Link>
                                );
                              })}
                            
                            {/* Categorias da Academy - caixa de seleção mobile */}
                            {item.hasCategories && academyCategories.length > 0 && (
                              <div className="pt-2">
                                <Select
                                  open={isCategorySelectOpen}
                                  onOpenChange={setIsCategorySelectOpen}
                                  onValueChange={(categoryId) => {
                                    navigate(`/admin/academy?category=${categoryId}`);
                                    setIsCategorySelectOpen(false);
                                    handleNavigation();
                                  }}
                                >
                                  <SelectTrigger className="w-full bg-background">
                                    <div className="flex items-center gap-2">
                                      <FolderOpen className="h-4 w-4" />
                                      <SelectValue placeholder="Selecionar categoria" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover border shadow-md z-[100]">
                                    {academyCategories.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        <div className="flex items-center justify-between w-full gap-4">
                                          <span>{category.nome}</span>
                                          {category.contentCount !== undefined && (
                                            <span className="text-xs text-muted-foreground">
                                              ({category.contentCount})
                                            </span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Botão de Logout */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Layout principal que envolve todas as páginas admin
export default function AdminLayout() {
  const { user, loading, viewMode, setViewMode, signOut, isMembro, effectiveRole } = useAuth();
  const { actualTheme } = useTheme();
  const logoWay = actualTheme === 'dark' ? logoWayDark : logoWayLight;
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState<{ nome: string; avatar_url: string } | null>(null);

  // Busca dados do perfil do usuário
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('nome, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfileData(data);
      }
    };

    fetchProfile();
  }, [user]);

  // Protege as rotas - redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  // Redireciona membros e clientes para sua dashboard específica
  useEffect(() => {
    if (!loading && user && (effectiveRole === 'membro' || effectiveRole === 'cliente') && location.pathname === '/admin') {
      navigate('/admin/member-dashboard', { replace: true });
    }
  }, [effectiveRole, loading, user, location.pathname, navigate]);

  // Exibe loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderiza nada se não estiver autenticado
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Desktop - hover para expandir */}
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Desktop e Mobile */}
        <header className="flex items-center justify-between gap-4 border-b px-6 py-3 bg-card">
          {/* Logo Way - Lado Esquerdo */}
          <div className="flex items-center gap-4">
            {/* Menu Mobile */}
            <div className="md:hidden">
              <MobileSidebar />
            </div>
            
            <div className="flex items-center gap-3">
              <img 
                src={logoWay} 
                alt="Way+ E-commerce" 
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate('/admin')}
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs text-muted-foreground leading-none">Versão 1.0</span>
              </div>
            </div>
          </div>

          {/* Barra de Pesquisa e Ações - Lado Direito */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Barra de Pesquisa - Responsiva */}
            <div className="relative w-24 sm:w-40 md:w-56 lg:w-64">
              <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 h-3.5 md:h-4 w-3.5 md:w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 md:pl-10 pr-2 bg-muted/50 border-none h-8 md:h-9 text-sm placeholder:text-xs md:placeholder:text-sm"
              />
            </div>
            
            {/* Seletor de Tema - Oculto no mobile pequeno */}
            <div className="hidden sm:block">
              <ThemeSelector />
            </div>
            
            {/* Sino de Notificações */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 md:h-10 md:w-10"
              onClick={() => {
                navigate('/admin/notifications');
              }}
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-[10px] md:text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Dropdown da Conta do Usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full p-0">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage src={profileData?.avatar_url || ''} alt={profileData?.nome || 'Usuário'} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-sm">
                      {profileData?.nome?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuItem onClick={() => navigate('/admin/account')} className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Minha conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Banner de Modo de Visualização */}
        {viewMode && (
          <div className="bg-orange-100 dark:bg-orange-950 border-b border-orange-200 dark:border-orange-900 px-6 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-orange-700 dark:text-orange-300" />
              <span className="font-medium text-orange-900 dark:text-orange-100">
                Modo de Visualização Ativo:
              </span>
              <span className="text-orange-700 dark:text-orange-300">
                Você está visualizando como{' '}
                <strong>
                  {viewMode === 'administrador' && 'Administrador'}
                  {viewMode === 'colunista' && 'Colunista'}
                  {viewMode === 'membro' && 'Membro'}
                  {viewMode === 'cliente' && 'Cliente'}
                  {viewMode === 'gestor_conteudo' && 'Gestor de Conteúdo'}
                </strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto text-xs h-7"
                onClick={() => setViewMode(null)}
              >
                Voltar à Visão Real
              </Button>
            </div>
          </div>
        )}

        {/* Área de Conteúdo - renderiza as páginas filhas */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 container mx-auto p-6">
            <Outlet />
          </div>
          
          {/* Rodapé */}
          <footer className="border-t py-4 px-6 bg-card mt-auto">
            <div className="container mx-auto">
              <p className="text-sm text-muted-foreground text-center">
                © 2025 Way E-commerce | CNPJ 27.195.145/0001-41 — Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
