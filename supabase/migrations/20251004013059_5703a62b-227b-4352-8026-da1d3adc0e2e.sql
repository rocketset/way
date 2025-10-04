-- ============================================
-- SISTEMA ADMINISTRATIVO WAY E-COMMERCE
-- Criação de todas as tabelas necessárias
-- ============================================

-- 1. TABELA DE PERFIS DE USUÁRIOS
-- Armazena informações adicionais dos usuários além do auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS na tabela de perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Política: Permitir inserção de perfil ao criar conta
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. TABELA DE ROLES (PAPÉIS/FUNÇÕES)
-- Define os tipos de usuários no sistema
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabela que relaciona usuários com seus papéis
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Habilitar RLS na tabela de roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário tem papel específico (evita recursão no RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
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

-- Política: Admins podem ver todos os roles
CREATE POLICY "Admins podem ver todos os roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Usuários podem ver seu próprio role
CREATE POLICY "Usuários podem ver seu próprio role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- 3. TABELA DE CATEGORIAS
-- Categorias para posts do blog e cases
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('blog', 'case')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver categorias
CREATE POLICY "Categorias são públicas"
  ON public.categories FOR SELECT
  USING (true);

-- Política: Apenas admins podem criar categorias
CREATE POLICY "Apenas admins podem criar categorias"
  ON public.categories FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem atualizar categorias
CREATE POLICY "Apenas admins podem atualizar categorias"
  ON public.categories FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem deletar categorias
CREATE POLICY "Apenas admins podem deletar categorias"
  ON public.categories FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. TABELA DE TAGS
-- Tags para posts do blog e cases
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('blog', 'case')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver tags
CREATE POLICY "Tags são públicas"
  ON public.tags FOR SELECT
  USING (true);

-- Política: Apenas admins podem criar tags
CREATE POLICY "Apenas admins podem criar tags"
  ON public.tags FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem atualizar tags
CREATE POLICY "Apenas admins podem atualizar tags"
  ON public.tags FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem deletar tags
CREATE POLICY "Apenas admins podem deletar tags"
  ON public.tags FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. TABELA DE POSTS DO BLOG
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  categoria_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  publicado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Política: Posts publicados são públicos
CREATE POLICY "Posts publicados são públicos"
  ON public.posts FOR SELECT
  USING (publicado = true OR public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem criar posts
CREATE POLICY "Apenas admins podem criar posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem atualizar posts
CREATE POLICY "Apenas admins podem atualizar posts"
  ON public.posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem deletar posts
CREATE POLICY "Apenas admins podem deletar posts"
  ON public.posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. TABELA DE RELAÇÃO POSTS-TAGS (Many-to-Many)
CREATE TABLE public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Habilitar RLS
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver relações de tags
CREATE POLICY "Relações de tags são públicas"
  ON public.post_tags FOR SELECT
  USING (true);

-- Política: Apenas admins podem gerenciar relações
CREATE POLICY "Apenas admins podem gerenciar post_tags"
  ON public.post_tags FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. TABELA DE CASES
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  imagem_url TEXT,
  publicado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Política: Cases publicados são públicos
CREATE POLICY "Cases publicados são públicos"
  ON public.cases FOR SELECT
  USING (publicado = true OR public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem criar cases
CREATE POLICY "Apenas admins podem criar cases"
  ON public.cases FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem atualizar cases
CREATE POLICY "Apenas admins podem atualizar cases"
  ON public.cases FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem deletar cases
CREATE POLICY "Apenas admins podem deletar cases"
  ON public.cases FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. TABELA DE RELAÇÃO CASES-TAGS (Many-to-Many)
CREATE TABLE public.case_tags (
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (case_id, tag_id)
);

-- Habilitar RLS
ALTER TABLE public.case_tags ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver relações de tags
CREATE POLICY "Relações de tags de cases são públicas"
  ON public.case_tags FOR SELECT
  USING (true);

-- Política: Apenas admins podem gerenciar relações
CREATE POLICY "Apenas admins podem gerenciar case_tags"
  ON public.case_tags FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. TABELA DE SOLICITAÇÕES DE CONTATO
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  empresa TEXT,
  mensagem TEXT NOT NULL,
  lido BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer pessoa pode criar uma solicitação de contato
CREATE POLICY "Qualquer pessoa pode enviar mensagem de contato"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

-- Política: Apenas admins podem ver solicitações
CREATE POLICY "Apenas admins podem ver solicitações de contato"
  ON public.contacts FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem atualizar solicitações
CREATE POLICY "Apenas admins podem atualizar solicitações de contato"
  ON public.contacts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Política: Apenas admins podem deletar solicitações
CREATE POLICY "Apenas admins podem deletar solicitações de contato"
  ON public.contacts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS PARA ATUALIZAR CAMPOS updated_at
-- ============================================

-- Função para atualizar o campo atualizado_em automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com campo atualizado_em
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================

-- Função para criar perfil automaticamente quando um novo usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger que executa a função quando um usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();