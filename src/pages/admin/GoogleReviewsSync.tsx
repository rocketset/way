import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Star } from "lucide-react";
import { useGooglePlaceConfig, useSyncGoogleReviews } from "@/hooks/useGoogleReviews";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const GoogleReviewsSync = () => {
  const { data: placeConfig, isLoading } = useGooglePlaceConfig();
  const { mutate: syncReviews, isPending } = useSyncGoogleReviews();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sincronizar Avaliações do Google</h2>
      </div>
      
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Google Places</CardTitle>
            <CardDescription>
              Sincronize as avaliações do seu negócio no Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-muted-foreground">Carregando...</div>
            ) : placeConfig ? (
              <>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Nome do Negócio</div>
                    <div className="text-lg">{placeConfig.place_name || "Não disponível"}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Place ID</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {placeConfig.place_id}
                    </div>
                  </div>

                  {placeConfig.rating && (
                    <div>
                      <div className="text-sm font-medium mb-2">Avaliação Média</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(placeConfig.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-2xl font-bold">
                          {placeConfig.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({placeConfig.user_ratings_total} avaliações)
                        </span>
                      </div>
                    </div>
                  )}

                  {placeConfig.last_synced_at && (
                    <div>
                      <div className="text-sm font-medium mb-1">Última Sincronização</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(placeConfig.last_synced_at), "PPpp", { locale: ptBR })}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => syncReviews()}
                  disabled={isPending}
                  className="w-full"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                  {isPending ? "Sincronizando..." : "Sincronizar Avaliações"}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Nenhuma configuração encontrada. Entre em contato com o administrador.
                </p>
              </div>
            )}
          </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  export default GoogleReviewsSync;
