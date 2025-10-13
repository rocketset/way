-- Etapa 1: Criar enum para cases e adicionar novos valores ao post_status
DO $$ BEGIN
  CREATE TYPE case_status AS ENUM ('rascunho', 'em_edicao', 'publicado', 'excluido');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Adiciona novos valores ao enum post_status se ainda não existirem
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'rascunho' AND enumtypid = 'post_status'::regtype) THEN
    ALTER TYPE post_status ADD VALUE 'rascunho';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'em_edicao' AND enumtypid = 'post_status'::regtype) THEN
    ALTER TYPE post_status ADD VALUE 'em_edicao';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'excluido' AND enumtypid = 'post_status'::regtype) THEN
    ALTER TYPE post_status ADD VALUE 'excluido';
  END IF;
END $$;

-- Adiciona coluna content_status na tabela cases
ALTER TABLE public.cases
ADD COLUMN IF NOT EXISTS content_status case_status DEFAULT 'rascunho';