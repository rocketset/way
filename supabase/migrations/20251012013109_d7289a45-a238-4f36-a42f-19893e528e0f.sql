-- Criar tabela para armazenar o conteúdo do Guia de Boas Práticas
CREATE TABLE public.conduct_guide_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  section_title text NOT NULL,
  section_description text,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.conduct_guide_content ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Todos podem ver conteúdo ativo"
  ON public.conduct_guide_content
  FOR SELECT
  USING (ativo = true);

CREATE POLICY "Administradores podem gerenciar conteúdo"
  ON public.conduct_guide_content
  FOR ALL
  USING (has_role(auth.uid(), 'administrador'::app_role));

-- Trigger para atualizar data de modificação
CREATE TRIGGER update_conduct_guide_content_updated_at
  BEFORE UPDATE ON public.conduct_guide_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir conteúdo inicial
INSERT INTO public.conduct_guide_content (section_key, section_title, section_description, content, ordem) VALUES
('valores', 'Nossos Valores', 'Compromissos fundamentais que guiam nossa comunidade', '[
  {"title": "Respeito Mútuo", "content": "Tratamos todos os membros com dignidade e consideração, valorizando a diversidade de opiniões e experiências."},
  {"title": "Colaboração", "content": "Trabalhamos juntos para alcançar objetivos comuns, compartilhando conhecimento e apoiando o crescimento de todos."},
  {"title": "Integridade", "content": "Agimos com honestidade e transparência em todas as nossas interações, mantendo altos padrões éticos."}
]'::jsonb, 1),

('codigo_conduta', 'Código de Conduta', 'Diretrizes para uma convivência harmoniosa', '[
  {
    "title": "Comunicação Respeitosa",
    "items": [
      "Use linguagem apropriada e profissional",
      "Evite comentários ofensivos ou discriminatórios",
      "Seja construtivo nas críticas e feedbacks",
      "Ouça ativamente e valorize diferentes perspectivas"
    ]
  },
  {
    "title": "Confidencialidade",
    "items": [
      "Respeite a privacidade dos outros membros",
      "Não compartilhe informações confidenciais sem autorização",
      "Proteja dados sensíveis da organização e clientes"
    ]
  },
  {
    "title": "Responsabilidade",
    "items": [
      "Cumpra prazos e compromissos assumidos",
      "Assuma responsabilidade por suas ações e decisões",
      "Comunique proativamente sobre desafios ou atrasos"
    ]
  }
]'::jsonb, 2),

('boas_praticas', 'Boas Práticas Profissionais', 'Recomendações para excelência no trabalho', '[
  {
    "title": "Organização e Planejamento",
    "items": [
      "Mantenha documentação clara e atualizada",
      "Use ferramentas de gestão de projetos de forma eficaz",
      "Priorize tarefas de acordo com impacto e urgência"
    ]
  },
  {
    "title": "Aprendizado Contínuo",
    "items": [
      "Busque constantemente novos conhecimentos",
      "Compartilhe aprendizados com a equipe",
      "Participe ativamente de treinamentos e workshops"
    ]
  },
  {
    "title": "Qualidade e Excelência",
    "items": [
      "Revise seu trabalho antes de compartilhar",
      "Busque feedback para melhorias contínuas",
      "Mantenha padrões elevados de qualidade"
    ]
  }
]'::jsonb, 3),

('reporte_violacoes', 'Reporte de Violações', 'Como proceder em caso de descumprimento das diretrizes', '[
  {
    "content": "Se você presenciar ou vivenciar uma situação que viole nosso código de conduta:",
    "items": [
      "Relate o ocorrido ao seu gestor imediato ou à equipe de RH",
      "Forneça detalhes específicos sobre o incidente",
      "Todas as denúncias serão tratadas com confidencialidade",
      "Não haverá retaliação contra quem reportar violações de boa-fé"
    ]
  }
]'::jsonb, 4);