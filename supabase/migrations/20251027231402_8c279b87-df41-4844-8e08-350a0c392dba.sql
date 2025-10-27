-- Criar tabela de briefings
CREATE TABLE public.briefings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informações Gerais
  nome_empresa TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  segmento TEXT NOT NULL,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  site_atual TEXT,
  responsavel_projeto TEXT NOT NULL,
  cargo_funcao TEXT,
  contato TEXT NOT NULL,
  data_inicio_projeto DATE,
  forma_juridica TEXT,
  
  -- Estrutura e Organização (respostas em JSONB para flexibilidade)
  estrutura_organizacao JSONB NOT NULL DEFAULT '{}',
  
  -- Sistemas e Integrações
  sistemas_integracoes JSONB NOT NULL DEFAULT '{}',
  
  -- Produtos e Fornecimento
  produtos_fornecimento JSONB NOT NULL DEFAULT '{}',
  
  -- Mercado e Estratégia
  mercado_estrategia JSONB NOT NULL DEFAULT '{}',
  
  -- Comunicação e Relacionamento
  comunicacao_relacionamento JSONB NOT NULL DEFAULT '{}',
  
  -- Operação e Logística
  operacao_logistica JSONB NOT NULL DEFAULT '{}',
  
  -- Observações Gerais
  observacoes_gerais TEXT,
  
  -- Status e controle
  status TEXT NOT NULL DEFAULT 'pending',
  lido BOOLEAN DEFAULT false,
  
  -- Timestamps
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Qualquer um pode criar briefings"
  ON public.briefings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Administradores podem ver todos os briefings"
  ON public.briefings
  FOR SELECT
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Administradores podem atualizar briefings"
  ON public.briefings
  FOR UPDATE
  USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Administradores podem deletar briefings"
  ON public.briefings
  FOR DELETE
  USING (has_role(auth.uid(), 'administrador'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_briefings_updated_at
  BEFORE UPDATE ON public.briefings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();