-- Create table for gallery photos
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Administradores podem gerenciar fotos da galeria"
ON public.gallery_photos
FOR ALL
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem gerenciar fotos da galeria"
ON public.gallery_photos
FOR ALL
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

CREATE POLICY "Todos podem ver fotos ativas"
ON public.gallery_photos
FOR SELECT
USING (ativo = true);

-- Trigger for updated_at
CREATE TRIGGER update_gallery_photos_updated_at
BEFORE UPDATE ON public.gallery_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();