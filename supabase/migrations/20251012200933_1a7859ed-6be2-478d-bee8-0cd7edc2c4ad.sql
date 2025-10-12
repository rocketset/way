-- Tabela para armazenar avaliações do Google
CREATE TABLE IF NOT EXISTS public.google_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_url TEXT,
  profile_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  time TIMESTAMP WITH TIME ZONE NOT NULL,
  relative_time_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para ordenação por data
CREATE INDEX idx_google_reviews_time ON public.google_reviews(time DESC);

-- Tabela para armazenar configurações do Place
CREATE TABLE IF NOT EXISTS public.google_place_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL UNIQUE,
  place_name TEXT,
  rating NUMERIC(2,1),
  user_ratings_total INTEGER,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_place_config ENABLE ROW LEVEL SECURITY;

-- Políticas: todos podem ver avaliações
CREATE POLICY "Todos podem ver avaliações do Google"
  ON public.google_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Todos podem ver configuração do place"
  ON public.google_place_config
  FOR SELECT
  USING (true);

-- Administradores podem gerenciar
CREATE POLICY "Administradores podem gerenciar avaliações"
  ON public.google_reviews
  FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Administradores podem gerenciar configuração"
  ON public.google_place_config
  FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_google_reviews_updated_at
  BEFORE UPDATE ON public.google_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_google_place_config_updated_at
  BEFORE UPDATE ON public.google_place_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();