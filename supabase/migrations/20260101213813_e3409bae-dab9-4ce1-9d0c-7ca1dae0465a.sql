-- Adicionar coluna ordem para controlar a prioridade de exibição dos cases
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS ordem INTEGER DEFAULT 0;

-- Criar índice para ordenação eficiente
CREATE INDEX IF NOT EXISTS idx_cases_ordem ON public.cases(ordem);

-- Atualizar cases existentes com ordem baseada na data de criação (mais antigo = menor ordem)
WITH ordered_cases AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY criado_em ASC) as new_ordem
  FROM public.cases
)
UPDATE public.cases
SET ordem = ordered_cases.new_ordem
FROM ordered_cases
WHERE cases.id = ordered_cases.id;