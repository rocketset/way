-- Tabela para configuração de formulários
CREATE TABLE public.form_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  descricao text,
  titulo_formulario text DEFAULT 'Envie sua Mensagem',
  subtitulo_formulario text DEFAULT 'Responderemos em até 24h',
  texto_botao_enviar text DEFAULT 'Enviar Mensagem',
  mostrar_whatsapp boolean DEFAULT true,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela para campos dos formulários
CREATE TABLE public.form_fields (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_config_id uuid NOT NULL REFERENCES public.form_configs(id) ON DELETE CASCADE,
  nome_campo text NOT NULL,
  label text NOT NULL,
  placeholder text,
  tipo_campo text NOT NULL DEFAULT 'text',
  obrigatorio boolean DEFAULT false,
  ordem integer DEFAULT 0,
  largura text DEFAULT 'full',
  opcoes jsonb,
  validacao jsonb,
  valor_padrao text,
  dica text,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Comentários
COMMENT ON COLUMN public.form_fields.tipo_campo IS 'Tipos: text, email, tel, textarea, select, checkbox, radio, number, date, url, cnpj, cpf';
COMMENT ON COLUMN public.form_fields.largura IS 'Largura: full, half, third';
COMMENT ON COLUMN public.form_fields.opcoes IS 'Para select/radio/checkbox: [{value, label}]';
COMMENT ON COLUMN public.form_fields.validacao IS 'Regras: {min, max, pattern, minLength, maxLength}';

-- Habilitar RLS
ALTER TABLE public.form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;

-- Políticas para form_configs
CREATE POLICY "Administradores podem gerenciar form_configs" 
  ON public.form_configs FOR ALL 
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Todos podem ver form_configs ativos" 
  ON public.form_configs FOR SELECT 
  USING (ativo = true);

-- Políticas para form_fields
CREATE POLICY "Administradores podem gerenciar form_fields" 
  ON public.form_fields FOR ALL 
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Todos podem ver form_fields ativos" 
  ON public.form_fields FOR SELECT 
  USING (ativo = true);

-- Inserir configurações padrão dos formulários
INSERT INTO public.form_configs (nome, slug, descricao, titulo_formulario) VALUES
  ('Home (CTA Results)', 'home', 'Formulário da seção CTA na página inicial', 'Envie sua Mensagem'),
  ('Página de Contato', 'contato', 'Formulário da página /contato', 'Envie sua Mensagem'),
  ('Consultoria', 'consulting', 'Formulário da página de Consultoria', 'Envie sua Mensagem'),
  ('Implantação', 'implementation', 'Formulário da página de Implantação', 'Envie sua Mensagem'),
  ('Performance', 'performance', 'Formulário da página de Performance', 'Envie sua Mensagem'),
  ('Jornada', 'journey', 'Formulário da página de Jornada', 'Envie sua Mensagem');

-- Inserir campos padrão para o formulário Home
INSERT INTO public.form_fields (form_config_id, nome_campo, label, placeholder, tipo_campo, obrigatorio, ordem, largura)
SELECT id, 'nome', 'Nome Completo', 'Seu nome', 'text', true, 1, 'half'
FROM public.form_configs WHERE slug = 'home';

INSERT INTO public.form_fields (form_config_id, nome_campo, label, placeholder, tipo_campo, obrigatorio, ordem, largura)
SELECT id, 'email', 'E-mail', 'seu@email.com', 'email', true, 2, 'half'
FROM public.form_configs WHERE slug = 'home';

INSERT INTO public.form_fields (form_config_id, nome_campo, label, placeholder, tipo_campo, obrigatorio, ordem, largura)
SELECT id, 'telefone', 'Telefone', '(11) 98765-4321', 'tel', true, 3, 'half'
FROM public.form_configs WHERE slug = 'home';

INSERT INTO public.form_fields (form_config_id, nome_campo, label, placeholder, tipo_campo, obrigatorio, ordem, largura)
SELECT id, 'empresa', 'Site/Empresa', 'Seu site ou nome da empresa', 'text', false, 4, 'half'
FROM public.form_configs WHERE slug = 'home';

INSERT INTO public.form_fields (form_config_id, nome_campo, label, placeholder, tipo_campo, obrigatorio, ordem, largura)
SELECT id, 'assunto', 'Assunto', 'Selecione um assunto', 'select', true, 5, 'full'
FROM public.form_configs WHERE slug = 'home';

INSERT INTO public.form_fields (form_config_id, nome_campo, label, placeholder, tipo_campo, obrigatorio, ordem, largura)
SELECT id, 'mensagem', 'Mensagem', 'Conte-nos sobre seu projeto...', 'textarea', true, 6, 'full'
FROM public.form_configs WHERE slug = 'home';

-- Copiar campos para os outros formulários
INSERT INTO public.form_fields (form_config_id, nome_campo, label, placeholder, tipo_campo, obrigatorio, ordem, largura)
SELECT fc.id, ff.nome_campo, ff.label, ff.placeholder, ff.tipo_campo, ff.obrigatorio, ff.ordem, ff.largura
FROM public.form_configs fc
CROSS JOIN public.form_fields ff
WHERE fc.slug != 'home' 
  AND ff.form_config_id = (SELECT id FROM public.form_configs WHERE slug = 'home');