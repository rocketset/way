-- Create case_content_blocks table
CREATE TABLE public.case_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('hero', 'why_choose', 'benefits', 'platform_ideal')),
  position INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Blocos de cases publicados são públicos"
ON public.case_content_blocks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = case_content_blocks.case_id
    AND cases.publicado = true
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Apenas admins podem criar blocos de cases"
ON public.case_content_blocks
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem atualizar blocos de cases"
ON public.case_content_blocks
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem deletar blocos de cases"
ON public.case_content_blocks
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_case_content_blocks_updated_at
BEFORE UPDATE ON public.case_content_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for better performance
CREATE INDEX idx_case_content_blocks_case_id ON public.case_content_blocks(case_id);
CREATE INDEX idx_case_content_blocks_block_type ON public.case_content_blocks(block_type);