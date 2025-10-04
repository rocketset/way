-- Adicionar coluna is_featured na tabela posts
ALTER TABLE public.posts
ADD COLUMN is_featured BOOLEAN DEFAULT false;