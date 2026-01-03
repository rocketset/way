-- Criar tabela de popups
CREATE TABLE public.popups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'anuncio', -- anuncio, lead, cookie, custom
  ativo BOOLEAN NOT NULL DEFAULT false,
  
  -- Conteúdo
  titulo TEXT,
  subtitulo TEXT,
  descricao TEXT,
  imagem_url TEXT,
  cor_fundo TEXT DEFAULT '#ffffff',
  cor_texto TEXT DEFAULT '#000000',
  cor_botao TEXT DEFAULT '#000000',
  cor_texto_botao TEXT DEFAULT '#ffffff',
  
  -- Botão de ação
  texto_botao TEXT DEFAULT 'Saiba mais',
  link_botao TEXT,
  abrir_nova_aba BOOLEAN DEFAULT false,
  
  -- Configurações de formulário (para tipo lead)
  campos_formulario JSONB DEFAULT '["nome", "email"]'::jsonb,
  texto_sucesso TEXT DEFAULT 'Obrigado! Entraremos em contato.',
  
  -- Gatilho de exibição
  gatilho TEXT NOT NULL DEFAULT 'ao_carregar', -- ao_carregar, apos_segundos, exit_intent
  delay_segundos INTEGER DEFAULT 0,
  
  -- Páginas alvo
  paginas_alvo JSONB DEFAULT '["todas"]'::jsonb, -- ["todas"] ou ["/", "/contato", "/blog"]
  
  -- Controle de exibição
  exibir_uma_vez BOOLEAN DEFAULT true,
  exibir_para_logados BOOLEAN DEFAULT true,
  exibir_para_visitantes BOOLEAN DEFAULT true,
  
  -- Período de exibição
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  
  -- Ordem de prioridade (menor = maior prioridade)
  prioridade INTEGER DEFAULT 0,
  
  -- Timestamps
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para registrar leads capturados pelos popups
CREATE TABLE public.popup_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  popup_id UUID NOT NULL REFERENCES public.popups(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  telefone TEXT,
  dados_extras JSONB DEFAULT '{}'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para controlar visualizações (evitar exibir múltiplas vezes)
CREATE TABLE public.popup_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  popup_id UUID NOT NULL REFERENCES public.popups(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL, -- fingerprint ou user_id
  user_id UUID,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(popup_id, visitor_id)
);

-- Enable RLS
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_views ENABLE ROW LEVEL SECURITY;

-- Policies para popups
CREATE POLICY "Administradores podem gerenciar popups" 
ON public.popups FOR ALL 
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem gerenciar popups" 
ON public.popups FOR ALL 
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

CREATE POLICY "Todos podem ver popups ativos" 
ON public.popups FOR SELECT 
USING (ativo = true);

-- Policies para popup_leads
CREATE POLICY "Administradores podem ver leads" 
ON public.popup_leads FOR SELECT 
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Gestores podem ver leads" 
ON public.popup_leads FOR SELECT 
USING (has_role(auth.uid(), 'gestor_conteudo'::app_role));

CREATE POLICY "Qualquer um pode criar leads" 
ON public.popup_leads FOR INSERT 
WITH CHECK (true);

-- Policies para popup_views
CREATE POLICY "Administradores podem ver views" 
ON public.popup_views FOR SELECT 
USING (has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Qualquer um pode criar views" 
ON public.popup_views FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Qualquer um pode ver próprios views" 
ON public.popup_views FOR SELECT 
USING (true);

-- Trigger para atualizar timestamp
CREATE TRIGGER update_popups_updated_at
BEFORE UPDATE ON public.popups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();