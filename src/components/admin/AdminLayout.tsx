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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Definição dos itens do menu lateral
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { 
    icon: FileText, 
    label: 'Blog', 
    path: '/admin/blog/posts',
    subItems: [
      { label: 'Posts', path: '/admin/blog/posts' },
      { label: 'Categorias', path: '/admin/blog/categories' },
      { label: 'Tags', path: '/admin/blog/tags' },
    ]
  },
  { 
    icon: Briefcase, 
    label: 'Cases', 
    path: '/admin/cases/list',
    subItems: [
      { label: 'Lista', path: '/admin/cases/list' },
      { label: 'Categorias', path: '/admin/cases/categories' },
      { label: 'Tags', path: '/admin/cases/tags' },
    ]
  },
  { icon: Mail, label: 'Solicitações', path: '/admin/contacts' },
  { icon: Users, label: 'Usuários', path: '/admin/users' },
];

// Componente da Sidebar com hover expand
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

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
      onMouseLeave={() => setIsExpanded(false)}
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

      {/* Menu de Navegação */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
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
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

          {/* Menu */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
        {/* Header Mobile */}
        <header className="md:hidden flex items-center gap-4 border-b p-4 bg-card">
          <MobileSidebar />
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </header>

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
