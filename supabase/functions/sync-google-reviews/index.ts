import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GooglePlaceDetails {
  result: {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: Array<{
      author_name: string;
      author_url?: string;
      profile_photo_url?: string;
      rating: number;
      text: string;
      time: number;
      relative_time_description: string;
    }>;
  };
  status: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY not configured');
    }

    // Busca a configuração do place
    const { data: placeConfig } = await supabaseClient
      .from('google_place_config')
      .select('*')
      .single();

    if (!placeConfig) {
      throw new Error('Place configuration not found');
    }

    console.log('Fetching reviews for place:', placeConfig.place_id);

    // Busca detalhes do place incluindo avaliações
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeConfig.place_id}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}&language=pt-BR`;
    
    const response = await fetch(url);
    const data: GooglePlaceDetails = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    console.log('Received reviews:', data.result.reviews?.length || 0);

    // Atualiza configuração do place
    await supabaseClient
      .from('google_place_config')
      .update({
        place_name: data.result.name,
        rating: data.result.rating,
        user_ratings_total: data.result.user_ratings_total,
        last_synced_at: new Date().toISOString(),
      })
      .eq('id', placeConfig.id);

    // Limpa avaliações antigas
    await supabaseClient
      .from('google_reviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Insere novas avaliações
    if (data.result.reviews && data.result.reviews.length > 0) {
      const reviews = data.result.reviews.map((review) => ({
        author_name: review.author_name,
        author_url: review.author_url || null,
        profile_photo_url: review.profile_photo_url || null,
        rating: review.rating,
        text: review.text || null,
        time: new Date(review.time * 1000).toISOString(),
        relative_time_description: review.relative_time_description,
      }));

      const { error: insertError } = await supabaseClient
        .from('google_reviews')
        .insert(reviews);

      if (insertError) {
        console.error('Error inserting reviews:', insertError);
        throw insertError;
      }

      console.log('Successfully synced reviews');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        reviewsCount: data.result.reviews?.length || 0,
        rating: data.result.rating,
        totalReviews: data.result.user_ratings_total,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error syncing Google reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
