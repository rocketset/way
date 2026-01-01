import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GalleryPhoto {
  id: string;
  image_url: string;
  alt_text: string | null;
  ordem: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const useGalleryPhotos = (onlyActive = true) => {
  return useQuery({
    queryKey: ["gallery-photos", onlyActive],
    queryFn: async () => {
      let query = supabase
        .from("gallery_photos")
        .select("*")
        .order("ordem", { ascending: true });

      if (onlyActive) {
        query = query.eq("ativo", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GalleryPhoto[];
    },
  });
};

export const useCreateGalleryPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: { image_url: string; alt_text?: string; ordem?: number; ativo?: boolean }) => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .insert([photo])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast.success("Foto adicionada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar foto");
      console.error(error);
    },
  });
};

export const useUpdateGalleryPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GalleryPhoto> & { id: string }) => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast.success("Foto atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar foto");
      console.error(error);
    },
  });
};

export const useDeleteGalleryPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast.success("Foto removida com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover foto");
      console.error(error);
    },
  });
};
