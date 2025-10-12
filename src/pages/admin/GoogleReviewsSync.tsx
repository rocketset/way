import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Star, Save } from "lucide-react";
import { useGooglePlaceConfig, useSyncGoogleReviews } from "@/hooks/useGoogleReviews";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const GoogleReviewsSync = () => {
  const { data: placeConfig, isLoading, refetch } = useGooglePlaceConfig();
  const { mutate: syncReviews, isPending } = useSyncGoogleReviews();
  const [placeId, setPlaceId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePlaceId = async () => {
    if (!placeId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um Place ID válido",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("google_place_config")
        .update({ place_id: placeId.trim() })
        .eq("id", placeConfig?.id);

      if (error) throw error;

      toast({
        title: "Place ID atualizado",
        description: "O Place ID foi atualizado com sucesso. Agora você pode sincronizar as avaliações.",
      });

      setPlaceId("");
      refetch();
    } catch (error) {
      console.error("Error updating place ID:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o Place ID",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
                {/* Seção para atualizar Place ID */}
                <div className="space-y-4 border-b pb-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Atualizar Place ID</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Para encontrar seu Place ID correto:
                      <br />
                      1. Acesse{" "}
                      <a
                        href="https://placeidfinder.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        placeidfinder.com
                      </a>
                      <br />
                      2. Cole a URL do Google Maps do seu negócio
                      <br />
                      3. Copie o Place ID gerado (começa com "ChIJ")
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeId">Place ID do Google</Label>
                    <div className="flex gap-2">
                      <Input
                        id="placeId"
                        placeholder="ChIJ..."
                        value={placeId}
                        onChange={(e) => setPlaceId(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSavePlaceId}
                        disabled={isSaving || !placeId.trim()}
                      >
                        {isSaving ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Salvar
                      </Button>
                    </div>
                  </div>
                </div>

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
