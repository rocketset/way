-- Drop existing policy that's causing issues
DROP POLICY IF EXISTS "Qualquer pessoa pode criar comentário" ON public.comments;

-- Create new policy that allows anonymous comments without user_id requirement
CREATE POLICY "Permitir criação de comentários"
ON public.comments
FOR INSERT
WITH CHECK (
  post_id IS NOT NULL 
  AND author_name IS NOT NULL 
  AND author_email IS NOT NULL 
  AND content IS NOT NULL
);