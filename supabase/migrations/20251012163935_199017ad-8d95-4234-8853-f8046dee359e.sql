-- Adicionar suporte para novo tipo de bloco client_info
-- O tipo client_info terá: banner_url e sobre_cliente_texto
-- A validação do block_type será feita no nível da aplicação

COMMENT ON COLUMN case_content_blocks.block_type IS 'Tipos permitidos: hero, text_columns, benefits, client_info';