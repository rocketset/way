import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroBlockContent {
  logo_url?: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  tags?: string[];
  imagem_principal?: string;
}

export interface TextColumnsBlockContent {
  coluna_esquerda: string;
  coluna_direita: string;
}

export interface BenefitItem {
  icon: string;
  titulo: string;
  descricao: string;
}

export interface BenefitsBlockContent {
  benefits: BenefitItem[];
}

export interface CaseBlock {
  id: string;
  case_id: string;
  block_type: "hero" | "text_columns" | "benefits";
  position: number;
  content: HeroBlockContent | TextColumnsBlockContent | BenefitsBlockContent;
  criado_em: string;
  atualizado_em: string;
}

export const useCaseBlocks = (caseId: string) => {
  return useQuery({
    queryKey: ["case-blocks", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_content_blocks")
        .select("*")
        .eq("case_id", caseId)
        .order("position", { ascending: true });

      if (error) throw error;

      return (data || []) as unknown as CaseBlock[];
    },
    enabled: !!caseId,
  });
};
