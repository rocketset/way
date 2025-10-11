// Página de curadoria para gestores de conteúdo e administradores
// Permite validar e gerenciar posts, cases, notificações pendentes

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  X, 
  Eye, 
  FileText, 
  Briefcase, 
  Bell,
  Loader2,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PendingPost {
  id: string;
  titulo: string;
  excerpt: string;
  autor_id: string;
  criado_em: string;
  moderation_status: string;
  profiles?: {
    nome: string;
    avatar_url: string;
  };
}

interface PendingCase {
  id: string;
  titulo: string;
  descricao: string;
  criado_em: string;
  moderation_status: string;
  imagem_url: string;
}

interface PendingNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  user_id: string;
}

export default function Curation() {
  const { user, isAdmin, isGestorConteudo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([]);
  const [pendingNotifications, setPendingNotifications] = useState<PendingNotification[]>([]);
  
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; title: string } | null>(null);

  // Verifica permissões
  useEffect(() => {
    if (!isAdmin && !isGestorConteudo) {
      toast.error('Você não tem permissão para acessar esta página');
      window.location.href = '/admin';
    }
  }, [isAdmin, isGestorConteudo]);

  // Carrega dados pendentes
  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      // Busca posts pendentes
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          titulo,
          excerpt,
          autor_id,
          criado_em,
          moderation_status,
          profiles:autor_id (nome, avatar_url)
        `)
        .eq('moderation_status', 'pending')
        .order('criado_em', { ascending: false });

      if (postsError) throw postsError;
      setPendingPosts(posts || []);

      // Busca cases pendentes
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('id, titulo, descricao, criado_em, moderation_status, imagem_url')
        .eq('moderation_status', 'pending')
        .order('criado_em', { ascending: false });

      if (casesError) throw casesError;
      setPendingCases(cases || []);

      // Busca notificações para revisão (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('id, title, message, type, created_at, user_id')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationsError) throw notificationsError;
      setPendingNotifications(notifications || []);

    } catch (error: any) {
      toast.error('Erro ao carregar itens pendentes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Aprovar post
  const approvePost = async (postId: string) => {
    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          moderation_status: 'approved',
          moderated_by: user?.id,
          moderated_at: new Date().toISOString(),
          publicado: true,
          status: 'published'
        })
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post aprovado com sucesso!');
      await fetchPendingItems();
    } catch (error: any) {
      toast.error('Erro ao aprovar post: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Rejeitar post
  const rejectPost = async (postId: string) => {
    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          moderation_status: 'rejected',
          moderated_by: user?.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post rejeitado');
      await fetchPendingItems();
    } catch (error: any) {
      toast.error('Erro ao rejeitar post: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Aprovar case
  const approveCase = async (caseId: string) => {
    setActionLoading(caseId);
    try {
      const { error } = await supabase
        .from('cases')
        .update({
          moderation_status: 'approved',
          moderated_by: user?.id,
          moderated_at: new Date().toISOString(),
          publicado: true
        })
        .eq('id', caseId);

      if (error) throw error;

      toast.success('Case aprovado com sucesso!');
      await fetchPendingItems();
    } catch (error: any) {
      toast.error('Erro ao aprovar case: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Rejeitar case
  const rejectCase = async (caseId: string) => {
    setActionLoading(caseId);
    try {
      const { error } = await supabase
        .from('cases')
        .update({
          moderation_status: 'rejected',
          moderated_by: user?.id,
          moderated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

      toast.success('Case rejeitado');
      await fetchPendingItems();
    } catch (error: any) {
      toast.error('Erro ao rejeitar case: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Deletar notificação
  const deleteNotification = async () => {
    if (!deleteTarget) return;
    
    setActionLoading(deleteTarget.id);
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;

      toast.success('Notificação excluída');
      await fetchPendingItems();
    } catch (error: any) {
      toast.error('Erro ao excluir notificação: ' + error.message);
    } finally {
      setActionLoading(null);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalPending = pendingPosts.length + pendingCases.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">MODERAÇÃO E CURADORIA</p>
        <h1 className="text-3xl font-bold">Curadoria de Conteúdo</h1>
        <p className="text-muted-foreground mt-2">
          {totalPending} {totalPending === 1 ? 'item pendente' : 'itens pendentes'} de aprovação
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPosts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cases Pendentes</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCases.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações (30d)</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingNotifications.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            Posts ({pendingPosts.length})
          </TabsTrigger>
          <TabsTrigger value="cases" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Cases ({pendingCases.length})
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações ({pendingNotifications.length})
          </TabsTrigger>
        </TabsList>

        {/* Posts Pendentes */}
        <TabsContent value="posts" className="space-y-4">
          {pendingPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Nenhum post pendente de aprovação</p>
              </CardContent>
            </Card>
          ) : (
            pendingPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{post.titulo}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt || 'Sem descrição'}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.profiles?.nome || 'Autor desconhecido'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDistanceToNow(new Date(post.criado_em), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      Pendente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(`/blog/preview/${post.id}`, '_blank')}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button
                      onClick={() => approvePost(post.id)}
                      disabled={actionLoading === post.id}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      {actionLoading === post.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => rejectPost(post.id)}
                      disabled={actionLoading === post.id}
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Cases Pendentes */}
        <TabsContent value="cases" className="space-y-4">
          {pendingCases.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Nenhum case pendente de aprovação</p>
              </CardContent>
            </Card>
          ) : (
            pendingCases.map((caseItem) => (
              <Card key={caseItem.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{caseItem.titulo}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {caseItem.descricao}
                      </CardDescription>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground pt-2">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(caseItem.criado_em), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      Pendente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(`/cases/${caseItem.id}`, '_blank')}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button
                      onClick={() => approveCase(caseItem.id)}
                      disabled={actionLoading === caseItem.id}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      {actionLoading === caseItem.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => rejectCase(caseItem.id)}
                      disabled={actionLoading === caseItem.id}
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          {pendingNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Nenhuma notificação recente</p>
              </CardContent>
            </Card>
          ) : (
            pendingNotifications.map((notification) => (
              <Card key={notification.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {notification.message}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <Badge variant="secondary">{notification.type}</Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDistanceToNow(new Date(notification.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setDeleteTarget({
                      type: 'notification',
                      id: notification.id,
                      title: notification.title
                    })}
                    disabled={actionLoading === notification.id}
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Excluir
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteTarget?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteNotification}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
