DROP POLICY IF EXISTS "Permitir criação de comentários" ON public.comments;
DROP POLICY IF EXISTS "Qualquer pessoa pode criar comentário" ON public.comments;

CREATE POLICY "Anon pode criar comentários"
ON public.comments FOR INSERT TO anon
WITH CHECK (
  post_id IS NOT NULL AND
  length(trim(author_name)) > 0 AND
  length(trim(author_email)) > 0 AND
  length(trim(content)) > 0
);

CREATE POLICY "Autenticados podem criar comentários"
ON public.comments FOR INSERT TO authenticated
WITH CHECK (
  post_id IS NOT NULL AND
  length(trim(author_name)) > 0 AND
  length(trim(author_email)) > 0 AND
  length(trim(content)) > 0
);
