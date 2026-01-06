import { usePageSeo } from "./usePageSeo";

/**
 * Hook para obter dados de SEO de uma página específica
 * Retorna os dados formatados para uso no componente SEO
 */
export const usePageSeoData = (pageKey: string) => {
  const { data: seoData, isLoading } = usePageSeo(pageKey);

  const getSeoProps = () => {
    if (!seoData) return null;

    return {
      title: seoData.meta_title || "",
      description: seoData.meta_description || "",
      keywords: seoData.meta_keywords || undefined,
      canonical: seoData.canonical_url || undefined,
      ogImage: seoData.og_image || undefined,
      ogTitle: seoData.og_title || undefined,
      ogDescription: seoData.og_description || undefined,
      noindex: seoData.noindex || false,
      customHeadCode: seoData.custom_head_code || undefined,
      customBodyCode: seoData.custom_body_code || undefined,
    };
  };

  return {
    seoData,
    isLoading,
    getSeoProps,
    customHeadCode: seoData?.custom_head_code || undefined,
    customBodyCode: seoData?.custom_body_code || undefined,
  };
};
