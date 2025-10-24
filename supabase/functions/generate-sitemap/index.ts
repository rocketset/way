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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting sitemap generation...');

    const baseUrl = 'https://wayecommerce.com.br';
    const currentDate = new Date().toISOString().split('T')[0];

    // Buscar posts publicados
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('slug, atualizado_em')
      .eq('status', 'published')
      .eq('publicado', true)
      .order('atualizado_em', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      throw postsError;
    }

    // Buscar cases publicados
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id, atualizado_em')
      .eq('publicado', true)
      .order('atualizado_em', { ascending: false });

    if (casesError) {
      console.error('Error fetching cases:', casesError);
      throw casesError;
    }

    // Buscar landing pages publicadas
    const { data: landingPages, error: lpError } = await supabase
      .from('landing_pages')
      .select('slug, atualizado_em')
      .eq('publicado', true)
      .order('atualizado_em', { ascending: false });

    if (lpError) {
      console.error('Error fetching landing pages:', lpError);
      throw lpError;
    }

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

    let totalUrls = 0;

    // Adicionar URLs estáticas
    staticUrls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${url.loc}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += '  </url>\n';
      totalUrls++;
    });

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

    xml += '</urlset>';

    console.log(`Sitemap generated with ${totalUrls} URLs`);

    // Atualizar configuração do sitemap
    const { data: config } = await supabase
      .from('sitemap_config')
      .select('id')
      .maybeSingle();

    if (config) {
      await supabase
        .from('sitemap_config')
        .update({
          last_generated_at: new Date().toISOString(),
          total_urls: totalUrls,
          status: 'success',
        })
        .eq('id', config.id);
    } else {
      await supabase
        .from('sitemap_config')
        .insert({
          last_generated_at: new Date().toISOString(),
          total_urls: totalUrls,
          status: 'success',
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        totalUrls,
        xml 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Atualizar status para erro
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: config } = await supabase
      .from('sitemap_config')
      .select('id')
      .maybeSingle();

    if (config) {
      await supabase
        .from('sitemap_config')
        .update({ status: 'error' })
        .eq('id', config.id);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
