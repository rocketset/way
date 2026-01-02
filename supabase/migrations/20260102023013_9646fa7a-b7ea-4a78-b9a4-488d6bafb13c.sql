-- Tabela para configurações de SEO por página
CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  noindex BOOLEAN DEFAULT false,
  nofollow BOOLEAN DEFAULT false,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  twitter_site TEXT,
  schema_markup JSONB,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Administradores podem gerenciar SEO" 
ON public.page_seo 
FOR ALL 
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem gerenciar SEO" 
ON public.page_seo 
FOR ALL 
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

CREATE POLICY "Todos podem ver configurações de SEO" 
ON public.page_seo 
FOR SELECT 
USING (true);

-- Trigger para atualizar timestamp
CREATE TRIGGER update_page_seo_updated_at
BEFORE UPDATE ON public.page_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir páginas existentes com valores padrão
INSERT INTO public.page_seo (page_key, page_name, meta_title, meta_description, meta_keywords) VALUES
('home', 'Home', 'De consultoria a performance: sua operação digital em outro nível', 'Fazemos seu e-commerce crescer com estratégia, tecnologia, integrações e performance. Estrutura, processo e resultado para escalar suas vendas.', 'e-commerce, consultoria, performance, marketing digital'),
('blog', 'Blog', 'Blog', 'Fique por dentro das últimas tendências em e-commerce, marketing digital e estratégias para escalar seu negócio online.', 'blog e-commerce, marketing digital, tendências online'),
('cases', 'Cases de Sucesso', 'Cases de Sucesso', 'Conheça histórias reais de empresas que transformaram seus negócios com as soluções da Way E-commerce.', 'cases de sucesso, portfolio, resultados e-commerce'),
('contato', 'Contato', 'Contato', 'Entre em contato com a Way E-commerce. Estamos prontos para transformar seu e-commerce.', 'contato, fale conosco, way e-commerce'),
('why-way', 'Por que a Way', 'Por que a Way', 'Descubra por que a Way E-commerce é a parceira ideal para transformar seu negócio digital.', 'por que way, diferenciais, sobre nós'),
('consultoria', 'Consultoria', 'Mentoria e Consultoria para E-commerce', 'Orientação estratégica para impulsionar o crescimento sustentável do seu e-commerce.', 'consultoria e-commerce, mentoria, estratégia digital'),
('implantacao', 'Implantação', 'Implantação de E-commerce', 'Implantação completa de lojas virtuais com as melhores plataformas do mercado.', 'implantação e-commerce, criar loja virtual'),
('performance', 'Performance', 'Performance e Marketing Digital', 'Estratégias de performance para acelerar as vendas do seu e-commerce.', 'performance, marketing digital, tráfego pago'),
('jornada', 'Jornada', 'Jornada do Cliente', 'Acompanhamento completo da jornada do seu e-commerce.', 'jornada cliente, acompanhamento, evolução'),
('privacy', 'Privacidade', 'Política de Privacidade', 'Política de privacidade e proteção de dados da Way E-commerce.', 'privacidade, lgpd, proteção dados');

-- Tabela para configurações globais de SEO
CREATE TABLE public.global_seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Way E-commerce',
  site_title_suffix TEXT DEFAULT ' | Way E-commerce',
  default_og_image TEXT,
  twitter_site TEXT DEFAULT '@wayecommerce',
  google_site_verification TEXT,
  bing_site_verification TEXT,
  robots_txt TEXT DEFAULT 'User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://wayecommerce.com.br/sitemap.xml',
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.global_seo_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Administradores podem gerenciar SEO global" 
ON public.global_seo_settings 
FOR ALL 
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Todos podem ver SEO global" 
ON public.global_seo_settings 
FOR SELECT 
USING (true);

-- Trigger para atualizar timestamp
CREATE TRIGGER update_global_seo_updated_at
BEFORE UPDATE ON public.global_seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configuração padrão
INSERT INTO public.global_seo_settings (site_name, twitter_site) VALUES ('Way E-commerce', '@wayecommerce');