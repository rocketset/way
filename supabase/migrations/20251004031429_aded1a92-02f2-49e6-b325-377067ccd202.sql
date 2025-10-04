-- Remover FK duplicada de posts -> categories
ALTER TABLE posts DROP CONSTRAINT IF EXISTS fk_posts_categoria;

-- Criar índice único para categories evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS categories_unique_name_type 
ON categories (lower(nome), tipo);

-- Criar tabela pivot para múltiplas categorias por post
CREATE TABLE IF NOT EXISTS post_categories (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, category_id)
);

-- Habilitar RLS na tabela post_categories
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode ver relações de categorias
CREATE POLICY "Relações de categorias são públicas"
ON post_categories
FOR SELECT
USING (true);

-- Política: apenas admins podem gerenciar relações
CREATE POLICY "Apenas admins podem gerenciar relações de categorias"
ON post_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));