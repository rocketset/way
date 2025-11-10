import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Loader2, Building2, Phone, Share2, Globe } from "lucide-react";

const SiteSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSiteSettings();
  
  const [formData, setFormData] = useState({
    company_name: '',
    company_description: '',
    company_founding_year: '',
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    country: 'Brasil',
    instagram_url: '',
    linkedin_url: '',
    facebook_url: '',
    twitter_url: '',
    youtube_url: '',
    google_reviews_url: '',
    site_url: '',
    logo_url: '',
    rating_value: 5.0,
    review_count: 47,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        company_description: settings.company_description || '',
        company_founding_year: settings.company_founding_year || '',
        phone: settings.phone || '',
        email: settings.email || '',
        whatsapp: settings.whatsapp || '',
        address: settings.address || '',
        city: settings.city || '',
        state: settings.state || '',
        country: settings.country || 'Brasil',
        instagram_url: settings.instagram_url || '',
        linkedin_url: settings.linkedin_url || '',
        facebook_url: settings.facebook_url || '',
        twitter_url: settings.twitter_url || '',
        youtube_url: settings.youtube_url || '',
        google_reviews_url: settings.google_reviews_url || '',
        site_url: settings.site_url || '',
        logo_url: settings.logo_url || '',
        rating_value: settings.rating_value || 5.0,
        review_count: settings.review_count || 47,
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações do Site</h1>
        <p className="text-muted-foreground">
          Gerencie as informações da empresa, contatos e redes sociais
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">
              <Building2 className="w-4 h-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Phone className="w-4 h-4 mr-2" />
              Contato
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 className="w-4 h-4 mr-2" />
              Redes Sociais
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Globe className="w-4 h-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Configure as informações básicas da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Nome da Empresa *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company_description">Descrição</Label>
                  <Textarea
                    id="company_description"
                    value={formData.company_description}
                    onChange={(e) => handleChange('company_description', e.target.value)}
                    rows={4}
                    placeholder="Breve descrição da empresa..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_founding_year">Ano de Fundação</Label>
                    <Input
                      id="company_founding_year"
                      value={formData.company_founding_year}
                      onChange={(e) => handleChange('company_founding_year', e.target.value)}
                      placeholder="2015"
                    />
                  </div>

                  <div>
                    <Label htmlFor="logo_url">URL do Logo</Label>
                    <Input
                      id="logo_url"
                      value={formData.logo_url}
                      onChange={(e) => handleChange('logo_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Configure telefone, email e endereço
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(83) 99644-3602"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      placeholder="(83) 99644-3602"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contato@wayecommerce.com.br"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="João Pessoa"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="João Pessoa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="Paraíba"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      placeholder="Brasil"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>
                  Configure os links das redes sociais da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="instagram_url">Instagram</Label>
                  <Input
                    id="instagram_url"
                    value={formData.instagram_url}
                    onChange={(e) => handleChange('instagram_url', e.target.value)}
                    placeholder="https://www.instagram.com/wayecommerce/"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin_url">LinkedIn</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange('linkedin_url', e.target.value)}
                    placeholder="https://www.linkedin.com/company/wayecommerce/"
                  />
                </div>

                <div>
                  <Label htmlFor="facebook_url">Facebook</Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) => handleChange('facebook_url', e.target.value)}
                    placeholder="https://www.facebook.com/wayecommerce"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_url">Twitter / X</Label>
                  <Input
                    id="twitter_url"
                    value={formData.twitter_url}
                    onChange={(e) => handleChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/wayecommerce"
                  />
                </div>

                <div>
                  <Label htmlFor="youtube_url">YouTube</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => handleChange('youtube_url', e.target.value)}
                    placeholder="https://www.youtube.com/@wayecommerce"
                  />
                </div>

                <div>
                  <Label htmlFor="google_reviews_url">Google Reviews</Label>
                  <Input
                    id="google_reviews_url"
                    value={formData.google_reviews_url}
                    onChange={(e) => handleChange('google_reviews_url', e.target.value)}
                    placeholder="https://share.google/..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO e Avaliações</CardTitle>
                <CardDescription>
                  Configure informações para SEO e Schema.org
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_url">URL do Site</Label>
                  <Input
                    id="site_url"
                    value={formData.site_url}
                    onChange={(e) => handleChange('site_url', e.target.value)}
                    placeholder="https://wayecommerce.com.br"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating_value">Avaliação Média</Label>
                    <Input
                      id="rating_value"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating_value}
                      onChange={(e) => handleChange('rating_value', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="review_count">Número de Avaliações</Label>
                    <Input
                      id="review_count"
                      type="number"
                      min="0"
                      value={formData.review_count}
                      onChange={(e) => handleChange('review_count', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg" disabled={isUpdating}>
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
