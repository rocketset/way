import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string;
  noindex?: boolean;
  schema?: object;
  customHeadCode?: string;
  customBodyCode?: string;
}

export const SEO = ({
  title,
  description,
  canonical,
  ogImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/YTHfcr8kKIPEfT4TOZCdJnu0eE23/social-images/social-1760489654323-Way-ecommerce.png",
  ogType = "website",
  ogTitle,
  ogDescription,
  keywords,
  noindex = false,
  schema,
  customHeadCode,
  customBodyCode
}: SEOProps) => {
  const brandName = "Way E-commerce";
  const baseTitle = title.trim();
  const suffix = `| ${brandName}`;
  const normalize = (v: string) => v.replace(/\s+/g, " ").trim().toLowerCase();
  const fullTitle = normalize(baseTitle).endsWith(normalize(suffix))
    ? baseTitle
    : `${baseTitle} ${suffix}`;
  const siteUrl = "https://wayecommerce.com.br";
  const fullCanonical = canonical || siteUrl;

  // Use separate OG values if provided, otherwise fallback to title/description
  const finalOgTitle = ogTitle || fullTitle;
  const finalOgDescription = ogDescription || description;

  return (
    <>
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
        <meta property="og:title" content={finalOgTitle} />
        <meta property="og:description" content={finalOgDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={fullCanonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Way E-commerce" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalOgTitle} />
        <meta name="twitter:description" content={finalOgDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Schema.org JSON-LD */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}

        {/* Custom Head Code - rendered as raw HTML */}
        {customHeadCode && (
          <script type="text/javascript">
            {`
              (function() {
                var container = document.createElement('div');
                container.innerHTML = ${JSON.stringify(customHeadCode)};
                var scripts = container.querySelectorAll('script');
                scripts.forEach(function(script) {
                  var newScript = document.createElement('script');
                  if (script.type) newScript.type = script.type;
                  if (script.src) {
                    newScript.src = script.src;
                  } else {
                    newScript.textContent = script.textContent;
                  }
                  document.head.appendChild(newScript);
                });
                var nonScripts = container.querySelectorAll(':not(script)');
                nonScripts.forEach(function(el) {
                  document.head.appendChild(el.cloneNode(true));
                });
              })();
            `}
          </script>
        )}
      </Helmet>

      {/* Custom Body Code - injected before body close */}
      {customBodyCode && (
        <div 
          dangerouslySetInnerHTML={{ __html: customBodyCode }} 
          style={{ display: 'none' }}
          data-seo-body-code="true"
        />
      )}
    </>
  );
};
