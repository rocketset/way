-- Remove política que permite todos visualizarem categorias
DROP POLICY IF EXISTS "Todos podem ver categorias ativas" ON academy_categories;

-- Mantém apenas:
-- 1. Administradores podem gerenciar categorias (ALL)
-- 2. Clientes podem ver categorias ativas (SELECT)

-- A política de clientes já está correta, ela requer:
-- - ativo = true
-- - has_role(auth.uid(), 'cliente'::app_role)