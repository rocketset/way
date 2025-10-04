-- Criar bucket de storage para mídia
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-library',
  'media-library',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- Políticas de storage para o bucket media-library
CREATE POLICY "Admins podem fazer upload de mídia"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media-library' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins podem atualizar mídia"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media-library' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins podem deletar mídia"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'media-library' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Mídia é pública para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media-library');