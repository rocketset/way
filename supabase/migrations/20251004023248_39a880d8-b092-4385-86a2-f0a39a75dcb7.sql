-- Remover todas as políticas antigas do storage para media-library
DROP POLICY IF EXISTS "Admins podem fazer upload de mídia" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar mídia" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar mídia" ON storage.objects;
DROP POLICY IF EXISTS "Mídia é pública para leitura" ON storage.objects;

-- Criar políticas permissivas para storage (bucket media-library)
CREATE POLICY "Leitura pública de mídia"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media-library');

CREATE POLICY "Upload autenticado"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-library');

CREATE POLICY "Atualização autenticada"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media-library');

CREATE POLICY "Exclusão autenticada"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media-library');

-- Remover todas as políticas antigas da tabela media_library
DROP POLICY IF EXISTS "Admins podem ver toda a biblioteca" ON public.media_library;
DROP POLICY IF EXISTS "Admins podem fazer upload" ON public.media_library;
DROP POLICY IF EXISTS "Admins podem atualizar mídia" ON public.media_library;
DROP POLICY IF EXISTS "Admins podem deletar mídia" ON public.media_library;

-- Criar políticas permissivas para a tabela media_library
CREATE POLICY "Ver mídia (autenticado)"
ON public.media_library
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Inserir mídia (autenticado)"
ON public.media_library
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Atualizar mídia (autenticado)"
ON public.media_library
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Deletar mídia (autenticado)"
ON public.media_library
FOR DELETE
TO authenticated
USING (true);