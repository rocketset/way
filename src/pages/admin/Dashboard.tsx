// Página inicial do painel administrativo
// Exibe estatísticas e resumo do sistema

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Briefcase, Mail, Users, BookOpen, UserCheck, Activity, FolderOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface CategoryStats {
  id: string;
  nome: string;
  postCount: number;
}

interface ColumnistPost {
  id: string;
  titulo: string;
  excerpt: string | null;
  status: string;
  publicado: boolean;
  criado_em: string;
  categories: { nome: string }[];
}

export default function Dashboard() {
  const { user, userRole } = useAuth();
  
  // Estados para armazenar as contagens
  const [stats, setStats] = useState({
    posts: 0,
    cases: 0,
    contacts: 0,
    users: 0,
    academyContents: 0,
    academyCategories: 0,
    adminUsers: 0,
    gestorUsers: 0,
    colunistaUsers: 0,
    membroUsers: 0,
    clienteUsers: 0,
    totalActivities: 0,
  });
  
  // Estados específicos para colunista
  const [columnistStats, setColumnistStats] = useState({
    totalCategories: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [recentPosts, setRecentPosts] = useState<ColumnistPost[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Busca as estatísticas ao carregar a página
  useEffect(() => {
    if (userRole === 'colunista' && user) {
      fetchColumnistStats();
    } else {
      fetchStats();
    }
  }, [userRole, user]);

  // Função para buscar estatísticas do colunista
  const fetchColumnistStats = async () => {
    if (!user) return;
    
    try {
      // Busca total de categorias disponíveis
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'blog');

      // Busca posts do colunista
      const { data: posts, count: postsCount } = await supabase
        .from('posts')
        .select('id, status, publicado', { count: 'exact' })
        .eq('autor_id', user.id);

      const publishedCount = posts?.filter(p => p.publicado || p.status === 'published').length || 0;
      const draftCount = posts?.filter(p => !p.publicado && p.status === 'draft').length || 0;

      // Busca posts com categorias
      const { data: postsWithCategories } = await supabase
        .from('posts')
        .select(`
          id,
          titulo,
          excerpt,
          status,
          publicado,
          criado_em,
          post_categories!inner(
            category:categories!inner(
              id,
              nome
            )
          )
        `)
        .eq('autor_id', user.id)
        .order('criado_em', { ascending: false })
        .limit(5);

      // Agrupa posts por categoria
      const categoriesMap = new Map<string, CategoryStats>();
      
      postsWithCategories?.forEach((post: any) => {
        post.post_categories.forEach((pc: any) => {
          const catId = pc.category.id;
          const catName = pc.category.nome;
          
          if (!categoriesMap.has(catId)) {
            categoriesMap.set(catId, { id: catId, nome: catName, postCount: 0 });
          }
          categoriesMap.get(catId)!.postCount++;
        });
      });

      // Busca posts recentes formatados
      const { data: recentPostsData } = await supabase
        .from('posts')
        .select(`
          id,
          titulo,
          excerpt,
          status,
          publicado,
          criado_em
        `)
        .eq('autor_id', user.id)
        .order('criado_em', { ascending: false })
        .limit(5);

      // Busca categorias para cada post
      const postsWithCats = await Promise.all(
        (recentPostsData || []).map(async (post) => {
          const { data: cats } = await supabase
            .from('post_categories')
            .select('category:categories(nome)')
            .eq('post_id', post.id);
          
          return {
            ...post,
            categories: cats?.map((c: any) => ({ nome: c.category.nome })) || []
          };
        })
      );

      setColumnistStats({
        totalCategories: categoriesCount || 0,
        totalPosts: postsCount || 0,
        publishedPosts: publishedCount,
        draftPosts: draftCount,
      });

      setCategoryStats(Array.from(categoriesMap.values()));
      setRecentPosts(postsWithCats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do colunista:', error);
    } finally {
      setLoading(false);
    }
  };

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

      // Busca contagem de categorias da Academy
      const { count: categoriesCount } = await supabase
        .from('academy_categories')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

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

      const { count: clienteCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'cliente');

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
        academyCategories: categoriesCount || 0,
        adminUsers: adminCount || 0,
        gestorUsers: gestorCount || 0,
        colunistaUsers: colunistaCount || 0,
        membroUsers: membroCount || 0,
        clienteUsers: clienteCount || 0,
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
      title: 'Listas/Categorias',
      value: stats.academyCategories,
      icon: BookOpen,
      description: 'Categorias ativas',
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
    {
      title: 'Clientes',
      value: stats.clienteUsers,
      icon: UserCheck,
      description: 'Acesso aos treinamentos',
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

  // Dashboard específico para colunista
  if (userRole === 'colunista') {
    return (
      <div className="space-y-6">
        {/* Título da Página */}
        <div>
          <h1 className="text-3xl font-bold">Meu Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Resumo da sua atividade como colunista
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Categorias Disponíveis
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{columnistStats.totalCategories}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Para você publicar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Posts
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{columnistStats.totalPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os seus posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Posts Publicados
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{columnistStats.publishedPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Visíveis no site
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Rascunhos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{columnistStats.draftPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Ainda não publicados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts por Categoria */}
        {categoryStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Seus Posts por Categoria</CardTitle>
              <CardDescription>
                Distribuição dos seus posts pelas diferentes categorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {categoryStats.map((cat) => (
                  <div 
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <span className="font-medium">{cat.nome}</span>
                    <Badge variant="secondary">{cat.postCount} {cat.postCount === 1 ? 'post' : 'posts'}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Seus Posts Recentes</CardTitle>
            <CardDescription>
              Últimos posts que você criou
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="flex flex-col gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.titulo}</h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <Badge variant={post.publicado || post.status === 'published' ? 'default' : 'secondary'}>
                        {post.publicado || post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.categories.map((cat, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cat.nome}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(post.criado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Você ainda não criou nenhum post
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard padrão para admin/gestor
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
