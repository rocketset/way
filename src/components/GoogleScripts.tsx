import { Helmet } from "react-helmet";
import { useGoogleIntegrations } from "@/hooks/useGoogleIntegrations";
import { useEffect } from "react";

export const GoogleScripts = () => {
  const { data: config } = useGoogleIntegrations();

  useEffect(() => {
    if (!config) return;

    // Google Tag Manager - adicionar no body
    if (config.tag_manager_id) {
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${config.tag_manager_id}`;
      iframe.height = "0";
      iframe.width = "0";
      iframe.style.display = "none";
      iframe.style.visibility = "hidden";
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, [config]);

  if (!config) return null;

  return (
    <Helmet>
      {/* Google Analytics */}
      {config.analytics_id && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${config.analytics_id}`}
          />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.analytics_id}');
            `}
          </script>
        </>
      )}

      {/* Google Tag Manager */}
      {config.tag_manager_id && (
        <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${config.tag_manager_id}');
          `}
        </script>
      )}

      {/* Google Search Console Verification */}
      {config.search_console_verification && (
        <meta
          name="google-site-verification"
          content={config.search_console_verification}
        />
      )}
    </Helmet>
  );
};
