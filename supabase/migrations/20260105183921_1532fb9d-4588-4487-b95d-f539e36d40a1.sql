-- Create diagnostic_records table
CREATE TABLE public.diagnostic_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  store_url TEXT NOT NULL,
  instagram TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  lido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.diagnostic_records ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can INSERT (public form submission)
CREATE POLICY "Anyone can submit diagnostic"
ON public.diagnostic_records
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins and content managers can SELECT
CREATE POLICY "Admins and managers can view diagnostics"
ON public.diagnostic_records
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('administrador', 'gestor_conteudo')
  )
);

-- Policy: Only admins and managers can UPDATE
CREATE POLICY "Admins and managers can update diagnostics"
ON public.diagnostic_records
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('administrador', 'gestor_conteudo')
  )
);

-- Policy: Only admins can DELETE
CREATE POLICY "Admins can delete diagnostics"
ON public.diagnostic_records
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'administrador'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_diagnostic_records_updated_at
BEFORE UPDATE ON public.diagnostic_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();