-- Atualizar constraint para aceitar text_columns
ALTER TABLE public.case_content_blocks
  DROP CONSTRAINT IF EXISTS case_content_blocks_block_type_check;

ALTER TABLE public.case_content_blocks
  ADD CONSTRAINT case_content_blocks_block_type_check
  CHECK (
    block_type = ANY (
      ARRAY[
        'hero'::text,
        'text_columns'::text,
        'benefits'::text,
        'why_choose'::text,
        'platform_ideal'::text
      ]
    )
  );