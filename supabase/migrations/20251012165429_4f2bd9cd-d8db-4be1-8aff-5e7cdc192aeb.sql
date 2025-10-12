-- Atualizar constraint para permitir o tipo client_info
ALTER TABLE case_content_blocks 
DROP CONSTRAINT IF EXISTS case_content_blocks_block_type_check;

ALTER TABLE case_content_blocks 
ADD CONSTRAINT case_content_blocks_block_type_check 
CHECK (block_type IN ('hero', 'text_columns', 'benefits', 'client_info'));