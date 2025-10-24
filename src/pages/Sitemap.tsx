import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Sitemap() {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const baseUrl = "https://wayecommerce.com.br";
        const currentDate = new Date().toISOString().split('T')[0];

        // Buscar posts publicados
        const { data: posts } = await supabase
          .from('posts')
          .select('slug, atualizado_em')
          .eq('status', 'published')
          .eq('publicado', true)
          .order('atualizado_em', { ascending: false });

        // Buscar cases publicados
        const { data: cases } = await supabase
          .from('cases')
          .select('id, atualizado_em')
          .eq('publicado', true)
          .order('atualizado_em', { ascending: false });

        // Buscar landing pages publicadas
        const { data: landingPages } = await supabase
          .from('landing_pages')
          .select('slug, atualizado_em')
          .eq('publicado', true)
          .order('atualizado_em', { ascending: false });

        // URLs estáticas
        const staticUrls = [
          { loc: '/', changefreq: 'weekly', priority: '1.0', lastmod: currentDate },
          { loc: '/why-way', changefreq: 'monthly', priority: '0.8', lastmod: currentDate },
          { loc: '/solucoes/implantacao-desenvolvimento', changefreq: 'monthly', priority: '0.9', lastmod: currentDate },
          { loc: '/solucoes/performance-marketing', changefreq: 'monthly', priority: '0.9', lastmod: currentDate },
          { loc: '/solucoes/consultoria', changefreq: 'monthly', priority: '0.9', lastmod: currentDate },
          { loc: '/solucoes/jornada', changefreq: 'monthly', priority: '0.9', lastmod: currentDate },
          { loc: '/cases', changefreq: 'weekly', priority: '0.8', lastmod: currentDate },
          { loc: '/blog', changefreq: 'daily', priority: '0.8', lastmod: currentDate },
          { loc: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: currentDate },
          { loc: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: currentDate },
        ];

        // Gerar XML do sitemap
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Adicionar URLs estáticas
        staticUrls.forEach(url => {
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}${url.loc}</loc>\n`;
          xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
          xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
          xml += `    <priority>${url.priority}</priority>\n`;
          xml += '  </url>\n';
        });

        // Adicionar posts do blog
        posts?.forEach(post => {
          if (post.slug) {
            const lastmod = post.atualizado_em ? new Date(post.atualizado_em).toISOString().split('T')[0] : currentDate;
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.7</priority>\n`;
            xml += '  </url>\n';
          }
        });

        // Adicionar cases
        cases?.forEach(caseItem => {
          const lastmod = caseItem.atualizado_em ? new Date(caseItem.atualizado_em).toISOString().split('T')[0] : currentDate;
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}/cases/${caseItem.id}</loc>\n`;
          xml += `    <lastmod>${lastmod}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.7</priority>\n`;
          xml += '  </url>\n';
        });

        // Adicionar landing pages
        landingPages?.forEach(lp => {
          if (lp.slug) {
            const lastmod = lp.atualizado_em ? new Date(lp.atualizado_em).toISOString().split('T')[0] : currentDate;
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/lp/${lp.slug}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += '  </url>\n';
          }
        });

        xml += '</urlset>';

        // Definir headers corretos para XML
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        // Criar link de download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Mostrar XML na tela também
        document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">${xml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
        
      } catch (error) {
        console.error('Erro ao gerar sitemap:', error);
        document.body.innerHTML = '<p style="padding: 20px;">Erro ao gerar sitemap. Verifique o console.</p>';
      }
    };

    generateSitemap();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <p>Gerando sitemap...</p>
    </div>
  );
}
