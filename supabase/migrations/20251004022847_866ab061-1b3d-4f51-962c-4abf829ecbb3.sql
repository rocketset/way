-- Remover políticas antigas do storage
DROP POLICY IF EXISTS "Admins podem fazer upload de mídia" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar mídia" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar mídia" ON storage.objects;
DROP POLICY IF EXISTS "Mídia é pública para leitura" ON storage.objects;

-- Criar políticas corretas para o bucket media-library
CREATE POLICY "Admins podem fazer upload de mídia"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media-library' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins podem atualizar mídia"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media-library' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins podem deletar mídia"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'media-library' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Mídia é pública para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media-library');