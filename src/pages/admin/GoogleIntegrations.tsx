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

  // Função para extrair ID do Google Analytics de scripts ou texto
  const extractAnalyticsId = (input: string): string => {
    if (!input) return "";
    
    // Já é um ID válido
    if (/^G-[A-Z0-9]+$/i.test(input.trim())) {
      return input.trim();
    }
    
    // Extrair de script gtag.js
    const gtagMatch = input.match(/gtag\/js\?id=(G-[A-Z0-9]+)/i) || 
                      input.match(/gtag\(['"]config['"],\s*['"]([G-][A-Z0-9]+)['"]/i);
    if (gtagMatch) return gtagMatch[1];
    
    return input.trim();
  };

  // Função para extrair ID do Google Tag Manager de scripts
  const extractTagManagerId = (input: string): string => {
    if (!input) return "";
    
    // Já é um ID válido
    if (/^GTM-[A-Z0-9]+$/i.test(input.trim())) {
      return input.trim();
    }
    
    // Extrair de script GTM
    const gtmMatch = input.match(/GTM-[A-Z0-9]+/i);
    if (gtmMatch) return gtmMatch[0];
    
    return input.trim();
  };

  // Função para extrair código de verificação do Search Console
  const extractSearchConsoleCode = (input: string): string => {
    if (!input) return "";
    
    // Extrair de meta tag
    const metaMatch = input.match(/content=["']([^"']+)["']/i);
    if (metaMatch) return metaMatch[1];
    
    // Já é o código
    return input.trim();
  };

  const handleSave = () => {
    saveConfig.mutate({
      analytics_id: extractAnalyticsId(analyticsId) || null,
      tag_manager_id: extractTagManagerId(tagManagerId) || null,
      search_console_verification: extractSearchConsoleCode(searchConsoleVerification) || null,
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
                <Label htmlFor="analytics-id">ID de Medição ou Script Completo</Label>
                <textarea
                  id="analytics-id"
                  placeholder="Cole aqui o script completo do Google Analytics ou apenas o ID (G-XXXXXXXXXX)"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  ✅ Aceita: ID direto (G-XXXXXXXXXX) ou script completo copiado do Google Analytics
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
                <Label htmlFor="tag-manager-id">ID do Container ou Script Completo</Label>
                <textarea
                  id="tag-manager-id"
                  placeholder="Cole aqui o script completo do Google Tag Manager ou apenas o ID (GTM-XXXXXXX)"
                  value={tagManagerId}
                  onChange={(e) => setTagManagerId(e.target.value)}
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  ✅ Aceita: ID direto (GTM-XXXXXXX) ou script completo copiado do Google Tag Manager
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
                <Label htmlFor="search-console">Código de Verificação ou Meta Tag Completa</Label>
                <textarea
                  id="search-console"
                  placeholder='Cole aqui a meta tag completa ou apenas o código de verificação'
                  value={searchConsoleVerification}
                  onChange={(e) => setSearchConsoleVerification(e.target.value)}
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  ✅ Aceita: código direto ou meta tag completa (&lt;meta name="google-site-verification" content="..."/&gt;)
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

          {/* Sitemap Dinâmico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sitemap XML
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Visualizar
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardTitle>
              <CardDescription>
                Sitemap dinâmico com todas as páginas públicas do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  O sitemap é gerado automaticamente e inclui:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                  <li>Todas as páginas estáticas (home, soluções, contato, etc.)</li>
                  <li>Posts do blog publicados</li>
                  <li>Cases publicados</li>
                  <li>Landing pages publicadas</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Label>URL do Sitemap</Label>
                <div className="flex gap-2">
                  <Input 
                    value="https://wayecommerce.com.br/sitemap.xml" 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('https://wayecommerce.com.br/sitemap.xml');
                    }}
                  >
                    Copiar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  📌 Use esta URL ao enviar o sitemap para o Google Search Console
                </p>
              </div>
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
