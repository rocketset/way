import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LandingPage } from "./useLandingPages";

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