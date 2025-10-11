-- Adicionar campo de capa aos conteúdos
ALTER TABLE public.academy_content
ADD COLUMN capa_url TEXT;

-- Criar tabela de categorias para Way Academy
CREATE TABLE public.academy_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar categoria aos conteúdos
ALTER TABLE public.academy_content
ADD COLUMN categoria_id UUID REFERENCES public.academy_categories(id) ON DELETE SET NULL;

-- Criar tabela para configurações da Academy (banner, etc)
CREATE TABLE public.academy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_url TEXT,
  banner_titulo TEXT,
  banner_descricao TEXT,
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir registro inicial de configurações
INSERT INTO public.academy_settings (banner_titulo, banner_descricao)
VALUES ('Way Academy', 'Desenvolva suas habilidades com nossos cursos e materiais exclusivos');

-- Inserir categorias padrão
INSERT INTO public.academy_categories (nome, descricao, ordem) VALUES
('Cases', 'Estudos de caso e experiências reais', 1),
('Mentorias', 'Sessões de mentoria e orientação', 2),
('Profissionalize', 'Materiais para profissionalização', 3);

-- Enable RLS
ALTER TABLE public.academy_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_settings ENABLE ROW LEVEL SECURITY;

-- Policies para academy_categories
CREATE POLICY "Todos podem ver categorias ativas"
ON public.academy_categories FOR SELECT
USING (ativo = true);

CREATE POLICY "Administradores podem gerenciar categorias"
ON public.academy_categories FOR ALL
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Policies para academy_settings
CREATE POLICY "Todos podem ver configurações"
ON public.academy_settings FOR SELECT
USING (true);

CREATE POLICY "Administradores podem atualizar configurações"
ON public.academy_settings FOR UPDATE
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Trigger para atualizar updated_at em academy_categories
CREATE TRIGGER update_academy_categories_updated_at
BEFORE UPDATE ON public.academy_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em academy_settings
CREATE TRIGGER update_academy_settings_updated_at
BEFORE UPDATE ON public.academy_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();