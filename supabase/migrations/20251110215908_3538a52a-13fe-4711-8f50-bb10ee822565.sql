-- Criar tabela de configurações do site
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informações da empresa
  company_name text NOT NULL DEFAULT 'Way E-commerce',
  company_description text,
  company_founding_year text DEFAULT '2015',
  
  -- Contatos
  phone text,
  email text,
  whatsapp text,
  address text,
  city text,
  state text,
  country text DEFAULT 'Brasil',
  
  -- Redes sociais
  instagram_url text,
  linkedin_url text,
  facebook_url text,
  twitter_url text,
  youtube_url text,
  google_reviews_url text,
  
  -- SEO e Analytics
  site_url text DEFAULT 'https://wayecommerce.com.br',
  logo_url text,
  
  -- Avaliações
  rating_value numeric DEFAULT 5.0,
  review_count integer DEFAULT 47,
  
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Todos podem ver configurações do site"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar configurações do site"
  ON public.site_settings
  FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO public.site_settings (
  company_name,
  company_description,
  company_founding_year,
  phone,
  email,
  address,
  city,
  state,
  instagram_url,
  linkedin_url,
  facebook_url,
  google_reviews_url
) VALUES (
  'Way E-commerce',
  'Fazemos seu e-commerce crescer com estratégia, tecnologia, integrações e performance.',
  '2015',
  '(83) 99644-3602',
  'contato@wayecommerce.com.br',
  'João Pessoa',
  'João Pessoa',
  'Paraíba',
  'https://www.instagram.com/wayecommerce/',
  'https://www.linkedin.com/company/wayecommerce/',
  'https://www.facebook.com/wayecommerce',
  'https://share.google/AaJY99hxuyzkT8BZi'
);