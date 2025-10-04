-- Liberalizar RLS para recursos de Blog: tornar SELECT/INSERT/UPDATE/DELETE públicos
-- Posts
DROP POLICY IF EXISTS "Posts publicados são públicos" ON public.posts;
DROP POLICY IF EXISTS "Apenas admins podem criar posts" ON public.posts;
DROP POLICY IF EXISTS "Apenas admins podem atualizar posts" ON public.posts;
DROP POLICY IF EXISTS "Apenas admins podem deletar posts" ON public.posts;

CREATE POLICY "posts_public_select"
ON public.posts
FOR SELECT
TO public
USING (true);

CREATE POLICY "posts_public_insert"
ON public.posts
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "posts_public_update"
ON public.posts
FOR UPDATE
TO public
USING (true);

CREATE POLICY "posts_public_delete"
ON public.posts
FOR DELETE
TO public
USING (true);

-- Post Meta
DROP POLICY IF EXISTS "Admins podem ver metadados" ON public.post_meta;
DROP POLICY IF EXISTS "Admins podem criar metadados" ON public.post_meta;
DROP POLICY IF EXISTS "Admins podem atualizar metadados" ON public.post_meta;
DROP POLICY IF EXISTS "Admins podem deletar metadados" ON public.post_meta;

CREATE POLICY "post_meta_public_select"
ON public.post_meta
FOR SELECT
TO public
USING (true);

CREATE POLICY "post_meta_public_insert"
ON public.post_meta
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "post_meta_public_update"
ON public.post_meta
FOR UPDATE
TO public
USING (true);

CREATE POLICY "post_meta_public_delete"
ON public.post_meta
FOR DELETE
TO public
USING (true);

-- Post Revisions
DROP POLICY IF EXISTS "Admins podem ver revisões" ON public.post_revisions;
DROP POLICY IF EXISTS "Admins podem criar revisões" ON public.post_revisions;

CREATE POLICY "post_revisions_public_select"
ON public.post_revisions
FOR SELECT
TO public
USING (true);

CREATE POLICY "post_revisions_public_insert"
ON public.post_revisions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "post_revisions_public_update"
ON public.post_revisions
FOR UPDATE
TO public
USING (true);

CREATE POLICY "post_revisions_public_delete"
ON public.post_revisions
FOR DELETE
TO public
USING (true);

-- Post Tags
DROP POLICY IF EXISTS "Relações de tags são públicas" ON public.post_tags;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar post_tags" ON public.post_tags;

CREATE POLICY "post_tags_public_select"
ON public.post_tags
FOR SELECT
TO public
USING (true);

CREATE POLICY "post_tags_public_insert"
ON public.post_tags
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "post_tags_public_update"
ON public.post_tags
FOR UPDATE
TO public
USING (true);

CREATE POLICY "post_tags_public_delete"
ON public.post_tags
FOR DELETE
TO public
USING (true);

-- Tags
DROP POLICY IF EXISTS "Tags são públicas" ON public.tags;
DROP POLICY IF EXISTS "Apenas admins podem criar tags" ON public.tags;
DROP POLICY IF EXISTS "Apenas admins podem atualizar tags" ON public.tags;
DROP POLICY IF EXISTS "Apenas admins podem deletar tags" ON public.tags;

CREATE POLICY "tags_public_select"
ON public.tags
FOR SELECT
TO public
USING (true);

CREATE POLICY "tags_public_insert"
ON public.tags
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "tags_public_update"
ON public.tags
FOR UPDATE
TO public
USING (true);

CREATE POLICY "tags_public_delete"
ON public.tags
FOR DELETE
TO public
USING (true);

-- Categories
DROP POLICY IF EXISTS "Categorias são públicas" ON public.categories;
DROP POLICY IF EXISTS "Apenas admins podem criar categorias" ON public.categories;
DROP POLICY IF EXISTS "Apenas admins podem atualizar categorias" ON public.categories;
DROP POLICY IF EXISTS "Apenas admins podem deletar categorias" ON public.categories;

CREATE POLICY "categories_public_select"
ON public.categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "categories_public_insert"
ON public.categories
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "categories_public_update"
ON public.categories
FOR UPDATE
TO public
USING (true);

CREATE POLICY "categories_public_delete"
ON public.categories
FOR DELETE
TO public
USING (true);

-- Polls
DROP POLICY IF EXISTS "Enquetes são públicas" ON public.polls;
DROP POLICY IF EXISTS "Admins podem criar enquetes" ON public.polls;
DROP POLICY IF EXISTS "Admins podem atualizar enquetes" ON public.polls;
DROP POLICY IF EXISTS "Admins podem deletar enquetes" ON public.polls;

CREATE POLICY "polls_public_select"
ON public.polls
FOR SELECT
TO public
USING (true);

CREATE POLICY "polls_public_insert"
ON public.polls
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "polls_public_update"
ON public.polls
FOR UPDATE
TO public
USING (true);

CREATE POLICY "polls_public_delete"
ON public.polls
FOR DELETE
TO public
USING (true);

-- Poll Votes
DROP POLICY IF EXISTS "Resultados de enquetes são visíveis" ON public.poll_votes;
DROP POLICY IF EXISTS "Qualquer um pode votar" ON public.poll_votes;

CREATE POLICY "poll_votes_public_select"
ON public.poll_votes
FOR SELECT
TO public
USING (true);

CREATE POLICY "poll_votes_public_insert"
ON public.poll_votes
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "poll_votes_public_update"
ON public.poll_votes
FOR UPDATE
TO public
USING (true);

CREATE POLICY "poll_votes_public_delete"
ON public.poll_votes
FOR DELETE
TO public
USING (true);