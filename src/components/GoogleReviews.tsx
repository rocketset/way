import { Star } from "lucide-react";
import { useGoogleReviews, useGooglePlaceConfig } from "@/hooks/useGoogleReviews";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const GoogleReviews = () => {
  const {
    data: reviews,
    isLoading: reviewsLoading
  } = useGoogleReviews();
  const {
    data: placeConfig,
    isLoading: configLoading
  } = useGooglePlaceConfig();
  if (reviewsLoading || configLoading) {
    return <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </section>;
  }
  if (!reviews || reviews.length === 0) {
    return null;
  }
  const renderStars = (rating: number) => {
    return <div className="flex gap-1">
        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
      </div>;
  };
  return <section className="relative py-12 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-3xl mx-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-4">
            Avaliações no Google
          </h2>
          {placeConfig && <div className="flex items-center justify-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(placeConfig.rating || 0))}
                <span className="text-2xl font-bold text-white">
                  {placeConfig.rating?.toFixed(1)}
                </span>
              </div>
              <span>•</span>
              <span>
                {placeConfig.user_ratings_total} avaliações
              </span>
            </div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map(review => (
            <Card key={review.id} className="hover:shadow-lg hover:shadow-[0_0_30px_rgba(252,211,77,0.3)] transition-all duration-300 hover:-translate-y-1 h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.profile_photo_url || undefined} alt={review.author_name} />
                    <AvatarFallback>
                      {review.author_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {review.author_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {review.relative_time_description}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  {renderStars(review.rating)}
                </div>

                {review.text && <p className="text-sm text-muted-foreground line-clamp-4">
                    {review.text}
                  </p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {placeConfig?.place_name && <div className="text-center mt-8">
            <a href={`https://www.google.com/maps/place/?q=place_id:${placeConfig.place_id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
              Ver todas as avaliações no Google
            </a>
          </div>}
      </div>
    </section>;
};