-- Habilitar RLS e criar políticas para todas as tabelas sem proteção

-- 1. case_content_blocks
ALTER TABLE public.case_content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cases publicados são visíveis para todos"
  ON public.case_content_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cases 
    WHERE cases.id = case_content_blocks.case_id AND cases.publicado = true
  ));

CREATE POLICY "Administradores podem gerenciar blocos"
  ON public.case_content_blocks FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar blocos"
  ON public.case_content_blocks FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

-- 2. case_tags
ALTER TABLE public.case_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver tags de cases"
  ON public.case_tags FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar tags de cases"
  ON public.case_tags FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar tags de cases"
  ON public.case_tags FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

-- 3. categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver categorias"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar categorias"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar categorias"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

-- 4. comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver comentários aprovados"
  ON public.comments FOR SELECT
  USING (approved = true);

CREATE POLICY "Usuários podem criar comentários"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Administradores podem gerenciar comentários"
  ON public.comments FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem aprovar comentários"
  ON public.comments FOR UPDATE
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

-- 5. contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem criar contatos"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Administradores podem ver contatos"
  ON public.contacts FOR SELECT
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Administradores podem atualizar contatos"
  ON public.contacts FOR UPDATE
  USING (public.has_role(auth.uid(), 'administrador'));

-- 6. post_categories
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver categorias de posts"
  ON public.post_categories FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar categorias de posts"
  ON public.post_categories FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar categorias de posts"
  ON public.post_categories FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Colunistas podem gerenciar categorias dos próprios posts"
  ON public.post_categories FOR ALL
  USING (
    public.has_role(auth.uid(), 'colunista') AND 
    EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_categories.post_id AND posts.autor_id = auth.uid())
  );

-- 7. post_meta
ALTER TABLE public.post_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver meta de posts publicados"
  ON public.post_meta FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = post_meta.post_id AND (posts.publicado = true OR posts.status = 'published')
  ));

CREATE POLICY "Administradores podem gerenciar meta"
  ON public.post_meta FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar meta"
  ON public.post_meta FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Colunistas podem gerenciar meta dos próprios posts"
  ON public.post_meta FOR ALL
  USING (
    public.has_role(auth.uid(), 'colunista') AND 
    EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_meta.post_id AND posts.autor_id = auth.uid())
  );

-- 8. post_revisions
ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administradores podem ver revisões"
  ON public.post_revisions FOR SELECT
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem ver revisões"
  ON public.post_revisions FOR SELECT
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Colunistas podem ver revisões dos próprios posts"
  ON public.post_revisions FOR SELECT
  USING (public.has_role(auth.uid(), 'colunista') AND auth.uid() = user_id);

CREATE POLICY "Sistema pode criar revisões"
  ON public.post_revisions FOR INSERT
  WITH CHECK (true);

-- 9. post_tags
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver tags de posts"
  ON public.post_tags FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar tags de posts"
  ON public.post_tags FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar tags de posts"
  ON public.post_tags FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Colunistas podem gerenciar tags dos próprios posts"
  ON public.post_tags FOR ALL
  USING (
    public.has_role(auth.uid(), 'colunista') AND 
    EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_tags.post_id AND posts.autor_id = auth.uid())
  );

-- 10. tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver tags"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Administradores podem gerenciar tags"
  ON public.tags FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar tags"
  ON public.tags FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

-- 11. polls
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver enquetes de posts publicados"
  ON public.polls FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = polls.post_id AND (posts.publicado = true OR posts.status = 'published')
  ));

CREATE POLICY "Administradores podem gerenciar enquetes"
  ON public.polls FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores de conteúdo podem gerenciar enquetes"
  ON public.polls FOR ALL
  USING (public.has_role(auth.uid(), 'gestor_conteudo'));

-- 12. poll_votes
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem votar em enquetes"
  ON public.poll_votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem ver próprios votos"
  ON public.poll_votes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem ver todos os votos"
  ON public.poll_votes FOR SELECT
  USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Administradores podem gerenciar votos"
  ON public.poll_votes FOR ALL
  USING (public.has_role(auth.uid(), 'administrador'));