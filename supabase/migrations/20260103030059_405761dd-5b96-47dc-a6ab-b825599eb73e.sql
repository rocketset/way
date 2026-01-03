-- Adiciona coluna status_lead nas tabelas contacts e popup_leads para o Kanban
-- Colunas: 'entrar_em_contato', 'em_contato', 'ganho', 'perdido'

-- Tabela contacts
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS status_lead text NOT NULL DEFAULT 'entrar_em_contato';

-- Tabela popup_leads
ALTER TABLE public.popup_leads 
ADD COLUMN IF NOT EXISTS status_lead text NOT NULL DEFAULT 'entrar_em_contato';

-- Adiciona índices para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_contacts_status_lead ON public.contacts(status_lead);
CREATE INDEX IF NOT EXISTS idx_popup_leads_status_lead ON public.popup_leads(status_lead);

-- Atualiza registros existentes para o status inicial
UPDATE public.contacts SET status_lead = 'entrar_em_contato' WHERE status_lead IS NULL;
UPDATE public.popup_leads SET status_lead = 'entrar_em_contato' WHERE status_lead IS NULL;