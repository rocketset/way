-- Tabela para logos de clientes (carrossel)
CREATE TABLE public.client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela para logos de parceiros/certificados
CREATE TABLE public.partner_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_logos ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_logos
CREATE POLICY "Administradores podem gerenciar logos de clientes"
ON public.client_logos FOR ALL
USING (has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores podem gerenciar logos de clientes"
ON public.client_logos FOR ALL
USING (has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Todos podem ver logos de clientes ativos"
ON public.client_logos FOR SELECT
USING (ativo = true);

-- RLS policies for partner_logos
CREATE POLICY "Administradores podem gerenciar logos de parceiros"
ON public.partner_logos FOR ALL
USING (has_role(auth.uid(), 'administrador'));

CREATE POLICY "Gestores podem gerenciar logos de parceiros"
ON public.partner_logos FOR ALL
USING (has_role(auth.uid(), 'gestor_conteudo'));

CREATE POLICY "Todos podem ver logos de parceiros ativos"
ON public.partner_logos FOR SELECT
USING (ativo = true);

-- Triggers for updated_at
CREATE TRIGGER update_client_logos_updated_at
BEFORE UPDATE ON public.client_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_logos_updated_at
BEFORE UPDATE ON public.partner_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();