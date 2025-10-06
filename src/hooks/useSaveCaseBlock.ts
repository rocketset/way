import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { CaseBlock } from "./useCaseBlocks";

interface SaveBlockParams {
  caseId: string;
  blockType: CaseBlock["block_type"];
  content: CaseBlock["content"];
  position?: number;
  blockId?: string;
}

export const useSaveCaseBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId, blockType, content, position = 0, blockId }: SaveBlockParams) => {
      if (blockId) {
        // Update existing block
        const { data, error } = await supabase
          .from("case_content_blocks")
          .update({ content: content as any, position })
          .eq("id", blockId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new block
        const { data, error } = await supabase
          .from("case_content_blocks")
          .insert([{
            case_id: caseId,
            block_type: blockType,
            content: content as any,
            position,
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-blocks", variables.caseId] });
      toast({
        title: "Bloco salvo",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error saving block:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o bloco. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
