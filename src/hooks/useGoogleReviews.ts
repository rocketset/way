import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface GoogleReview {
  id: string;
  author_name: string;
  author_url: string | null;
  profile_photo_url: string | null;
  rating: number;
  text: string | null;
  time: string;
  relative_time_description: string;
}

export interface GooglePlaceConfig {
  id: string;
  place_id: string;
  place_name: string | null;
  rating: number | null;
  user_ratings_total: number | null;
  last_synced_at: string | null;
}

export const useGoogleReviews = () => {
  return useQuery({
    queryKey: ["google-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_reviews")
        .select("*")
        .order("time", { ascending: false });

      if (error) throw error;
      return data as GoogleReview[];
    },
  });
};

export const useGooglePlaceConfig = () => {
  return useQuery({
    queryKey: ["google-place-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_place_config")
        .select("*")
        .single();

      if (error) throw error;
      return data as GooglePlaceConfig;
    },
  });
};

export const useSyncGoogleReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("sync-google-reviews");

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["google-place-config"] });
      toast({
        title: "Avaliações sincronizadas",
        description: "As avaliações do Google foram atualizadas com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Error syncing reviews:", error);
      toast({
        title: "Erro ao sincronizar",
        description: "Não foi possível sincronizar as avaliações do Google.",
        variant: "destructive",
      });
    },
  });
};
