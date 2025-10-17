import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGoogleIntegrations, useSaveGoogleIntegrations } from "@/hooks/useGoogleIntegrations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink } from "lucide-react";

export default function GoogleIntegrations() {
  const { data: config, isLoading } = useGoogleIntegrations();
  const saveConfig = useSaveGoogleIntegrations();

  const [analyticsId, setAnalyticsId] = useState("");
  const [tagManagerId, setTagManagerId] = useState("");
  const [searchConsoleVerification, setSearchConsoleVerification] = useState("");

  useEffect(() => {
    if (config) {
      setAnalyticsId(config.analytics_id || "");
      setTagManagerId(config.tag_manager_id || "");
      setSearchConsoleVerification(config.search_console_verification || "");
    }
  }, [config]);

  const handleSave = () => {
    saveConfig.mutate({
      analytics_id: analyticsId || null,
      tag_manager_id: tagManagerId || null,
      search_console_verification: searchConsoleVerification || null,
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integrações Google</h2>
          <p className="text-muted-foreground mt-2">
            Configure as integrações com os serviços do Google
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Configure as integrações com os serviços do Google para acompanhar visitantes, gerenciar tags de marketing e monitorar a performance nas buscas.
            </AlertDescription>
          </Alert>

          {/* Google Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Google Analytics (GA4)
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://analytics.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Acessar
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardTitle>
              <CardDescription>
                Acompanhe visitantes, comportamento dos usuários e conversões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analytics-id">ID de Medição (Measurement ID)</Label>
                <Input
                  id="analytics-id"
                  placeholder="G-XXXXXXXXXX"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Encontre seu ID em: Analytics → Admin → Streams de dados → Web → ID de Medição
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Google Tag Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Google Tag Manager
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://tagmanager.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Acessar
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardTitle>
              <CardDescription>
                Gerencie tags de marketing sem editar código
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag-manager-id">ID do Container</Label>
                <Input
                  id="tag-manager-id"
                  placeholder="GTM-XXXXXXX"
                  value={tagManagerId}
                  onChange={(e) => setTagManagerId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Encontre seu ID em: Tag Manager → Workspace → ID do Container (canto superior direito)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Google Search Console */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Google Search Console
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Acessar
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardTitle>
              <CardDescription>
                Monitore performance nas buscas do Google
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-console">Código de Verificação</Label>
                <Input
                  id="search-console"
                  placeholder="abc123def456..."
                  value={searchConsoleVerification}
                  onChange={(e) => setSearchConsoleVerification(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Em Search Console → Adicionar propriedade → Verificação → Tag HTML → copie apenas o código (sem a meta tag)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Google Reviews (já implementado) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Google Reviews
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin/google-reviews" className="flex items-center gap-2">
                    Gerenciar
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardTitle>
              <CardDescription>
                Sincronize e exiba avaliações do Google My Business no site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As avaliações do Google já estão configuradas. Acesse a página de gerenciamento para configurar o Place ID e sincronizar as avaliações.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end gap-4">
            <Button
              onClick={handleSave}
              disabled={saveConfig.isPending}
            >
              {saveConfig.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
