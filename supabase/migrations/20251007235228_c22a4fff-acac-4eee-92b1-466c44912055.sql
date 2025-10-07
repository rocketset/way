-- ATENÇÃO: Esta migração desabilita TODAS as políticas RLS
-- Isso expõe todos os dados publicamente

-- Desabilitar RLS e remover políticas de todas as tabelas

-- Table: case_content_blocks
ALTER TABLE public.case_content_blocks DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Apenas admins podem atualizar blocos de cases" ON public.case_content_blocks;
DROP POLICY IF EXISTS "Apenas admins podem criar blocos de cases" ON public.case_content_blocks;
DROP POLICY IF EXISTS "Apenas admins podem deletar blocos de cases" ON public.case_content_blocks;
DROP POLICY IF EXISTS "Blocos de cases publicados são públicos" ON public.case_content_blocks;

-- Table: case_tags
ALTER TABLE public.case_tags DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar case_tags" ON public.case_tags;
DROP POLICY IF EXISTS "Relações de tags de cases são públicas" ON public.case_tags;

-- Table: cases
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Apenas admins podem atualizar cases" ON public.cases;
DROP POLICY IF EXISTS "Apenas admins podem criar cases" ON public.cases;
DROP POLICY IF EXISTS "Apenas admins podem deletar cases" ON public.cases;
DROP POLICY IF EXISTS "Cases publicados são públicos" ON public.cases;

-- Table: categories
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories_public_delete" ON public.categories;
DROP POLICY IF EXISTS "categories_public_insert" ON public.categories;
DROP POLICY IF EXISTS "categories_public_select" ON public.categories;
DROP POLICY IF EXISTS "categories_public_update" ON public.categories;

-- Table: comments
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Apenas admins podem atualizar comentários" ON public.comments;
DROP POLICY IF EXISTS "Apenas admins podem deletar comentários" ON public.comments;
DROP POLICY IF EXISTS "Comentários aprovados são públicos" ON public.comments;
DROP POLICY IF EXISTS "Anon pode criar comentários" ON public.comments;
DROP POLICY IF EXISTS "Autenticados podem criar comentários" ON public.comments;

-- Table: contacts
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Apenas admins podem atualizar solicitações de contato" ON public.contacts;
DROP POLICY IF EXISTS "Apenas admins podem deletar solicitações de contato" ON public.contacts;
DROP POLICY IF EXISTS "Apenas admins podem ver solicitações de contato" ON public.contacts;
DROP POLICY IF EXISTS "Qualquer pessoa pode enviar mensagem de contato" ON public.contacts;

-- Table: media_library
ALTER TABLE public.media_library DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Atualizar mídia (autenticado)" ON public.media_library;
DROP POLICY IF EXISTS "Deletar mídia (autenticado)" ON public.media_library;
DROP POLICY IF EXISTS "Inserir mídia (autenticado)" ON public.media_library;
DROP POLICY IF EXISTS "Ver mídia (autenticado)" ON public.media_library;

-- Table: poll_votes
ALTER TABLE public.poll_votes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "poll_votes_public_delete" ON public.poll_votes;
DROP POLICY IF EXISTS "poll_votes_public_insert" ON public.poll_votes;
DROP POLICY IF EXISTS "poll_votes_public_select" ON public.poll_votes;
DROP POLICY IF EXISTS "poll_votes_public_update" ON public.poll_votes;

-- Table: polls
ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "polls_public_delete" ON public.polls;
DROP POLICY IF EXISTS "polls_public_insert" ON public.polls;
DROP POLICY IF EXISTS "polls_public_select" ON public.polls;
DROP POLICY IF EXISTS "polls_public_update" ON public.polls;

-- Table: post_categories
ALTER TABLE public.post_categories DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins e autores podem atualizar relações de categorias" ON public.post_categories;
DROP POLICY IF EXISTS "Admins e autores podem deletar relações de categorias" ON public.post_categories;
DROP POLICY IF EXISTS "Admins e autores podem inserir relações de categorias" ON public.post_categories;
DROP POLICY IF EXISTS "Relações de categorias são públicas" ON public.post_categories;

-- Table: post_meta
ALTER TABLE public.post_meta DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "post_meta_public_delete" ON public.post_meta;
DROP POLICY IF EXISTS "post_meta_public_insert" ON public.post_meta;
DROP POLICY IF EXISTS "post_meta_public_select" ON public.post_meta;
DROP POLICY IF EXISTS "post_meta_public_update" ON public.post_meta;

-- Table: post_revisions
ALTER TABLE public.post_revisions DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "post_revisions_public_delete" ON public.post_revisions;
DROP POLICY IF EXISTS "post_revisions_public_insert" ON public.post_revisions;
DROP POLICY IF EXISTS "post_revisions_public_select" ON public.post_revisions;
DROP POLICY IF EXISTS "post_revisions_public_update" ON public.post_revisions;

-- Table: post_tags
ALTER TABLE public.post_tags DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "post_tags_public_delete" ON public.post_tags;
DROP POLICY IF EXISTS "post_tags_public_insert" ON public.post_tags;
DROP POLICY IF EXISTS "post_tags_public_select" ON public.post_tags;
DROP POLICY IF EXISTS "post_tags_public_update" ON public.post_tags;

-- Table: posts
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "posts_public_delete" ON public.posts;
DROP POLICY IF EXISTS "posts_public_insert" ON public.posts;
DROP POLICY IF EXISTS "posts_public_select" ON public.posts;
DROP POLICY IF EXISTS "posts_public_update" ON public.posts;

-- Table: profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins podem atualizar perfis" ON public.profiles;
DROP POLICY IF EXISTS "Perfis de colunistas são públicos" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;

-- Table: tags
ALTER TABLE public.tags DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tags_public_delete" ON public.tags;
DROP POLICY IF EXISTS "tags_public_insert" ON public.tags;
DROP POLICY IF EXISTS "tags_public_select" ON public.tags;
DROP POLICY IF EXISTS "tags_public_update" ON public.tags;

-- Table: user_roles
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins podem ver todos os roles" ON public.user_roles;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio role" ON public.user_roles;