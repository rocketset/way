import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Post {
  slug: string;
  atualizado_em: string;
}

interface Case {
  id: string;
  atualizado_em: string;
}

interface LandingPage {
  slug: string;
  atualizado_em: string;
}

interface Columnist {
  id: string;
  atualizado_em: string;
}

interface PageSeo {
  page_key: string;
  meta_title: string | null;
  page_name: string;
  ativo: boolean | null;
  noindex: boolean | null;
  atualizado_em: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Serving sitemap...');

    const baseUrl = 'https://wayecommerce.com.br';
    const currentDate = new Date().toISOString().split('T')[0];

    // Buscar configurações de SEO das páginas
    const { data: pageSeoData } = await supabase
      .from('page_seo')
      .select('page_key, meta_title, page_name, ativo, noindex, atualizado_em')
      .eq('ativo', true)
      .eq('noindex', false);

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

    // Buscar colunistas aprovados
    const { data: columnists } = await supabase
      .from('profiles')
      .select('id, atualizado_em')
      .eq('is_colunista', true)
      .eq('account_status', 'approved')
      .order('atualizado_em', { ascending: false });

    // Mapeamento de page_key para URL
    const pageKeyToUrl: Record<string, { loc: string; changefreq: string; priority: string }> = {
      'home': { loc: '/', changefreq: 'weekly', priority: '1.0' },
      'why-way': { loc: '/why-way', changefreq: 'monthly', priority: '0.8' },
      'implantacao': { loc: '/solucoes/implantacao-desenvolvimento', changefreq: 'monthly', priority: '0.9' },
      'performance': { loc: '/solucoes/performance-marketing', changefreq: 'monthly', priority: '0.9' },
      'consultoria': { loc: '/solucoes/consultoria', changefreq: 'monthly', priority: '0.9' },
      'jornada': { loc: '/solucoes/jornada', changefreq: 'monthly', priority: '0.9' },
      'cases': { loc: '/cases', changefreq: 'weekly', priority: '0.8' },
      'blog': { loc: '/blog', changefreq: 'daily', priority: '0.8' },
      'contato': { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
      'privacidade': { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
      'carreiras': { loc: '/carreiras', changefreq: 'monthly', priority: '0.6' },
    };

    // Gerar XML do sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    let totalUrls = 0;

    // Adicionar páginas estáticas baseadas no page_seo
    (pageSeoData as PageSeo[] || []).forEach(page => {
      const urlConfig = pageKeyToUrl[page.page_key];
      if (urlConfig) {
        const lastmod = page.atualizado_em ? new Date(page.atualizado_em).toISOString().split('T')[0] : currentDate;
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${urlConfig.loc}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${urlConfig.changefreq}</changefreq>\n`;
        xml += `    <priority>${urlConfig.priority}</priority>\n`;
        xml += '  </url>\n';
        totalUrls++;
      }
    });

    // Se não houver configuração de SEO, usar URLs estáticas padrão
    if (!pageSeoData || pageSeoData.length === 0) {
      const defaultUrls = [
        { loc: '/', changefreq: 'weekly', priority: '1.0' },
        { loc: '/why-way', changefreq: 'monthly', priority: '0.8' },
        { loc: '/solucoes/implantacao-desenvolvimento', changefreq: 'monthly', priority: '0.9' },
        { loc: '/solucoes/performance-marketing', changefreq: 'monthly', priority: '0.9' },
        { loc: '/solucoes/consultoria', changefreq: 'monthly', priority: '0.9' },
        { loc: '/solucoes/jornada', changefreq: 'monthly', priority: '0.9' },
        { loc: '/cases', changefreq: 'weekly', priority: '0.8' },
        { loc: '/blog', changefreq: 'daily', priority: '0.8' },
        { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
        { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
      ];
      
      defaultUrls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${url.loc}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
        totalUrls++;
      });
    }

    // Adicionar posts do blog
    (posts as Post[] || []).forEach(post => {
      if (post.slug) {
        const lastmod = post.atualizado_em ? new Date(post.atualizado_em).toISOString().split('T')[0] : currentDate;
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += '  </url>\n';
        totalUrls++;
      }
    });

    // Adicionar cases
    (cases as Case[] || []).forEach(caseItem => {
      const lastmod = caseItem.atualizado_em ? new Date(caseItem.atualizado_em).toISOString().split('T')[0] : currentDate;
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/cases/${caseItem.id}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
      totalUrls++;
    });

    // Adicionar landing pages
    (landingPages as LandingPage[] || []).forEach(lp => {
      if (lp.slug) {
        const lastmod = lp.atualizado_em ? new Date(lp.atualizado_em).toISOString().split('T')[0] : currentDate;
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/lp/${lp.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += '  </url>\n';
        totalUrls++;
      }
    });

    // Adicionar colunistas
    (columnists as Columnist[] || []).forEach(columnist => {
      const lastmod = columnist.atualizado_em ? new Date(columnist.atualizado_em).toISOString().split('T')[0] : currentDate;
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/colunista/${columnist.id}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += '  </url>\n';
      totalUrls++;
    });

    xml += '</urlset>';

    console.log(`Sitemap served with ${totalUrls} URLs`);

    // Retornar XML diretamente
    return new Response(xml, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Error generating sitemap: ${errorMessage}</message>
</error>`,
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
        status: 500,
      }
    );
  }
});
