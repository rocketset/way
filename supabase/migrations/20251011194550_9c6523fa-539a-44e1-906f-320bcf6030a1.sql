-- Criar tabela para conteúdos da Way Academy
CREATE TABLE public.academy_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('curso', 'material')),
  formato TEXT NOT NULL CHECK (formato IN ('video', 'documento', 'pdf', 'zip')),
  duracao TEXT,
  arquivo_url TEXT,
  ordem INTEGER DEFAULT 0,
  publicado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  autor_id UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.academy_content ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Administradores podem gerenciar conteúdos academy"
ON public.academy_content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'administrador'
  )
);

CREATE POLICY "Gestores de conteúdo podem gerenciar conteúdos academy"
ON public.academy_content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'gestor_conteudo'
  )
);

CREATE POLICY "Usuários autenticados podem ver conteúdos publicados"
ON public.academy_content
FOR SELECT
TO authenticated
USING (publicado = true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_academy_content_updated_at
BEFORE UPDATE ON public.academy_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();