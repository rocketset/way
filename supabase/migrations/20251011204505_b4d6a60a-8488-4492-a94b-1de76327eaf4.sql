-- Tabela de notificações do sistema
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('comment', 'post', 'case', 'user', 'system', 'academy')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  avatar_url TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias notificações
CREATE POLICY "Usuários podem ver próprias notificações"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias notificações (marcar como lida)
CREATE POLICY "Usuários podem atualizar próprias notificações"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Administradores podem gerenciar todas as notificações
CREATE POLICY "Administradores podem gerenciar notificações"
ON public.notifications
FOR ALL
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Gestores de conteúdo podem gerenciar notificações
CREATE POLICY "Gestores podem gerenciar notificações"
ON public.notifications
FOR ALL
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

-- Sistema pode criar notificações
CREATE POLICY "Sistema pode criar notificações"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar campo de status de moderação nos posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id);

ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;

-- Adicionar campo de status de moderação nos cases
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.cases
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id);

ALTER TABLE public.cases
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;