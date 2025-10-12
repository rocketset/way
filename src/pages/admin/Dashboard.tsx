// Página inicial do painel administrativo
// Exibe estatísticas e resumo do sistema

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Briefcase, Mail, Users, BookOpen, UserCheck, Activity } from 'lucide-react';

export default function Dashboard() {
  // Estados para armazenar as contagens
  const [stats, setStats] = useState({
    posts: 0,
    cases: 0,
    contacts: 0,
    users: 0,
    academyContents: 0,
    adminUsers: 0,
    gestorUsers: 0,
    colunistaUsers: 0,
    membroUsers: 0,
    totalActivities: 0,
  });
  const [loading, setLoading] = useState(true);

  // Busca as estatísticas ao carregar a página
  useEffect(() => {
    fetchStats();
  }, []);

  // Função para buscar estatísticas do banco de dados
  const fetchStats = async () => {
    try {
      // Busca contagem de posts
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      // Busca contagem de cases
      const { count: casesCount } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true });

      // Busca contagem de contatos
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      // Busca contagem de usuários
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Busca contagem de conteúdos da Academy
      const { count: academyCount } = await supabase
        .from('academy_content')
        .select('*', { count: 'exact', head: true });

      // Busca contagem de usuários por role
      const { count: adminCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'administrador');

      const { count: gestorCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'gestor_conteudo');

      const { count: colunistaCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'colunista');

      const { count: membroCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'membro');

      // Busca total de atividades
      const { count: activitiesCount } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact', head: true });

      // Atualiza o estado com as contagens
      setStats({
        posts: postsCount || 0,
        cases: casesCount || 0,
        contacts: contactsCount || 0,
        users: usersCount || 0,
        academyContents: academyCount || 0,
        adminUsers: adminCount || 0,
        gestorUsers: gestorCount || 0,
        colunistaUsers: colunistaCount || 0,
        membroUsers: membroCount || 0,
        totalActivities: activitiesCount || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cards com as estatísticas
  const statCards = [
    {
      title: 'Posts do Blog',
      value: stats.posts,
      icon: FileText,
      description: 'Total de posts publicados',
    },
    {
      title: 'Cases',
      value: stats.cases,
      icon: Briefcase,
      description: 'Cases cadastrados',
    },
    {
      title: 'Contatos',
      value: stats.contacts,
      icon: Mail,
      description: 'Solicitações recebidas',
    },
    {
      title: 'Usuários',
      value: stats.users,
      icon: Users,
      description: 'Usuários cadastrados',
    },
    {
      title: 'Conteúdos Academy',
      value: stats.academyContents,
      icon: BookOpen,
      description: 'Materiais na Way Academy',
    },
    {
      title: 'Total de Atividades',
      value: stats.totalActivities,
      icon: Activity,
      description: 'Acessos na plataforma',
    },
  ];

  const userRoleCards = [
    {
      title: 'Administradores',
      value: stats.adminUsers,
      icon: UserCheck,
      description: 'Acesso total',
    },
    {
      title: 'Gestores de Conteúdo',
      value: stats.gestorUsers,
      icon: UserCheck,
      description: 'Gerenciam conteúdo',
    },
    {
      title: 'Colunistas',
      value: stats.colunistaUsers,
      icon: UserCheck,
      description: 'Criam posts',
    },
    {
      title: 'Membros',
      value: stats.membroUsers,
      icon: UserCheck,
      description: 'Acessam conteúdos',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título da Página */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do sistema administrativo
        </p>
      </div>

      {/* Grid de Cards com Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grid de Cards de Usuários por Role */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Usuários por Tipo</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userRoleCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            Use o menu lateral para navegar entre as diferentes seções do sistema.
            Você pode gerenciar posts do blog, cases, solicitações de contato e usuários.
          </p>
          <ul className="mt-4 space-y-2">
            <li><strong>Blog:</strong> Gerencie posts, categorias e tags do blog</li>
            <li><strong>Cases:</strong> Cadastre e edite cases de sucesso</li>
            <li><strong>Contatos:</strong> Visualize solicitações enviadas pelo formulário</li>
            <li><strong>Usuários:</strong> Gerencie usuários do sistema</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
