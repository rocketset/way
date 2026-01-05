-- Tabela para os Hubs de diagnóstico (categorias)
CREATE TABLE public.diagnostic_hubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'BarChart3',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para as Ferramentas de diagnóstico
CREATE TABLE public.diagnostic_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES public.diagnostic_hubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  importance TEXT NOT NULL DEFAULT 'Alta',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diagnostic_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_tools ENABLE ROW LEVEL SECURITY;

-- Políticas para diagnostic_hubs - leitura pública (para o quiz funcionar)
CREATE POLICY "Hubs são visíveis publicamente" 
ON public.diagnostic_hubs 
FOR SELECT 
USING (ativo = true);

-- Políticas para diagnostic_hubs - admin pode tudo
CREATE POLICY "Admin pode gerenciar hubs" 
ON public.diagnostic_hubs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('administrador', 'gestor_conteudo')
  )
);

-- Políticas para diagnostic_tools - leitura pública
CREATE POLICY "Ferramentas são visíveis publicamente" 
ON public.diagnostic_tools 
FOR SELECT 
USING (ativo = true);

-- Políticas para diagnostic_tools - admin pode tudo
CREATE POLICY "Admin pode gerenciar ferramentas" 
ON public.diagnostic_tools 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('administrador', 'gestor_conteudo')
  )
);

-- Triggers para atualizar timestamp
CREATE TRIGGER update_diagnostic_hubs_updated_at
BEFORE UPDATE ON public.diagnostic_hubs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diagnostic_tools_updated_at
BEFORE UPDATE ON public.diagnostic_tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais (os hubs e ferramentas que já existem no código)
INSERT INTO public.diagnostic_hubs (name, icon, ordem) VALUES
('Marketing e Tráfego', 'BarChart3', 1),
('Relacionamento e Fidelização', 'Users', 2),
('Gestão e Operação', 'Settings', 3),
('Comercial e Conversão', 'ShoppingCart', 4),
('Financeiro e Análise', 'DollarSign', 5);

-- Ferramentas do Hub 1 - Marketing e Tráfego
INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Google Analytics 4', 'Ferramenta essencial para análise de tráfego e comportamento dos visitantes', 'Alta', 1
FROM public.diagnostic_hubs WHERE name = 'Marketing e Tráfego';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Google Tag Manager', 'Gerenciador de tags para rastreamento avançado de conversões', 'Alta', 2
FROM public.diagnostic_hubs WHERE name = 'Marketing e Tráfego';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Meta Ads (Facebook/Instagram)', 'Plataforma de anúncios para redes sociais', 'Alta', 3
FROM public.diagnostic_hubs WHERE name = 'Marketing e Tráfego';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Google Ads', 'Plataforma de anúncios do Google para buscas e display', 'Alta', 4
FROM public.diagnostic_hubs WHERE name = 'Marketing e Tráfego';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'SEO Técnico Implementado', 'Otimização para mecanismos de busca', 'Média', 5
FROM public.diagnostic_hubs WHERE name = 'Marketing e Tráfego';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Blog com Conteúdo Atualizado', 'Estratégia de marketing de conteúdo', 'Média', 6
FROM public.diagnostic_hubs WHERE name = 'Marketing e Tráfego';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Remarketing Configurado', 'Campanhas para reengajar visitantes', 'Alta', 7
FROM public.diagnostic_hubs WHERE name = 'Marketing e Tráfego';

-- Ferramentas do Hub 2 - Relacionamento e Fidelização
INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'E-mail Marketing', 'Ferramenta para campanhas de e-mail', 'Alta', 1
FROM public.diagnostic_hubs WHERE name = 'Relacionamento e Fidelização';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Automação de E-mails', 'Fluxos automáticos de nutrição de leads', 'Alta', 2
FROM public.diagnostic_hubs WHERE name = 'Relacionamento e Fidelização';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'WhatsApp Business API', 'Comunicação profissional via WhatsApp', 'Alta', 3
FROM public.diagnostic_hubs WHERE name = 'Relacionamento e Fidelização';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'CRM Integrado', 'Sistema de gestão de relacionamento com clientes', 'Alta', 4
FROM public.diagnostic_hubs WHERE name = 'Relacionamento e Fidelização';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Programa de Fidelidade', 'Sistema de pontos ou benefícios para clientes', 'Média', 5
FROM public.diagnostic_hubs WHERE name = 'Relacionamento e Fidelização';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Pesquisa NPS', 'Medição de satisfação do cliente', 'Média', 6
FROM public.diagnostic_hubs WHERE name = 'Relacionamento e Fidelização';

-- Ferramentas do Hub 3 - Gestão e Operação
INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'ERP Integrado', 'Sistema de gestão empresarial', 'Alta', 1
FROM public.diagnostic_hubs WHERE name = 'Gestão e Operação';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Gestão de Estoque Automatizada', 'Controle automático de inventário', 'Alta', 2
FROM public.diagnostic_hubs WHERE name = 'Gestão e Operação';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Múltiplos Canais de Venda', 'Integração com marketplaces', 'Alta', 3
FROM public.diagnostic_hubs WHERE name = 'Gestão e Operação';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Logística Integrada', 'Gestão de entregas e fretes', 'Alta', 4
FROM public.diagnostic_hubs WHERE name = 'Gestão e Operação';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Atendimento Omnichannel', 'Suporte integrado em múltiplos canais', 'Média', 5
FROM public.diagnostic_hubs WHERE name = 'Gestão e Operação';

-- Ferramentas do Hub 4 - Comercial e Conversão
INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Checkout Otimizado', 'Processo de compra simplificado', 'Alta', 1
FROM public.diagnostic_hubs WHERE name = 'Comercial e Conversão';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Recuperação de Carrinho', 'Automação para carrinhos abandonados', 'Alta', 2
FROM public.diagnostic_hubs WHERE name = 'Comercial e Conversão';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Avaliações de Produtos', 'Sistema de reviews dos clientes', 'Média', 3
FROM public.diagnostic_hubs WHERE name = 'Comercial e Conversão';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Recomendação de Produtos', 'Sistema de sugestões personalizadas', 'Alta', 4
FROM public.diagnostic_hubs WHERE name = 'Comercial e Conversão';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Cupons e Promoções', 'Gestão de descontos e ofertas', 'Média', 5
FROM public.diagnostic_hubs WHERE name = 'Comercial e Conversão';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Live Commerce', 'Vendas ao vivo por streaming', 'Baixa', 6
FROM public.diagnostic_hubs WHERE name = 'Comercial e Conversão';

-- Ferramentas do Hub 5 - Financeiro e Análise
INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Dashboard de Métricas', 'Painel com KPIs do negócio', 'Alta', 1
FROM public.diagnostic_hubs WHERE name = 'Financeiro e Análise';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Análise de Margem por Produto', 'Controle de rentabilidade', 'Alta', 2
FROM public.diagnostic_hubs WHERE name = 'Financeiro e Análise';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Conciliação Financeira', 'Conferência automática de pagamentos', 'Alta', 3
FROM public.diagnostic_hubs WHERE name = 'Financeiro e Análise';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Múltiplos Meios de Pagamento', 'Diversidade de opções de pagamento', 'Alta', 4
FROM public.diagnostic_hubs WHERE name = 'Financeiro e Análise';

INSERT INTO public.diagnostic_tools (hub_id, name, description, importance, ordem)
SELECT id, 'Análise de Cohort', 'Estudo de comportamento de grupos de clientes', 'Média', 5
FROM public.diagnostic_hubs WHERE name = 'Financeiro e Análise';