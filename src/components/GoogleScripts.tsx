import { Helmet } from "react-helmet";
import { useGoogleIntegrations } from "@/hooks/useGoogleIntegrations";

export const GoogleScripts = () => {
  const { data: config } = useGoogleIntegrations();

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
        <>
          <script>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${config.tag_manager_id}');
            `}
          </script>
          <noscript>
            {`<iframe src="https://www.googletagmanager.com/ns.html?id=${config.tag_manager_id}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
          </noscript>
        </>
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
