-- Adicionar coluna is_featured na tabela cases
ALTER TABLE public.cases
ADD COLUMN is_featured boolean DEFAULT false;