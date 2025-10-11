-- 1. Recriar o ENUM app_role com os 4 novos tipos
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('administrador', 'colunista', 'membro', 'gestor_conteudo');

-- 2. Recriar a tabela user_roles
DROP TABLE IF EXISTS public.user_roles CASCADE;
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- 3. Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Recriar função de verificação de role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- 5. Políticas RLS para user_roles
CREATE POLICY "Administradores podem ver todos os roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Administradores podem inserir roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Administradores podem atualizar roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Administradores podem deletar roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Usuários podem ver seus próprios roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Políticas RLS para profiles
DROP POLICY IF EXISTS "Todos podem ver perfis públicos" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem atualizar qualquer perfil" ON public.profiles;
DROP POLICY IF EXISTS "Colunistas podem ver próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Colunistas podem atualizar próprio perfil" ON public.profiles;

CREATE POLICY "Todos podem ver perfis de colunistas"
  ON public.profiles FOR SELECT
  USING (is_colunista = true);

CREATE POLICY "Administradores têm acesso total a perfis"
  ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Usuários podem ver próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Colunistas podem atualizar próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id AND public.has_role(auth.uid(), 'colunista'));

-- 7. Políticas RLS para posts
DROP POLICY IF EXISTS "Posts publicados são públicos" ON public.posts;
DROP POLICY IF EXISTS "Administradores podem gerenciar posts" ON public.posts;
DROP POLICY IF EXISTS "Colunistas podem criar posts" ON public.posts;
DROP POLICY IF EXISTS "Colunistas podem editar próprios posts" ON public.posts;

CREATE POLICY "Posts publicados são visíveis para todos"
  ON public.posts FOR SELECT
  USING (publicado = true OR status = 'published');

CREATE POLICY "Administradores têm acesso total a posts"
  ON public.posts FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar posts"
  ON public.posts FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Colunistas podem criar posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'colunista') AND auth.uid() = autor_id);

CREATE POLICY "Colunistas podem ver próprios posts"
  ON public.posts FOR SELECT
  USING (public.has_role(auth.uid(), 'colunista') AND auth.uid() = autor_id);

CREATE POLICY "Colunistas podem editar próprios posts"
  ON public.posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'colunista') AND auth.uid() = autor_id);

-- 8. Políticas RLS para cases
DROP POLICY IF EXISTS "Cases publicados são públicos" ON public.cases;
DROP POLICY IF EXISTS "Administradores podem gerenciar cases" ON public.cases;

CREATE POLICY "Cases publicados são visíveis para todos"
  ON public.cases FOR SELECT
  USING (publicado = true);

CREATE POLICY "Administradores têm acesso total a cases"
  ON public.cases FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar cases"
  ON public.cases FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

-- 9. Políticas RLS para media_library
DROP POLICY IF EXISTS "Administradores podem gerenciar mídia" ON public.media_library;
DROP POLICY IF EXISTS "Usuários podem ver mídia" ON public.media_library;

CREATE POLICY "Todos podem ver mídia"
  ON public.media_library FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar mídia"
  ON public.media_library FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar mídia"
  ON public.media_library FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Colunistas podem fazer upload de mídia"
  ON public.media_library FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'colunista'));