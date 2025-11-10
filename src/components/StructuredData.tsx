import { Helmet } from "react-helmet";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const StructuredData = () => {
  const { settings } = useSiteSettings();
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings?.company_name || "Way E-commerce",
    "url": settings?.site_url || "https://wayecommerce.com.br",
    "logo": settings?.logo_url || "https://wayecommerce.com.br/logo-way.png",
    "description": settings?.company_description || "Fazemos seu e-commerce crescer com estratégia, tecnologia, integrações e performance.",
    "foundingDate": settings?.company_founding_year || "2015",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": settings?.country || "BR",
      "addressLocality": settings?.city || "Brasil"
    },
    "sameAs": [
      settings?.instagram_url,
      settings?.linkedin_url,
      settings?.facebook_url,
      settings?.twitter_url,
      settings?.youtube_url,
    ].filter(Boolean),
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "Portuguese"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settings?.company_name || "Way E-commerce",
    "image": settings?.logo_url || "https://wayecommerce.com.br/logo-way.png",
    "@id": settings?.site_url || "https://wayecommerce.com.br",
    "url": settings?.site_url || "https://wayecommerce.com.br",
    "telephone": settings?.phone || "+55",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": settings?.country || "BR"
    },
    "geo": {
      "@type": "GeoCoordinates"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": settings?.rating_value?.toString() || "5.0",
      "reviewCount": settings?.review_count?.toString() || "47"
    },
    "priceRange": "$$"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": settings?.company_name || "Way E-commerce",
    "url": settings?.site_url || "https://wayecommerce.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${settings?.site_url || "https://wayecommerce.com.br"}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://wayecommerce.com.br"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Soluções",
        "item": "https://wayecommerce.com.br/#solucoes"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Cases",
        "item": "https://wayecommerce.com.br/cases"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Blog",
        "item": "https://wayecommerce.com.br/blog"
      }
    ]
  };

  return (
    <Helmet>
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};
