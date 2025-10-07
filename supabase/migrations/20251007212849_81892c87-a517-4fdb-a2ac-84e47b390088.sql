-- Adicionar campos para informações do colunista na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS cargo TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS site_pessoal TEXT,
ADD COLUMN IF NOT EXISTS is_colunista BOOLEAN DEFAULT false;

-- Criar política RLS para permitir que todos vejam perfis de colunistas
CREATE POLICY "Perfis de colunistas são públicos" 
ON public.profiles 
FOR SELECT 
USING (is_colunista = true OR auth.uid() = id);

-- Permitir que admins atualizem qualquer perfil
CREATE POLICY "Admins podem atualizar perfis" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));