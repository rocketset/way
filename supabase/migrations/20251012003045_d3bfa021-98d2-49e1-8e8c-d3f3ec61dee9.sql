-- Criar tabela para materiais múltiplos por conteúdo
CREATE TABLE academy_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES academy_content(id) ON DELETE CASCADE,
  tipo_material TEXT NOT NULL CHECK (tipo_material IN ('curso', 'treinamento', 'guia', 'ebook', 'planilha', 'video')),
  nome TEXT NOT NULL,
  arquivo_url TEXT,
  formato TEXT NOT NULL,
  duracao TEXT,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Criar tabela para tracking de progresso
CREATE TABLE academy_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES academy_content(id) ON DELETE CASCADE,
  material_id UUID REFERENCES academy_materials(id) ON DELETE CASCADE,
  concluido BOOLEAN DEFAULT false,
  progresso INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, material_id)
);

-- Trigger para atualizar updated_at em academy_materials
CREATE TRIGGER update_academy_materials_updated_at
  BEFORE UPDATE ON academy_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em academy_progress
CREATE TRIGGER update_academy_progress_updated_at
  BEFORE UPDATE ON academy_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies para academy_materials
ALTER TABLE academy_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver materiais"
  ON academy_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM academy_content
      WHERE academy_content.id = academy_materials.content_id
      AND academy_content.publicado = true
    )
  );

CREATE POLICY "Administradores podem gerenciar materiais"
  ON academy_materials FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores de conteúdo podem gerenciar materiais"
  ON academy_materials FOR ALL
  USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

-- RLS Policies para academy_progress
ALTER TABLE academy_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver próprio progresso"
  ON academy_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar próprio progresso"
  ON academy_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprio progresso"
  ON academy_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem ver todo progresso"
  ON academy_progress FOR SELECT
  USING (has_role(auth.uid(), 'administrador'::app_role));