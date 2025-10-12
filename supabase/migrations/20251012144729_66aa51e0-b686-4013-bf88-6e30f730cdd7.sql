-- Adiciona política de INSERT para administradores criarem configurações
CREATE POLICY "Administradores podem criar configurações"
ON academy_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'administrador'::app_role));

-- Garante que existe um registro inicial
INSERT INTO academy_settings (banner_url, banner_titulo, banner_descricao)
SELECT '', 'Way Academy', 'Desenvolva suas habilidades com nossos cursos e materiais exclusivos'
WHERE NOT EXISTS (SELECT 1 FROM academy_settings LIMIT 1);