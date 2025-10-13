-- Tabela principal de landing pages
CREATE TABLE public.landing_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  
  -- Status e datas
  publicado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Autor
  autor_id UUID REFERENCES auth.users(id)
);

-- Tabela de blocos de conteúdo das landing pages
CREATE TABLE public.landing_page_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL, -- 'hero', 'features', 'cta', 'form', 'testimonials', 'pricing', 'faq'
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para armazenar leads capturados
CREATE TABLE public.landing_page_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_landing_pages_slug ON public.landing_pages(slug);
CREATE INDEX idx_landing_pages_publicado ON public.landing_pages(publicado);
CREATE INDEX idx_landing_page_blocks_page_id ON public.landing_page_blocks(landing_page_id);
CREATE INDEX idx_landing_page_blocks_position ON public.landing_page_blocks(landing_page_id, position);
CREATE INDEX idx_landing_page_leads_page_id ON public.landing_page_leads(landing_page_id);
CREATE INDEX idx_landing_page_leads_email ON public.landing_page_leads(email);

-- Enable RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies para landing_pages
CREATE POLICY "Landing pages publicadas são visíveis para todos"
  ON public.landing_pages FOR SELECT
  USING (publicado = true);

CREATE POLICY "Administradores podem gerenciar landing pages"
  ON public.landing_pages FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores de conteúdo podem gerenciar landing pages"
  ON public.landing_pages FOR ALL
  USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

-- RLS Policies para landing_page_blocks
CREATE POLICY "Blocos de landing pages publicadas são visíveis para todos"
  ON public.landing_page_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.landing_pages
      WHERE landing_pages.id = landing_page_blocks.landing_page_id
      AND landing_pages.publicado = true
    )
  );

CREATE POLICY "Administradores podem gerenciar blocos"
  ON public.landing_page_blocks FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores de conteúdo podem gerenciar blocos"
  ON public.landing_page_blocks FOR ALL
  USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

-- RLS Policies para landing_page_leads
CREATE POLICY "Administradores podem ver todos os leads"
  ON public.landing_page_leads FOR SELECT
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem ver todos os leads"
  ON public.landing_page_leads FOR SELECT
  USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

CREATE POLICY "Qualquer um pode criar leads"
  ON public.landing_page_leads FOR INSERT
  WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_landing_pages_updated_at
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_landing_page_blocks_updated_at
  BEFORE UPDATE ON public.landing_page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();