-- Remove a política restritiva existente
DROP POLICY IF EXISTS "Apenas admins podem gerenciar relações de categorias" ON public.post_categories;

-- Cria políticas mais permissivas para INSERT
CREATE POLICY "Admins e autores podem inserir relações de categorias"
ON public.post_categories
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = post_categories.post_id
    AND posts.autor_id = auth.uid()
  )
);

-- Cria políticas para DELETE
CREATE POLICY "Admins e autores podem deletar relações de categorias"
ON public.post_categories
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = post_categories.post_id
    AND posts.autor_id = auth.uid()
  )
);

-- Cria políticas para UPDATE
CREATE POLICY "Admins e autores podem atualizar relações de categorias"
ON public.post_categories
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = post_categories.post_id
    AND posts.autor_id = auth.uid()
  )
);