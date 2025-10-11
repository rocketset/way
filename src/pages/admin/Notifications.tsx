// Página de notificações do painel administrativo
// Exibe todas as atualizações e atividades recentes

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, FileText, Briefcase, User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

// Dados mockados de exemplo
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'comment',
    title: 'Novo comentário',
    message: 'Julia da Vello respondeu ao seu comentário na aula Live 11: 7 Estratégias com IA para aumentar as vendas no e-commerce',
    link: '/admin/academy',
    read: false,
    createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 meses atrás
    icon: 'message',
  },
  {
    id: '2',
    type: 'post',
    title: 'Novo post publicado',
    message: 'O post "Tendências de E-commerce 2024" foi publicado com sucesso',
    link: '/admin/blog/posts',
    read: false,
    createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000),
    icon: 'file',
  },
  {
    id: '3',
    type: 'system',
    title: 'Assinatura liberada',
    message: 'A assinatura Jornada Ecomm - Vitalício foi liberada no seu painel de conteúdo',
    link: '/admin/academy',
    read: true,
    createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
    icon: 'bell',
  },
  {
    id: '4',
    type: 'comment',
    message: 'Vello respondeu ao seu comentário na aula Live 20: Guia completo de criativos para e-commerce',
    link: '/admin/academy',
    read: true,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    icon: 'message',
    title: 'Nova resposta',
  },
  {
    id: '5',
    type: 'case',
    title: 'Case atualizado',
    message: 'O case "Implementação Shopify para Loja X" foi atualizado',
    link: '/admin/cases/list',
    read: true,
    createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
    icon: 'briefcase',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Marca todas como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Marca uma como lida
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
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
            {notifications.length === 0 ? (
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
