-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  approved BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Comentários aprovados são públicos" 
ON public.comments 
FOR SELECT 
USING (approved = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Qualquer pessoa pode criar comentário" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar comentários" 
ON public.comments 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem deletar comentários" 
ON public.comments 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_approved ON public.comments(approved);