-- ============================================
-- ACADEMY_CONTENT: Remover acesso de usuários autenticados genéricos
-- ============================================

-- Remove política que permite usuários autenticados genéricos visualizarem
DROP POLICY IF EXISTS "Usuários autenticados podem ver conteúdos publicados" ON academy_content;

-- Mantém apenas:
-- 1. Administradores podem gerenciar (ALL)
-- 2. Clientes podem ver conteúdos publicados (SELECT) - já existe
-- 3. Gestores de conteúdo podem gerenciar (ALL)

-- ============================================
-- ACADEMY_SETTINGS: Restringir acesso às configurações
-- ============================================

-- Remove política que permite todos visualizarem configurações
DROP POLICY IF EXISTS "Todos podem ver configurações" ON academy_settings;

-- Adiciona política para clientes visualizarem configurações
CREATE POLICY "Clientes podem ver configurações"
ON academy_settings
FOR SELECT
USING (has_role(auth.uid(), 'cliente'::app_role));

-- Mantém:
-- 1. Administradores podem atualizar configurações (UPDATE) - já existe