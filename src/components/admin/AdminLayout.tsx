// Layout principal do painel administrativo
// Inclui sidebar de navegação com hover para expandir e submenus colapsáveis

import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
import logoWay from '@/assets/logo-way.png';

// Definição dos itens do menu lateral com permissões
const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/admin',
    roles: ['administrador', 'gestor_conteudo', 'colunista', 'membro']
  },
  { 
    icon: GraduationCap, 
    label: 'Way Academy', 
    path: '/admin/academy',
    roles: ['administrador', 'gestor_conteudo', 'membro']
  },
  { 
    icon: FileText, 
    label: 'Blog', 
    path: '/admin/blog/posts',
    roles: ['administrador', 'gestor_conteudo', 'colunista'],
    subItems: [
      { label: 'Posts', path: '/admin/blog/posts' },
      { label: 'Categorias', path: '/admin/blog/categories' },
      { label: 'Tags', path: '/admin/blog/tags' },
      { label: 'Colunistas', path: '/admin/blog/columnists' },
    ]
  },
  { 
    icon: Briefcase, 
    label: 'Cases', 
    path: '/admin/cases/list',
    roles: ['administrador', 'gestor_conteudo'],
    subItems: [
      { label: 'Lista', path: '/admin/cases/list' },
      { label: 'Categorias', path: '/admin/cases/categories' },
      { label: 'Tags', path: '/admin/cases/tags' },
    ]
  },
  { icon: ImageIcon, label: 'Mídia', path: '/admin/media', roles: ['administrador', 'gestor_conteudo', 'colunista'] },
  { icon: Mail, label: 'Solicitações', path: '/admin/contacts', roles: ['administrador'] },
  { icon: Users, label: 'Usuários', path: '/admin/users', roles: ['administrador'] },
  { icon: HeadphonesIcon, label: 'Atendimento', path: '/admin/support', roles: ['administrador', 'gestor_conteudo', 'colunista', 'membro'] },
];

// Componente da Sidebar com hover expand
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut, user, isAdmin, viewMode, setViewMode, effectiveRole, userRole } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);

  // Função para renderizar ícone do perfil
  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'administrador':
        return <Shield className="h-4 w-4" />;
      case 'colunista':
        return <PenTool className="h-4 w-4" />;
      case 'membro':
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
      onMouseLeave={() => { if (!isRoleSelectOpen) setIsExpanded(false); }}
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
          {menuItems.filter(item => item.roles.includes(effectiveRole || 'membro')).map((item) => {
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
                        {item.subItems.map((subItem) => {
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
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Informações do usuário e Logout */}
      <div className="p-3 border-t space-y-2">
        {isExpanded && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            {user?.email}
          </div>
        )}
        <Button
          variant="outline"
          className={cn(
            "w-full transition-all",
            isExpanded ? "justify-start" : "justify-center px-0"
          )}
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isExpanded && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  );
}

// Sidebar Mobile (usa o componente completo dentro de um Sheet)
function MobileSidebar() {
  const { signOut, user, isAdmin, viewMode, setViewMode, effectiveRole } = useAuth();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);

  // Função para renderizar ícone do perfil
  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'administrador':
        return <Shield className="h-4 w-4" />;
      case 'colunista':
        return <PenTool className="h-4 w-4" />;
      case 'membro':
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
                            {item.subItems.map((subItem) => {
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
  const { user, loading, viewMode, setViewMode, signOut } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Protege as rotas - redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

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
        <header className="flex items-center gap-4 border-b px-6 py-3 bg-card">
          {/* Menu Mobile */}
          <div className="md:hidden">
            <MobileSidebar />
          </div>

          {/* Logo Way */}
          <div className="flex items-center gap-3">
            <img 
              src={logoWay} 
              alt="Way+ E-commerce" 
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate('/admin')}
            />
          </div>

          {/* Barra de Pesquisa */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-none"
              />
            </div>
          </div>
          
          {/* Ações do Header - Notificações e Conta */}
          <div className="flex items-center gap-3">
            {/* Sino de Notificações */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                setNotificationCount(0);
                navigate('/admin/academy');
              }}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Dropdown da Conta do Usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="Usuário" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
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
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
