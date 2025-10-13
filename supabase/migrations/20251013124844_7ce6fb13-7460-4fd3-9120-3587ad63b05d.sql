-- Função auxiliar para criar notificações para todos os clientes
CREATE OR REPLACE FUNCTION public.notify_all_clients(
  p_type text,
  p_title text,
  p_message text,
  p_link text DEFAULT NULL,
  p_icon text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insere notificação para todos os usuários com role 'cliente'
  INSERT INTO public.notifications (user_id, type, title, message, link, icon, read, created_at, updated_at)
  SELECT 
    ur.user_id,
    p_type,
    p_title,
    p_message,
    p_link,
    p_icon,
    false,
    now(),
    now()
  FROM public.user_roles ur
  WHERE ur.role = 'cliente';
END;
$$;

-- Trigger para novos posts publicados
CREATE OR REPLACE FUNCTION public.notify_new_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notifica apenas quando um post é publicado pela primeira vez
  IF (TG_OP = 'INSERT' AND NEW.publicado = true) OR 
     (TG_OP = 'UPDATE' AND OLD.publicado = false AND NEW.publicado = true) THEN
    
    PERFORM notify_all_clients(
      'post',
      'Novo post publicado',
      'O post "' || NEW.titulo || '" foi publicado no blog',
      '/blog/' || NEW.slug,
      'file'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para novos cases publicados
CREATE OR REPLACE FUNCTION public.notify_new_case()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notifica apenas quando um case é publicado pela primeira vez
  IF (TG_OP = 'INSERT' AND NEW.publicado = true) OR 
     (TG_OP = 'UPDATE' AND OLD.publicado = false AND NEW.publicado = true) THEN
    
    PERFORM notify_all_clients(
      'case',
      'Novo case publicado',
      'O case "' || NEW.titulo || '" foi publicado',
      '/cases/' || NEW.id,
      'briefcase'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para novos conteúdos da academy
CREATE OR REPLACE FUNCTION public.notify_new_academy_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notifica apenas quando um conteúdo é publicado pela primeira vez
  IF (TG_OP = 'INSERT' AND NEW.publicado = true) OR 
     (TG_OP = 'UPDATE' AND OLD.publicado = false AND NEW.publicado = true) THEN
    
    PERFORM notify_all_clients(
      'system',
      'Novo conteúdo na Academy',
      'O conteúdo "' || NEW.titulo || '" foi adicionado à Way Academy',
      '/admin/academy',
      'bell'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para novos colunistas
CREATE OR REPLACE FUNCTION public.notify_new_columnist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notifica quando um perfil se torna colunista
  IF (TG_OP = 'UPDATE' AND OLD.is_colunista = false AND NEW.is_colunista = true) THEN
    
    PERFORM notify_all_clients(
      'user',
      'Novo colunista',
      NEW.nome || ' agora é colunista do blog Way',
      '/colunista/' || NEW.id,
      'user'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Cria os triggers
DROP TRIGGER IF EXISTS trigger_notify_new_post ON public.posts;
CREATE TRIGGER trigger_notify_new_post
  AFTER INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_post();

DROP TRIGGER IF EXISTS trigger_notify_new_case ON public.cases;
CREATE TRIGGER trigger_notify_new_case
  AFTER INSERT OR UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_case();

DROP TRIGGER IF EXISTS trigger_notify_new_academy_content ON public.academy_content;
CREATE TRIGGER trigger_notify_new_academy_content
  AFTER INSERT OR UPDATE ON public.academy_content
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_academy_content();

DROP TRIGGER IF EXISTS trigger_notify_new_columnist ON public.profiles;
CREATE TRIGGER trigger_notify_new_columnist
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_columnist();