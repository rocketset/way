import { Helmet } from "react-helmet";

export const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Way E-commerce",
    "url": "https://wayecommerce.com.br",
    "logo": "https://wayecommerce.com.br/logo-way.png",
    "description": "Fazemos seu e-commerce crescer com estratégia, tecnologia, integrações e performance.",
    "foundingDate": "2015",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressLocality": "Brasil"
    },
    "sameAs": [
      "https://www.instagram.com/wayecommerce",
      "https://www.linkedin.com/company/wayecommerce",
      "https://www.facebook.com/wayecommerce"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "Portuguese"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Way E-commerce",
    "image": "https://wayecommerce.com.br/logo-way.png",
    "@id": "https://wayecommerce.com.br",
    "url": "https://wayecommerce.com.br",
    "telephone": "+55",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "47"
    },
    "priceRange": "$$"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Way E-commerce",
    "url": "https://wayecommerce.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wayecommerce.com.br/blog?q={search_term_string}",
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
