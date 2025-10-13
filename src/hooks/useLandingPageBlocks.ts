import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BlockType = 
  | "hero" 
  | "features" 
  | "cta" 
  | "form" 
  | "testimonials" 
  | "pricing" 
  | "faq"
  | "text";

export interface LandingPageBlock {
  id: string;
  landing_page_id: string;
  block_type: BlockType;
  content: any;
  position: number;
  criado_em: string;
  atualizado_em: string;
}

export const useLandingPageBlocks = (landingPageId: string) => {
  return useQuery({
    queryKey: ["landing-page-blocks", landingPageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_blocks")
        .select("*")
        .eq("landing_page_id", landingPageId)
        .order("position", { ascending: true });

      if (error) throw error;
      return data as LandingPageBlock[];
    },
    enabled: !!landingPageId,
  });
};