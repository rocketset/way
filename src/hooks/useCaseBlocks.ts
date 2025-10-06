import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroBlockContent {
  logo_pequena?: string;
  badge_text?: string;
  titulo: string;
  descricao: string;
  cta_text?: string;
  cta_url?: string;
  imagem_principal?: string;
  tags?: string[];
}

export interface WhyChooseBlockContent {
  titulo: string;
  paragrafo_1: string;
  paragrafo_2?: string;
  imagem?: string;
}

export interface BenefitItem {
  icon: string;
  titulo: string;
  descricao: string;
}

export interface BenefitsBlockContent {
  benefits: BenefitItem[];
}

export interface PlatformIdealBlockContent {
  titulo: string;
  descricao: string;
  imagem?: string;
  cta_text?: string;
  cta_url?: string;
}

export interface CaseBlock {
  id: string;
  case_id: string;
  block_type: "hero" | "why_choose" | "benefits" | "platform_ideal";
  position: number;
  content: HeroBlockContent | WhyChooseBlockContent | BenefitsBlockContent | PlatformIdealBlockContent;
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
