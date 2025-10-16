-- Limpa banner (imagem_url) do case especificado
UPDATE public.cases
SET imagem_url = NULL, atualizado_em = now()
WHERE id = '728d257f-0cae-4d14-aa1a-5623678bd2eb';