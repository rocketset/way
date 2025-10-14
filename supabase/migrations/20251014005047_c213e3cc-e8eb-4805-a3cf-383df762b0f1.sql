-- Adicionar novos campos na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS email_principal text,
ADD COLUMN IF NOT EXISTS empresa text,
ADD COLUMN IF NOT EXISTS site_empresa text,
ADD COLUMN IF NOT EXISTS intencao_cadastro text;

-- Criar tabela para gerenciar intenções de cadastro predefinidas
CREATE TABLE IF NOT EXISTS public.intencoes_cadastro (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  descricao text,
  ativo boolean DEFAULT true,
  ordem integer DEFAULT 0,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.intencoes_cadastro ENABLE ROW LEVEL SECURITY;

-- Policies para intencoes_cadastro
CREATE POLICY "Todos podem ver intenções ativas"
ON public.intencoes_cadastro
FOR SELECT
TO public
USING (ativo = true);

CREATE POLICY "Administradores podem gerenciar intenções"
ON public.intencoes_cadastro
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Criar tabela para permissões granulares por role
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  modulo text NOT NULL,
  permissao text NOT NULL,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(role, modulo, permissao)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Policies para role_permissions
CREATE POLICY "Administradores podem gerenciar permissões"
ON public.role_permissions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Usuários podem ver permissões de suas roles"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = role_permissions.role
  )
);

-- Inserir intenções de cadastro padrão
INSERT INTO public.intencoes_cadastro (nome, descricao, ordem) VALUES
  ('Cliente', 'Interessado em contratar serviços', 1),
  ('Parceiro', 'Interessado em parceria comercial', 2),
  ('Fornecedor', 'Prestador de serviços ou produtos', 3),
  ('Colaborador', 'Membro da equipe', 4),
  ('Mídia/Imprensa', 'Jornalista ou veículo de comunicação', 5),
  ('Estudante', 'Estudante ou pesquisador', 6),
  ('Outro', 'Outro tipo de interesse', 7)
ON CONFLICT (nome) DO NOTHING;

-- Inserir permissões padrão para cada role
INSERT INTO public.role_permissions (role, modulo, permissao, ativo) VALUES
  -- Administrador (acesso total)
  ('administrador', 'usuarios', 'visualizar', true),
  ('administrador', 'usuarios', 'criar', true),
  ('administrador', 'usuarios', 'editar', true),
  ('administrador', 'usuarios', 'excluir', true),
  ('administrador', 'blog', 'visualizar', true),
  ('administrador', 'blog', 'criar', true),
  ('administrador', 'blog', 'editar', true),
  ('administrador', 'blog', 'excluir', true),
  ('administrador', 'cases', 'visualizar', true),
  ('administrador', 'cases', 'criar', true),
  ('administrador', 'cases', 'editar', true),
  ('administrador', 'cases', 'excluir', true),
  ('administrador', 'academy', 'visualizar', true),
  ('administrador', 'academy', 'criar', true),
  ('administrador', 'academy', 'editar', true),
  ('administrador', 'academy', 'excluir', true),
  
  -- Gestor de Conteúdo
  ('gestor_conteudo', 'blog', 'visualizar', true),
  ('gestor_conteudo', 'blog', 'criar', true),
  ('gestor_conteudo', 'blog', 'editar', true),
  ('gestor_conteudo', 'blog', 'excluir', true),
  ('gestor_conteudo', 'cases', 'visualizar', true),
  ('gestor_conteudo', 'cases', 'criar', true),
  ('gestor_conteudo', 'cases', 'editar', true),
  ('gestor_conteudo', 'cases', 'excluir', true),
  ('gestor_conteudo', 'academy', 'visualizar', true),
  ('gestor_conteudo', 'academy', 'criar', true),
  ('gestor_conteudo', 'academy', 'editar', true),
  
  -- Colunista
  ('colunista', 'blog', 'visualizar', true),
  ('colunista', 'blog', 'criar', true),
  ('colunista', 'blog', 'editar', true),
  
  -- Cliente
  ('cliente', 'academy', 'visualizar', true),
  ('cliente', 'blog', 'visualizar', true),
  ('cliente', 'cases', 'visualizar', true)
ON CONFLICT (role, modulo, permissao) DO NOTHING;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_intencoes_cadastro_updated_at
  BEFORE UPDATE ON public.intencoes_cadastro
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_role_permissions_updated_at
  BEFORE UPDATE ON public.role_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();