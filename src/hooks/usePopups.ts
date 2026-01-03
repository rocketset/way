import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Popup {
  id: string;
  nome: string;
  tipo: 'anuncio' | 'lead' | 'cookie' | 'custom';
  ativo: boolean;
  titulo?: string;
  subtitulo?: string;
  descricao?: string;
  imagem_url?: string;
  cor_fundo: string;
  cor_texto: string;
  cor_botao: string;
  cor_texto_botao: string;
  texto_botao: string;
  link_botao?: string;
  abrir_nova_aba: boolean;
  campos_formulario: string[];
  texto_sucesso: string;
  gatilho: 'ao_carregar' | 'apos_segundos' | 'exit_intent';
  delay_segundos: number;
  paginas_alvo: string[];
  exibir_uma_vez: boolean;
  exibir_para_logados: boolean;
  exibir_para_visitantes: boolean;
  data_inicio?: string;
  data_fim?: string;
  prioridade: number;
  criado_em: string;
  atualizado_em: string;
}

export interface PopupLead {
  id: string;
  popup_id: string;
  nome?: string;
  email?: string;
  telefone?: string;
  dados_extras?: Record<string, unknown>;
  criado_em: string;
}

// Hook para listar todos os popups (admin)
export const usePopups = () => {
  return useQuery({
    queryKey: ["popups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popups")
        .select("*")
        .order("prioridade", { ascending: true })
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as Popup[];
    },
  });
};

// Hook para buscar um popup específico
export const usePopup = (id: string) => {
  return useQuery({
    queryKey: ["popup", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popups")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Popup;
    },
    enabled: !!id,
  });
};

// Hook para buscar popups ativos para uma página específica
export const useActivePopups = (currentPath: string) => {
  return useQuery({
    queryKey: ["active-popups", currentPath],
    queryFn: async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("popups")
        .select("*")
        .eq("ativo", true)
        .order("prioridade", { ascending: true });

      if (error) throw error;
      
      // Filtra popups baseado na página alvo e período
      const filteredPopups = (data as Popup[]).filter(popup => {
        // Verifica período
        if (popup.data_inicio && new Date(popup.data_inicio) > new Date(now)) return false;
        if (popup.data_fim && new Date(popup.data_fim) < new Date(now)) return false;
        
        // Verifica página alvo
        const paginas = popup.paginas_alvo || ['todas'];
        if (paginas.includes('todas')) return true;
        return paginas.some(pagina => currentPath === pagina || currentPath.startsWith(pagina));
      });

      return filteredPopups;
    },
  });
};

// Hook para criar popup
export const useCreatePopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (popup: Partial<Popup>) => {
      const { data, error } = await supabase
        .from("popups")
        .insert([popup] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
    },
  });
};

// Hook para atualizar popup
export const useUpdatePopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...popup }: Partial<Popup> & { id: string }) => {
      const { data, error } = await supabase
        .from("popups")
        .update(popup)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
      queryClient.invalidateQueries({ queryKey: ["popup", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["active-popups"] });
    },
  });
};

// Hook para deletar popup
export const useDeletePopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("popups")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
      queryClient.invalidateQueries({ queryKey: ["active-popups"] });
    },
  });
};

// Hook para criar lead
export const useCreatePopupLead = () => {
  return useMutation({
    mutationFn: async (lead: Omit<PopupLead, 'id' | 'criado_em'>) => {
      const { data, error } = await supabase
        .from("popup_leads")
        .insert([lead] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// Hook para listar leads de um popup
export const usePopupLeads = (popupId?: string) => {
  return useQuery({
    queryKey: ["popup-leads", popupId],
    queryFn: async () => {
      let query = supabase
        .from("popup_leads")
        .select("*, popups(nome)")
        .order("criado_em", { ascending: false });

      if (popupId) {
        query = query.eq("popup_id", popupId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

// Hook para registrar visualização
export const useRegisterPopupView = () => {
  return useMutation({
    mutationFn: async ({ popupId, visitorId, userId }: { popupId: string; visitorId: string; userId?: string }) => {
      const { error } = await supabase
        .from("popup_views")
        .upsert({
          popup_id: popupId,
          visitor_id: visitorId,
          user_id: userId,
        }, {
          onConflict: 'popup_id,visitor_id'
        });

      if (error && !error.message.includes('duplicate')) throw error;
    },
  });
};

// Hook para verificar se popup já foi visualizado
export const useCheckPopupViewed = (popupId: string, visitorId: string) => {
  return useQuery({
    queryKey: ["popup-viewed", popupId, visitorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popup_views")
        .select("id")
        .eq("popup_id", popupId)
        .eq("visitor_id", visitorId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!popupId && !!visitorId,
  });
};
