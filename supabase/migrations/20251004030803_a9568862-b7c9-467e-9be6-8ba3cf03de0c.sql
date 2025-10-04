-- Adicionar foreign keys para relacionamentos de posts

-- Foreign key para autor (profiles)
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_autor 
FOREIGN KEY (autor_id) 
REFERENCES profiles(id) 
ON DELETE SET NULL;

-- Foreign key para categoria
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_categoria 
FOREIGN KEY (categoria_id) 
REFERENCES categories(id) 
ON DELETE SET NULL;