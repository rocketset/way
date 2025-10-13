// Página de notificações do painel administrativo
// Exibe todas as atualizações e atividades recentes

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Check, FileText, Briefcase, User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications } from '@/hooks/useNotifications';

export default function Notifications() {
  const { notifications, isLoading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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
          <Button onClick={() => markAllAsRead()} variant="destructive">
            <Check className="mr-2 h-4 w-4" />
            Marcar todos como lidos
          </Button>
        )}
      </div>

      {/* Lista de Notificações */}
      <Card>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="divide-y">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
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
                      {notification.avatar_url ? (
                        <Avatar>
                          <AvatarImage src={notification.avatar_url} />
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
                        {getRelativeTime(notification.created_at)}
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
    </div>
  );
}
