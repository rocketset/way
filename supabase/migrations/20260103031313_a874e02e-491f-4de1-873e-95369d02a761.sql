-- Tabela para armazenar configurações de visibilidade do menu por role
CREATE TABLE public.menu_visibility (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_key TEXT NOT NULL UNIQUE,
  menu_label TEXT NOT NULL,
  menu_path TEXT,
  menu_icon TEXT,
  roles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  parent_key TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  is_separator BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_menu_visibility_parent ON public.menu_visibility(parent_key);
CREATE INDEX idx_menu_visibility_ordem ON public.menu_visibility(ordem);
CREATE INDEX idx_menu_visibility_ativo ON public.menu_visibility(ativo);

-- Enable RLS
ALTER TABLE public.menu_visibility ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Administradores podem gerenciar menu"
  ON public.menu_visibility FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Todos podem ver menu ativo"
  ON public.menu_visibility FOR SELECT
  USING (ativo = true);

-- Inserir menu atual
-- Menu Principal
INSERT INTO public.menu_visibility (menu_key, menu_label, menu_path, menu_icon, roles, ordem, is_separator) VALUES
  ('dashboard_member', 'Dashboard', '/admin/member-dashboard', 'LayoutDashboard', ARRAY['membro', 'cliente'], 1, false),
  ('dashboard_admin', 'Dashboard', '/admin', 'LayoutDashboard', ARRAY['administrador', 'gestor_conteudo', 'colunista'], 2, false),
  ('leads', 'Leads', '/admin/leads', 'Mail', ARRAY['administrador', 'gestor_conteudo'], 3, false),
  ('blog_way', 'Blog Way', '/admin/blog-way', 'FileText', ARRAY['colunista', 'cliente'], 4, false),
  ('guia_conduta', 'Guia de Boas Práticas', '/admin/conduct-guide', 'Heart', ARRAY['administrador', 'gestor_conteudo', 'colunista', 'membro', 'cliente'], 5, false);

-- Separador Site Way
INSERT INTO public.menu_visibility (menu_key, menu_label, menu_path, menu_icon, roles, ordem, is_separator) VALUES
  ('sep_site_way', 'Site Way', NULL, NULL, ARRAY['administrador', 'gestor_conteudo', 'colunista'], 10, true);

-- Items Site Way
INSERT INTO public.menu_visibility (menu_key, menu_label, menu_path, menu_icon, roles, ordem, is_separator) VALUES
  ('gerenciar_cases', 'Gerenciar Cases', '/admin/cases/list', 'Briefcase', ARRAY['administrador', 'gestor_conteudo'], 11, false),
  ('gerenciar_blog', 'Gerenciar Blog', '/admin/blog/posts', 'FileText', ARRAY['administrador', 'gestor_conteudo', 'colunista'], 12, false),
  ('configuracoes', 'Configurações', '/admin/site-settings', 'Settings', ARRAY['administrador'], 13, false),
  ('curadoria', 'Curadoria', '/admin/curation', 'CheckSquare', ARRAY['administrador', 'gestor_conteudo'], 14, false),
  ('carreiras', 'Carreiras', '/admin/carreiras/vagas', 'Users', ARRAY['administrador', 'gestor_conteudo'], 15, false);

-- Separador Plataforma
INSERT INTO public.menu_visibility (menu_key, menu_label, menu_path, menu_icon, roles, ordem, is_separator) VALUES
  ('sep_plataforma', 'Plataforma', NULL, NULL, ARRAY['administrador', 'gestor_conteudo', 'membro', 'cliente'], 20, true);

-- Items Plataforma
INSERT INTO public.menu_visibility (menu_key, menu_label, menu_path, menu_icon, roles, ordem, is_separator) VALUES
  ('way_academy', 'Way Academy', '/admin/academy', 'GraduationCap', ARRAY['administrador', 'gestor_conteudo', 'membro', 'cliente'], 21, false),
  ('atendimento', 'Atendimento', '/admin/support', 'HeadphonesIcon', ARRAY['administrador', 'gestor_conteudo', 'colunista', 'membro', 'cliente'], 99, false);

-- Subitens (usando parent_key)
INSERT INTO public.menu_visibility (menu_key, menu_label, menu_path, menu_icon, roles, parent_key, ordem, is_separator) VALUES
  -- Subitens Cases
  ('cases_lista', 'Lista', '/admin/cases/list', NULL, ARRAY['administrador', 'gestor_conteudo'], 'gerenciar_cases', 1, false),
  ('cases_categorias', 'Categorias', '/admin/cases/categories', NULL, ARRAY['administrador', 'gestor_conteudo'], 'gerenciar_cases', 2, false),
  ('cases_tags', 'Tags', '/admin/cases/tags', NULL, ARRAY['administrador', 'gestor_conteudo'], 'gerenciar_cases', 3, false),
  
  -- Subitens Blog
  ('blog_posts', 'Posts', '/admin/blog/posts', NULL, ARRAY['administrador', 'gestor_conteudo', 'colunista'], 'gerenciar_blog', 1, false),
  ('blog_categorias', 'Categorias', '/admin/blog/categories', NULL, ARRAY['administrador', 'gestor_conteudo'], 'gerenciar_blog', 2, false),
  ('blog_tags', 'Tags', '/admin/blog/tags', NULL, ARRAY['administrador', 'gestor_conteudo'], 'gerenciar_blog', 3, false),
  ('blog_colunistas', 'Colunistas', '/admin/blog/columnists', NULL, ARRAY['administrador', 'gestor_conteudo'], 'gerenciar_blog', 4, false),
  
  -- Subitens Configurações
  ('config_geral', 'Configurações Gerais', '/admin/site-settings', NULL, ARRAY['administrador'], 'configuracoes', 1, false),
  ('config_seo', 'SEO', '/admin/seo', NULL, ARRAY['administrador'], 'configuracoes', 2, false),
  ('config_forms', 'Construtor de Formulários', '/admin/form-builder', NULL, ARRAY['administrador'], 'configuracoes', 3, false),
  ('config_popups', 'Popups', '/admin/popups', NULL, ARRAY['administrador'], 'configuracoes', 4, false),
  ('config_galeria', 'Galeria de Fotos', '/admin/gallery', NULL, ARRAY['administrador'], 'configuracoes', 5, false),
  ('config_logos_clientes', 'Logos Clientes', '/admin/client-logos', NULL, ARRAY['administrador'], 'configuracoes', 6, false),
  ('config_logos_parceiros', 'Logos Parceiros', '/admin/partner-logos', NULL, ARRAY['administrador'], 'configuracoes', 7, false),
  ('config_google_reviews', 'Avaliações Google', '/admin/google-reviews', NULL, ARRAY['administrador'], 'configuracoes', 8, false),
  ('config_midia', 'Mídia', '/admin/media', NULL, ARRAY['administrador'], 'configuracoes', 9, false),
  ('config_integracoes', 'Integrações Google', '/admin/google-integrations', NULL, ARRAY['administrador'], 'configuracoes', 10, false),
  ('config_permissoes', 'Permissões', '/admin/permissions', NULL, ARRAY['administrador'], 'configuracoes', 11, false),
  ('config_usuarios', 'Usuários', '/admin/users', NULL, ARRAY['administrador'], 'configuracoes', 12, false),
  
  -- Subitens Carreiras
  ('carreiras_vagas', 'Vagas', '/admin/carreiras/vagas', NULL, ARRAY['administrador', 'gestor_conteudo'], 'carreiras', 1, false),
  ('carreiras_candidatos', 'Candidatos', '/admin/carreiras/candidatos', NULL, ARRAY['administrador', 'gestor_conteudo'], 'carreiras', 2, false),
  
  -- Subitens Academy
  ('academy_conteudos', 'Conteúdos', '/admin/academy', NULL, ARRAY['administrador', 'gestor_conteudo', 'membro', 'cliente'], 'way_academy', 1, false),
  ('academy_fornecedores', 'Lista de Fornecedores', '/admin/academy/suppliers', NULL, ARRAY['administrador', 'gestor_conteudo', 'membro', 'cliente'], 'way_academy', 2, false),
  ('academy_gerenciar', 'Gerenciar Conteúdos', '/admin/academy/manage', NULL, ARRAY['administrador', 'gestor_conteudo'], 'way_academy', 3, false),
  ('academy_categorias', 'Gerenciar Categorias', '/admin/academy/categories', NULL, ARRAY['administrador'], 'way_academy', 4, false),
  ('academy_config', 'Configurações', '/admin/academy/settings', NULL, ARRAY['administrador'], 'way_academy', 5, false);