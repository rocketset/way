// Layout principal do painel administrativo
// Inclui sidebar de navegação e área de conteúdo

import { useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Folder,
  Tag,
  Briefcase,
  Mail,
  Users,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

// Definição dos itens do menu lateral
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { 
    icon: FileText, 
    label: 'Blog', 
    path: '/admin/blog',
    subItems: [
      { label: 'Posts', path: '/admin/blog/posts' },
      { label: 'Categorias', path: '/admin/blog/categories' },
      { label: 'Tags', path: '/admin/blog/tags' },
    ]
  },
  { 
    icon: Briefcase, 
    label: 'Cases', 
    path: '/admin/cases',
    subItems: [
      { label: 'Lista', path: '/admin/cases/list' },
      { label: 'Categorias', path: '/admin/cases/categories' },
      { label: 'Tags', path: '/admin/cases/tags' },
    ]
  },
  { icon: Mail, label: 'Solicitações de Contato', path: '/admin/contacts' },
  { icon: Users, label: 'Usuários', path: '/admin/users' },
];

// Componente da Sidebar
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut, user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-card border-r">
      {/* Header da Sidebar */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {user?.email || 'Administrador'}
        </p>
      </div>

      {/* Menu de Navegação */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.subItems && item.subItems.some(sub => location.pathname === sub.path));

            return (
              <div key={item.path}>
                {/* Link principal do menu */}
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                    isActive && 'bg-accent text-accent-foreground font-medium'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>

                {/* Subitens do menu (se existirem) */}
                {item.subItems && (
                  <div className="ml-6 mt-1 space-y-1">
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
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
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
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}

// Layout principal que envolve todas as páginas admin
export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop - oculta em telas pequenas */}
      <aside className="hidden md:flex w-64 flex-col">
        <Sidebar />
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="md:hidden flex items-center gap-4 border-b p-4 bg-card">
          {/* Menu Mobile - usa Sheet (drawer) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar onNavigate={() => {}} />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </header>

        {/* Área de Conteúdo - renderiza as páginas filhas */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
