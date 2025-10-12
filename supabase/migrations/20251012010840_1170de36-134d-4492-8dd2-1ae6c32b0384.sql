-- Atualiza as políticas RLS para incluir 'cliente' onde 'membro' já tem acesso

-- Academy Categories: Clientes podem ver categorias ativas
CREATE POLICY "Clientes podem ver categorias ativas" 
ON public.academy_categories 
FOR SELECT 
USING (ativo = true AND has_role(auth.uid(), 'cliente'::app_role));

-- Academy Content: Clientes podem ver conteúdos publicados
CREATE POLICY "Clientes podem ver conteúdos publicados" 
ON public.academy_content 
FOR SELECT 
USING (publicado = true AND has_role(auth.uid(), 'cliente'::app_role));

-- Academy Materials: Clientes podem ver materiais de conteúdos publicados
CREATE POLICY "Clientes podem ver materiais" 
ON public.academy_materials 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM academy_content
    WHERE academy_content.id = academy_materials.content_id
      AND academy_content.publicado = true
  )
  AND has_role(auth.uid(), 'cliente'::app_role)
);

-- Academy Progress: Clientes podem ver, criar e atualizar seu próprio progresso
CREATE POLICY "Clientes podem ver próprio progresso" 
ON public.academy_progress 
FOR SELECT 
USING (auth.uid() = user_id AND has_role(auth.uid(), 'cliente'::app_role));

CREATE POLICY "Clientes podem criar próprio progresso" 
ON public.academy_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'cliente'::app_role));

CREATE POLICY "Clientes podem atualizar próprio progresso" 
ON public.academy_progress 
FOR UPDATE 
USING (auth.uid() = user_id AND has_role(auth.uid(), 'cliente'::app_role));

-- User Activity Logs: Clientes podem ver próprios logs
CREATE POLICY "Clientes podem ver próprios logs" 
ON public.user_activity_logs 
FOR SELECT 
USING (auth.uid() = user_id AND has_role(auth.uid(), 'cliente'::app_role));

-- Notifications: Clientes podem ver e atualizar próprias notificações
CREATE POLICY "Clientes podem ver próprias notificações" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id AND has_role(auth.uid(), 'cliente'::app_role));

CREATE POLICY "Clientes podem atualizar próprias notificações" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id AND has_role(auth.uid(), 'cliente'::app_role));