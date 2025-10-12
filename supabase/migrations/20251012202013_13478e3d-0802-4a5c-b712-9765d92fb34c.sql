-- Remove triggers problemáticos
DROP TRIGGER IF EXISTS update_google_reviews_updated_at ON public.google_reviews;
DROP TRIGGER IF EXISTS update_google_place_config_updated_at ON public.google_place_config;

-- Atualizar Place ID para o formato correto
UPDATE google_place_config 
SET place_id = 'ChIJDYRjwm3drAcRVrkIpF2FByc'
WHERE place_id = '0x7adc5f01505567f:0x3bdecc5140edcfde';

-- Recriar triggers corretos
CREATE TRIGGER update_google_reviews_updated_at
  BEFORE UPDATE ON public.google_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_google_place_config_updated_at
  BEFORE UPDATE ON public.google_place_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();