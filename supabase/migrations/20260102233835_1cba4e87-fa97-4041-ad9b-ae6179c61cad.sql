-- Adicionar colunas para controlar onde cada intenção aparece
ALTER TABLE public.intencoes_cadastro
ADD COLUMN IF NOT EXISTS valor_slug text,
ADD COLUMN IF NOT EXISTS exibir_em text[] DEFAULT ARRAY['todos']::text[],
ADD COLUMN IF NOT EXISTS icone text DEFAULT 'briefcase',
ADD COLUMN IF NOT EXISTS cor_destaque text;

-- Comentários explicativos
COMMENT ON COLUMN public.intencoes_cadastro.valor_slug IS 'Valor usado como value no select (ex: implantacao, migracao)';
COMMENT ON COLUMN public.intencoes_cadastro.exibir_em IS 'Array de formulários onde a opção aparece: home, contato, consulting, implementation, performance, journey, todos';
COMMENT ON COLUMN public.intencoes_cadastro.icone IS 'Nome do ícone Lucide para exibir junto à opção';
COMMENT ON COLUMN public.intencoes_cadastro.cor_destaque IS 'Cor de destaque opcional para a opção';

-- Inserir dados iniciais se a tabela estiver vazia
INSERT INTO public.intencoes_cadastro (nome, valor_slug, descricao, exibir_em, ordem, ativo)
SELECT * FROM (VALUES
  ('Implantação de E-commerce', 'implantacao', 'Criar uma nova loja virtual do zero', ARRAY['todos']::text[], 1, true),
  ('Migração de Plataforma de E-commerce', 'migracao', 'Migrar de uma plataforma para outra', ARRAY['todos']::text[], 2, true),
  ('Quero vender mais pelo meu E-commerce', 'vender-mais', 'Estratégias para aumentar vendas', ARRAY['todos']::text[], 3, true),
  ('Quero vender em Marketplace', 'marketplace', 'Expandir vendas para marketplaces', ARRAY['todos']::text[], 4, true),
  ('Evolução/On-going', 'evolucao', 'Melhorias contínuas na operação', ARRAY['todos']::text[], 5, true),
  ('Parcerias Comerciais', 'parcerias', 'Proposta de parceria', ARRAY['todos']::text[], 6, true),
  ('Falar com o SAC', 'sac', 'Atendimento ao cliente', ARRAY['todos']::text[], 7, true)
) AS v(nome, valor_slug, descricao, exibir_em, ordem, ativo)
WHERE NOT EXISTS (SELECT 1 FROM public.intencoes_cadastro LIMIT 1);