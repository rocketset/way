
-- Tabela de vagas
CREATE TABLE public.vagas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  requisitos TEXT,
  beneficios TEXT,
  tipo_contratacao TEXT NOT NULL DEFAULT 'CLT',
  modalidade TEXT NOT NULL DEFAULT 'presencial',
  area TEXT,
  nivel TEXT DEFAULT 'pleno',
  salario_visivel BOOLEAN DEFAULT false,
  faixa_salarial TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de candidaturas
CREATE TABLE public.candidaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  curriculo_url TEXT,
  mensagem TEXT,
  nivel_experiencia TEXT,
  pretensao_salarial TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  lido BOOLEAN DEFAULT false,
  notas_internas TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;

-- Políticas para vagas
CREATE POLICY "Vagas ativas são visíveis para todos"
ON public.vagas
FOR SELECT
USING (ativo = true);

CREATE POLICY "Administradores podem gerenciar vagas"
ON public.vagas
FOR ALL
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem gerenciar vagas"
ON public.vagas
FOR ALL
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

-- Políticas para candidaturas
CREATE POLICY "Qualquer um pode criar candidaturas"
ON public.candidaturas
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Administradores podem ver candidaturas"
ON public.candidaturas
FOR SELECT
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Administradores podem atualizar candidaturas"
ON public.candidaturas
FOR UPDATE
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Administradores podem deletar candidaturas"
ON public.candidaturas
FOR DELETE
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem ver candidaturas"
ON public.candidaturas
FOR SELECT
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

CREATE POLICY "Gestores podem atualizar candidaturas"
ON public.candidaturas
FOR UPDATE
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

-- Criar bucket para currículos
INSERT INTO storage.buckets (id, name, public) VALUES ('curriculos', 'curriculos', false);

-- Políticas de storage para currículos
CREATE POLICY "Qualquer um pode fazer upload de currículo"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'curriculos');

CREATE POLICY "Admins podem ver currículos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'curriculos' AND has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem ver currículos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'curriculos' AND has_role(auth.uid(), 'gestor_conteudo'::app_role));

-- Triggers para atualizar timestamp
CREATE TRIGGER update_vagas_updated_at
BEFORE UPDATE ON public.vagas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidaturas_updated_at
BEFORE UPDATE ON public.candidaturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
