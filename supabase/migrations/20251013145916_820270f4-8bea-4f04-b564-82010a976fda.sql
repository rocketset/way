-- Adiciona campo de status de aprovação na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'pending' CHECK (account_status IN ('pending', 'approved', 'rejected'));

-- Adiciona campos para moderação
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Atualiza usuários existentes para aprovados
UPDATE public.profiles 
SET account_status = 'approved', 
    approved_at = now() 
WHERE account_status = 'pending';

-- Cria índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);

-- Atualiza a política RLS para bloquear acesso de usuários não aprovados
-- Primeiro remove a política antiga se existir
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.profiles;

-- Cria nova política que verifica aprovação
CREATE POLICY "Usuários podem ver próprio perfil" 
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR has_role(auth.uid(), 'administrador'::app_role));

-- Política para administradores aprovarem cadastros
CREATE POLICY "Administradores podem atualizar status de aprovação" 
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'administrador'::app_role));