-- Add website URL field to partner_logos table
ALTER TABLE public.partner_logos 
ADD COLUMN IF NOT EXISTS site_url text;

-- Add comment to document the field
COMMENT ON COLUMN public.partner_logos.site_url IS 'Website URL of the partner';