import { useGoogleIntegrations } from "@/hooks/useGoogleIntegrations";
import { useEffect } from "react";

export const GoogleScripts = () => {
  const { data: config } = useGoogleIntegrations();

  useEffect(() => {
    if (!config) return;

    // Google Analytics
    if (config.analytics_id && !document.querySelector(`script[src*="gtag/js?id=${config.analytics_id}"]`)) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics_id}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.analytics_id}');
      `;
      document.head.appendChild(script2);
    }

    // Google Tag Manager
    if (config.tag_manager_id && !document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${config.tag_manager_id}"]`)) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${config.tag_manager_id}');
      `;
      document.head.appendChild(script);

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

    // Google Search Console Verification
    if (config.search_console_verification && !document.querySelector('meta[name="google-site-verification"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      meta.content = config.search_console_verification;
      document.head.appendChild(meta);
    }
  }, [config]);

  return null;
};
