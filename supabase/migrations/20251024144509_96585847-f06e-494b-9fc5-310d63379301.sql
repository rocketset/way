-- Criar tabela para controle do sitemap
CREATE TABLE IF NOT EXISTS public.sitemap_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  total_urls INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sitemap_config ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Todos podem ver configuração do sitemap"
  ON public.sitemap_config
  FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar configuração do sitemap"
  ON public.sitemap_config
  FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_sitemap_config_updated_at
  BEFORE UPDATE ON public.sitemap_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir registro inicial
INSERT INTO public.sitemap_config (id, status)
VALUES (gen_random_uuid(), 'pending')
ON CONFLICT DO NOTHING;