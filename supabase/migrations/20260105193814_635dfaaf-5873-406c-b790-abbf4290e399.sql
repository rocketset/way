-- Tabela para páginas customizadas do construtor
CREATE TABLE public.custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  -- Conteúdos
  html_content TEXT DEFAULT '',
  css_content TEXT DEFAULT '',
  js_content TEXT DEFAULT '',
  blocks_content JSONB DEFAULT '[]'::jsonb,
  -- Metadados SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  noindex BOOLEAN DEFAULT false,
  -- Configurações
  publicado BOOLEAN DEFAULT false,
  layout TEXT DEFAULT 'full',
  header_visible BOOLEAN DEFAULT true,
  footer_visible BOOLEAN DEFAULT true,
  custom_head TEXT,
  -- Auditoria
  autor_id UUID REFERENCES auth.users(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX idx_custom_pages_publicado ON public.custom_pages(publicado);

-- RLS
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Política: páginas publicadas são públicas para leitura
CREATE POLICY "Páginas publicadas são públicas" ON public.custom_pages
  FOR SELECT USING (publicado = true);

-- Política: admins e gestores podem tudo
CREATE POLICY "Admins podem gerenciar páginas" ON public.custom_pages
  FOR ALL USING (
    public.has_role(auth.uid(), 'administrador') OR 
    public.has_role(auth.uid(), 'gestor_conteudo')
  );

-- Trigger para updated_at
CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON public.custom_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();