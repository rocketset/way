// Página de notificações do painel administrativo
// Exibe todas as atualizações e atividades recentes

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, FileText, Briefcase, User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Tipo de notificação
interface Notification {
  id: string;
  type: 'comment' | 'post' | 'case' | 'user' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  avatar?: string;
  icon?: 'bell' | 'message' | 'file' | 'briefcase' | 'user';
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Busca notificações do banco de dados
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const formattedNotifications: Notification[] = (data || []).map(n => ({
          id: n.id,
          type: n.type as any,
          title: n.title,
          message: n.message,
          link: n.link || undefined,
          read: n.read,
          createdAt: new Date(n.created_at!),
          avatar: n.avatar_url || undefined,
          icon: n.icon as any || 'bell',
        }));

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        toast({
          title: 'Erro ao carregar notificações',
          description: 'Não foi possível carregar suas notificações.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Inscreve-se para atualizações em tempo real
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Notificação atualizada:', payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Marca todas como lidas
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast({
        title: 'Notificações marcadas como lidas',
        description: 'Todas as notificações foram marcadas como lidas.',
      });
    } catch (error) {
      console.error('Erro ao marcar notificações:', error);
      toast({
        title: 'Erro ao atualizar notificações',
        description: 'Não foi possível marcar as notificações como lidas.',
        variant: 'destructive',
      });
    }
  };

  // Marca uma como lida
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
    }
  };

  // Ícone baseado no tipo
  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'message':
        return MessageSquare;
      case 'file':
        return FileText;
      case 'briefcase':
        return Briefcase;
      case 'user':
        return User;
      default:
        return Bell;
    }
  };

  // Formata o tempo relativo
  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">WAY+ E-COMMERCE</p>
          <h1 className="text-3xl font-bold">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="destructive">
            <Check className="mr-2 h-4 w-4" />
            Marcar todos como lidos
          </Button>
        )}
      </div>

      {/* Lista de Notificações */}
      <Card>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="divide-y">
            {loading ? (
              <div className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4 animate-pulse" />
                <p className="text-muted-foreground">Carregando notificações...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground">Nenhuma notificação por enquanto</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = getIcon(notification.icon);
                
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    {/* Avatar/Ícone */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar>
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>
                            <IconComponent className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      {notification.link ? (
                        <a
                          href={notification.link}
                          className="text-sm hover:underline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <span className={!notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                            {notification.message}
                          </span>
                        </a>
                      ) : (
                        <p className={`text-sm ${!notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                      )}
                    </div>

                    {/* Tempo e Status */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getRelativeTime(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="h-2 w-2 rounded-full bg-primary"
                          title="Marcar como lida"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Paginação (para implementação futura) */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" disabled>
          &lt;
        </Button>
        <Button variant="default" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          &gt;
        </Button>
      </div>
    </div>
  );
}
