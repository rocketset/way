-- Inserir usuário atual como admin se ainda não existir
-- Esta migração garante que há pelo menos um usuário admin
-- Você pode adicionar mais admins posteriormente através do console

INSERT INTO public.user_roles (user_id, role)
SELECT auth.uid(), 'admin'::app_role
WHERE auth.uid() IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  );