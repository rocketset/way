import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Check, FileText, Briefcase, User, MessageSquare, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function Notifications() {
  const { notifications, isLoading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isAdmin, isGestorConteudo, user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system' as 'system' | 'post' | 'case' | 'user',
    icon: 'bell' as 'bell' | 'message' | 'file' | 'briefcase' | 'user',
    link: '',
  });

  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Erro",
        description: "Título e mensagem são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Busca todos os usuários com role 'cliente'
      const { data: clientRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'cliente');

      if (rolesError) throw rolesError;

      if (!clientRoles || clientRoles.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum cliente encontrado para receber notificações",
        });
        setIsSending(false);
        return;
      }

      // Cria notificações para todos os clientes
      const notifications = clientRoles.map(role => ({
        user_id: role.user_id,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        icon: formData.icon,
        link: formData.link || null,
        read: false,
      }));

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) throw insertError;

      toast({
        title: "Sucesso",
        description: `Notificação enviada para ${clientRoles.length} cliente(s)`,
      });

      // Reseta o formulário e fecha o dialog
      setFormData({
        title: '',
        message: '',
        type: 'system',
        icon: 'bell',
        link: '',
      });
      setIsDialogOpen(false);
      
      // Atualiza a lista de notificações
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a notificação",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
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

  const canSendNotifications = isAdmin || isGestorConteudo;

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

        <div className="flex gap-2">
          {canSendNotifications && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Notificação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Enviar Notificação Manual</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Nova atualização disponível"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder="Digite a mensagem da notificação..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      maxLength={500}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: typeof formData.type) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">Sistema</SelectItem>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="case">Case</SelectItem>
                          <SelectItem value="user">Usuário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Ícone</Label>
                      <Select
                        value={formData.icon}
                        onValueChange={(value: typeof formData.icon) => setFormData({ ...formData, icon: value })}
                      >
                        <SelectTrigger id="icon">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bell">Sino</SelectItem>
                          <SelectItem value="message">Mensagem</SelectItem>
                          <SelectItem value="file">Arquivo</SelectItem>
                          <SelectItem value="briefcase">Pasta</SelectItem>
                          <SelectItem value="user">Usuário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">Link (opcional)</Label>
                    <Input
                      id="link"
                      placeholder="/admin/academy"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleSendNotification}
                    disabled={isSending}
                    className="w-full"
                  >
                    {isSending ? 'Enviando...' : 'Enviar para Todos os Clientes'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {unreadCount > 0 && (
            <Button onClick={() => markAllAsRead()} variant="destructive">
              <Check className="mr-2 h-4 w-4" />
              Marcar todos como lidos
            </Button>
          )}
        </div>
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
