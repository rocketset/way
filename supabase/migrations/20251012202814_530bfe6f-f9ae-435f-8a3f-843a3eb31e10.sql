-- Fix dynamic updated_at trigger to work across tables with either updated_at or atualizado_em
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atualiza a coluna de timestamp correta se existir na tabela
  IF (to_jsonb(NEW) ? 'updated_at') THEN
    NEW := jsonb_populate_record(NEW, jsonb_build_object('updated_at', now()));
  ELSIF (to_jsonb(NEW) ? 'atualizado_em') THEN
    NEW := jsonb_populate_record(NEW, jsonb_build_object('atualizado_em', now()));
  END IF;
  RETURN NEW;
END;
$$;