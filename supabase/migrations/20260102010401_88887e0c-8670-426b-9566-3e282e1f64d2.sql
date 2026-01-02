-- Add display location field to client_logos table
-- Options: 'carousel' (only carousel) or 'both' (carousel and grid)
ALTER TABLE public.client_logos 
ADD COLUMN IF NOT EXISTS exibir_em text NOT NULL DEFAULT 'both';

-- Add comment to document the field
COMMENT ON COLUMN public.client_logos.exibir_em IS 'Where the logo should be displayed: carousel (only carousel) or both (carousel and grid below cases)';