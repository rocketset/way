-- Remove todas as políticas existentes da tabela contacts
DROP POLICY IF EXISTS "Administradores podem atualizar contatos" ON public.contacts;
DROP POLICY IF EXISTS "Administradores podem ver contatos" ON public.contacts;
DROP POLICY IF EXISTS "Usuários podem criar contatos" ON public.contacts;
DROP POLICY IF EXISTS "Todos podem ver contatos" ON public.contacts;
DROP POLICY IF EXISTS "Public can view contacts" ON public.contacts;

-- Recria as políticas de forma segura
-- Apenas administradores podem ver contatos
CREATE POLICY "Administradores podem ver contatos" 
ON public.contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Apenas administradores podem atualizar contatos
CREATE POLICY "Administradores podem atualizar contatos" 
ON public.contacts 
FOR UPDATE 
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Apenas administradores podem deletar contatos
CREATE POLICY "Administradores podem deletar contatos" 
ON public.contacts 
FOR DELETE 
USING (has_role(auth.uid(), 'administrador'::app_role));

-- Qualquer pessoa pode criar contatos (necessário para formulário público)
CREATE POLICY "Usuários podem criar contatos" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);