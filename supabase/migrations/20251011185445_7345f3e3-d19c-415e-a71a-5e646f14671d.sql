-- Corrigir função sem search_path
CREATE OR REPLACE FUNCTION public.calculate_reading_stats(p_content jsonb)
RETURNS TABLE(word_count integer, reading_time integer)
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_text TEXT := '';
  v_block JSONB;
  v_word_count INTEGER;
  v_reading_time INTEGER;
BEGIN
  -- Extrai texto de todos os blocos
  FOR v_block IN SELECT jsonb_array_elements(p_content)
  LOOP
    IF v_block->>'type' IN ('paragraph', 'heading', 'list', 'quote') THEN
      v_text := v_text || ' ' || COALESCE(v_block->>'content', '');
    END IF;
  END LOOP;
  
  -- Conta palavras (aproximado)
  v_word_count := array_length(regexp_split_to_array(trim(v_text), '\s+'), 1);
  v_word_count := COALESCE(v_word_count, 0);
  
  -- Calcula tempo de leitura (assumindo 200 palavras por minuto)
  v_reading_time := GREATEST(1, ROUND(v_word_count::NUMERIC / 200));
  
  RETURN QUERY SELECT v_word_count, v_reading_time;
END;
$$;