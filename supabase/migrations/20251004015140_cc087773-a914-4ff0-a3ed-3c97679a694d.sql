-- ============================================
-- MIGRAÇÃO: SISTEMA DE EDITOR WORDPRESS-LIKE
-- ============================================
-- Esta migração adiciona suporte completo para:
-- 1. Campos avançados de posts (slug, excerpt, imagem destacada, agendamento)
-- 2. Conteúdo em blocos (JSON)
-- 3. Biblioteca de mídia
-- 4. Sistema de revisões
-- 5. Sistema de enquetes
-- 6. Metadados de SEO

-- ============================================
-- 1. ATUALIZAR TABELA DE POSTS
-- ============================================
-- Adiciona novos campos necessários para o editor completo

-- Adicionar coluna slug (URL amigável, única)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Adicionar coluna excerpt (resumo do post)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Adicionar coluna featured_image (imagem destacada)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Adicionar coluna scheduled_at (data de agendamento)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Adicionar coluna status (rascunho, agendado, publicado, arquivado)
-- Verifica se o tipo já existe antes de criar
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
  END IF;
END $$;

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS status post_status DEFAULT 'draft';

-- Adicionar coluna word_count (contagem de palavras)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;

-- Adicionar coluna reading_time (tempo de leitura estimado em minutos)
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0;

-- Criar índice único para slug
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique_idx ON public.posts(slug) WHERE slug IS NOT NULL;

-- Criar índice para scheduled_at
CREATE INDEX IF NOT EXISTS posts_scheduled_at_idx ON public.posts(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- Criar índice para status
CREATE INDEX IF NOT EXISTS posts_status_idx ON public.posts(status);

-- ============================================
-- 2. BIBLIOTECA DE MÍDIA
-- ============================================
-- Tabela para gerenciar uploads de imagens, vídeos e outros arquivos

CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS para media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Admins podem ver toda a biblioteca
CREATE POLICY "Admins podem ver toda a biblioteca" 
ON public.media_library 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem fazer upload
CREATE POLICY "Admins podem fazer upload" 
ON public.media_library 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem atualizar
CREATE POLICY "Admins podem atualizar mídia" 
ON public.media_library 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem deletar
CREATE POLICY "Admins podem deletar mídia" 
ON public.media_library 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_media_library_updated_at') THEN
    CREATE TRIGGER update_media_library_updated_at
    BEFORE UPDATE ON public.media_library
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Índices para busca e filtro
CREATE INDEX IF NOT EXISTS media_library_user_id_idx ON public.media_library(user_id);
CREATE INDEX IF NOT EXISTS media_library_mime_type_idx ON public.media_library(mime_type);
CREATE INDEX IF NOT EXISTS media_library_criado_em_idx ON public.media_library(criado_em DESC);

-- ============================================
-- 3. SISTEMA DE REVISÕES
-- ============================================
-- Armazena histórico de alterações dos posts

CREATE TABLE IF NOT EXISTS public.post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  conteudo JSONB NOT NULL,
  excerpt TEXT,
  metadata JSONB DEFAULT '{}',
  revision_number INTEGER NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS para post_revisions
ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;

-- Admins podem ver todas as revisões
CREATE POLICY "Admins podem ver revisões" 
ON public.post_revisions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem criar revisões
CREATE POLICY "Admins podem criar revisões" 
ON public.post_revisions 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Índices para revisões
CREATE INDEX IF NOT EXISTS post_revisions_post_id_idx ON public.post_revisions(post_id);
CREATE INDEX IF NOT EXISTS post_revisions_criado_em_idx ON public.post_revisions(criado_em DESC);

-- ============================================
-- 4. SISTEMA DE ENQUETES (POLLS)
-- ============================================
-- Permite criar enquetes dentro dos posts

CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  block_id TEXT NOT NULL,
  question TEXT NOT NULL,
  poll_type TEXT NOT NULL CHECK (poll_type IN ('single', 'multiple')),
  options JSONB NOT NULL,
  allow_anonymous BOOLEAN DEFAULT false,
  require_login BOOLEAN DEFAULT true,
  show_results_after_vote BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS para polls
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

-- Todos podem ver enquetes de posts publicados
CREATE POLICY "Enquetes são públicas" 
ON public.polls 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = polls.post_id 
    AND (posts.publicado = true OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Admins podem criar enquetes
CREATE POLICY "Admins podem criar enquetes" 
ON public.polls 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem atualizar enquetes
CREATE POLICY "Admins podem atualizar enquetes" 
ON public.polls 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem deletar enquetes
CREATE POLICY "Admins podem deletar enquetes" 
ON public.polls 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_polls_updated_at') THEN
    CREATE TRIGGER update_polls_updated_at
    BEFORE UPDATE ON public.polls
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- ============================================
-- 5. VOTOS DAS ENQUETES
-- ============================================
-- Armazena os votos dos usuários nas enquetes

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  option_ids JSONB NOT NULL,
  voter_fingerprint TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS para poll_votes
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver resultados de enquetes públicas
CREATE POLICY "Resultados de enquetes são visíveis" 
ON public.poll_votes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.polls p
    JOIN public.posts po ON po.id = p.post_id
    WHERE p.id = poll_votes.poll_id 
    AND (po.publicado = true OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Qualquer um pode votar (com validação no backend)
CREATE POLICY "Qualquer um pode votar" 
ON public.poll_votes 
FOR INSERT 
WITH CHECK (true);

-- Índices para poll_votes
CREATE INDEX IF NOT EXISTS poll_votes_poll_id_idx ON public.poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS poll_votes_user_id_idx ON public.poll_votes(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS poll_votes_fingerprint_idx ON public.poll_votes(voter_fingerprint) WHERE voter_fingerprint IS NOT NULL;

-- ============================================
-- 6. METADADOS DE SEO
-- ============================================
-- Armazena informações de SEO para cada post

CREATE TABLE IF NOT EXISTS public.post_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  noindex BOOLEAN DEFAULT false,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_card_type TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS para post_meta
ALTER TABLE public.post_meta ENABLE ROW LEVEL SECURITY;

-- Admins podem ver metadados
CREATE POLICY "Admins podem ver metadados" 
ON public.post_meta 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem criar metadados
CREATE POLICY "Admins podem criar metadados" 
ON public.post_meta 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem atualizar metadados
CREATE POLICY "Admins podem atualizar metadados" 
ON public.post_meta 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem deletar metadados
CREATE POLICY "Admins podem deletar metadados" 
ON public.post_meta 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_post_meta_updated_at') THEN
    CREATE TRIGGER update_post_meta_updated_at
    BEFORE UPDATE ON public.post_meta
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Índice para post_meta
CREATE INDEX IF NOT EXISTS post_meta_post_id_idx ON public.post_meta(post_id);

-- ============================================
-- 7. FUNÇÃO PARA GERAR SLUG ÚNICO
-- ============================================
-- Gera um slug único baseado no título do post

CREATE OR REPLACE FUNCTION public.generate_unique_slug(p_title TEXT, p_post_id UUID DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug TEXT;
  v_base_slug TEXT;
  v_counter INTEGER := 1;
  v_exists BOOLEAN;
BEGIN
  -- Gera slug base: converte para lowercase, remove acentos, substitui espaços por hífen
  v_base_slug := lower(trim(p_title));
  v_base_slug := regexp_replace(v_base_slug, '[áàâãäå]', 'a', 'g');
  v_base_slug := regexp_replace(v_base_slug, '[éèêë]', 'e', 'g');
  v_base_slug := regexp_replace(v_base_slug, '[íìîï]', 'i', 'g');
  v_base_slug := regexp_replace(v_base_slug, '[óòôõö]', 'o', 'g');
  v_base_slug := regexp_replace(v_base_slug, '[úùûü]', 'u', 'g');
  v_base_slug := regexp_replace(v_base_slug, '[ç]', 'c', 'g');
  v_base_slug := regexp_replace(v_base_slug, '[^a-z0-9\s-]', '', 'g');
  v_base_slug := regexp_replace(v_base_slug, '\s+', '-', 'g');
  v_base_slug := regexp_replace(v_base_slug, '-+', '-', 'g');
  v_base_slug := trim(both '-' from v_base_slug);
  
  v_slug := v_base_slug;
  
  -- Verifica se o slug já existe (exceto para o próprio post sendo atualizado)
  LOOP
    IF p_post_id IS NULL THEN
      SELECT EXISTS(SELECT 1 FROM posts WHERE slug = v_slug) INTO v_exists;
    ELSE
      SELECT EXISTS(SELECT 1 FROM posts WHERE slug = v_slug AND id != p_post_id) INTO v_exists;
    END IF;
    
    EXIT WHEN NOT v_exists;
    
    v_slug := v_base_slug || '-' || v_counter;
    v_counter := v_counter + 1;
  END LOOP;
  
  RETURN v_slug;
END;
$$;

-- ============================================
-- 8. FUNÇÃO PARA CALCULAR CONTAGEM DE PALAVRAS E TEMPO DE LEITURA
-- ============================================

CREATE OR REPLACE FUNCTION public.calculate_reading_stats(p_content JSONB)
RETURNS TABLE(word_count INTEGER, reading_time INTEGER)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_text TEXT := '';
  v_block JSONB;
  v_word_count INTEGER;
  v_reading_time INTEGER;
BEGIN
  -- Extrai texto de todos os blocos
  FOR v_block IN SELECT jsonb_array_elements(p_content)
  LOOP
    IF v_block->>'type' IN ('paragraph', 'heading', 'list', 'quote') THEN
      v_text := v_text || ' ' || COALESCE(v_block->>'content', '');
    END IF;
  END LOOP;
  
  -- Conta palavras (aproximado)
  v_word_count := array_length(regexp_split_to_array(trim(v_text), '\s+'), 1);
  v_word_count := COALESCE(v_word_count, 0);
  
  -- Calcula tempo de leitura (assumindo 200 palavras por minuto)
  v_reading_time := GREATEST(1, ROUND(v_word_count::NUMERIC / 200));
  
  RETURN QUERY SELECT v_word_count, v_reading_time;
END;
$$;