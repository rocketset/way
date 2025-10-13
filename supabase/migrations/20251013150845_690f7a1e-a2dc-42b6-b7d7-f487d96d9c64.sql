-- Migra dados existentes de cases para usar o novo campo content_status
UPDATE public.cases
SET content_status = CASE 
  WHEN publicado = true THEN 'publicado'::case_status
  ELSE 'rascunho'::case_status
END;

-- Atualiza política RLS para cases
DROP POLICY IF EXISTS "Cases publicados são visíveis para todos" ON public.cases;
CREATE POLICY "Cases publicados são visíveis para todos" 
ON public.cases
FOR SELECT
USING (content_status = 'publicado');

-- Atualiza política RLS para posts 
DROP POLICY IF EXISTS "Posts publicados são visíveis para todos" ON public.posts;
CREATE POLICY "Posts publicados são visíveis para todos" 
ON public.posts
FOR SELECT
USING (status = 'published' OR publicado = true);