import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noindex?: boolean;
  schema?: object;
}

export const SEO = ({
  title,
  description,
  canonical,
  ogImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/YTHfcr8kKIPEfT4TOZCdJnu0eE23/social-images/social-1760489654323-Way-ecommerce.png",
  ogType = "website",
  keywords,
  noindex = false,
  schema
}: SEOProps) => {
  const fullTitle = `${title} | Way E-commerce`;
  const siteUrl = "https://wayecommerce.com.br";
  const fullCanonical = canonical || siteUrl;

  return (
    <Helmet>
      {/* Título e Descrição */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} 
      />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Way E-commerce" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
