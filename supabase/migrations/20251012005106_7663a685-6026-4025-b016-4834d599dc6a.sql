-- Tabela para rastrear acessos dos usuários
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'content_view', 'material_complete', etc
  activity_data JSONB DEFAULT '{}'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_type ON public.user_activity_logs(activity_type);
CREATE INDEX idx_user_activity_logs_created ON public.user_activity_logs(criado_em);

-- Habilitar RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Administradores podem ver todos os logs"
ON public.user_activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores podem ver todos os logs"
ON public.user_activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Sistema pode criar logs"
ON public.user_activity_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários podem ver próprios logs"
ON public.user_activity_logs
FOR SELECT
USING (auth.uid() = user_id);