-- Adicionar campos de SEO Avançado na tabela page_seo
-- Permite inserir código personalizado (JSON-LD/Schema) por página

-- Campo para código que será inserido no <head>
ALTER TABLE public.page_seo 
ADD COLUMN IF NOT EXISTS custom_head_code TEXT;

-- Campo para código que será inserido antes do </body>
ALTER TABLE public.page_seo 
ADD COLUMN IF NOT EXISTS custom_body_code TEXT;

-- Adicionar comentários para documentação
COMMENT ON COLUMN public.page_seo.custom_head_code IS 'Código personalizado para inserir no <head> (JSON-LD, Schema, meta tags extras)';
COMMENT ON COLUMN public.page_seo.custom_body_code IS 'Código personalizado para inserir antes do </body> (scripts, tracking codes)';