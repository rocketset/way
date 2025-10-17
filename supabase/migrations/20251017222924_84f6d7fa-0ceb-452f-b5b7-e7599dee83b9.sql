-- Tabela para armazenar configurações de integração com Google
CREATE TABLE IF NOT EXISTS public.google_integrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analytics_id text,
  tag_manager_id text,
  search_console_verification text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;

-- Administradores podem gerenciar integrações
CREATE POLICY "Administradores podem gerenciar integrações Google"
ON public.google_integrations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Todos podem ver as configurações (necessário para carregar scripts no frontend)
CREATE POLICY "Todos podem ver configurações Google"
ON public.google_integrations
FOR SELECT
TO public
USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_google_integrations_updated_at
BEFORE UPDATE ON public.google_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();