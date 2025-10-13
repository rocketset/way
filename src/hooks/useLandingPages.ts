import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LandingPage {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  publicado: boolean;
  criado_em: string;
  atualizado_em: string;
  autor_id: string | null;
}

export const useLandingPages = () => {
  return useQuery({
    queryKey: ["landing-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as LandingPage[];
    },
  });
};

export const useLandingPage = (slug: string) => {
  return useQuery({
    queryKey: ["landing-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", slug)
        .eq("publicado", true)
        .single();

      if (error) throw error;
      return data as LandingPage;
    },
    enabled: !!slug,
  });
};

export const useLandingPageById = (id: string) => {
  return useQuery({
    queryKey: ["landing-page-by-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as LandingPage;
    },
    enabled: !!id,
  });
};