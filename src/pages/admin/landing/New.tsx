import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function NewLandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descricao: "",
    meta_title: "",
    meta_description: "",
  });

  const generateSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (titulo: string) => {
    setFormData(prev => ({
      ...prev,
      titulo,
      slug: generateSlug(titulo),
      meta_title: titulo,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.slug.trim()) {
      toast.error("Título e slug são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("landing_pages")
        .insert([{
          ...formData,
          autor_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Landing page criada com sucesso!");
      navigate(`/admin/landing/${data.id}/edit`);
    } catch (error: any) {
      toast.error("Erro ao criar landing page");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/landing/list")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Landing Page</h1>
          <p className="text-muted-foreground mt-2">
            Preencha as informações básicas
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Oferta Especial de Verão"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="oferta-especial-verao"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              URL amigável gerada automaticamente
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Breve descrição da landing page"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title (SEO)</Label>
            <Input
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
              placeholder="Título para aparecer no Google"
              maxLength={60}
            />
            <p className="text-sm text-muted-foreground">
              {formData.meta_title.length}/60 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description (SEO)</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              placeholder="Descrição para aparecer no Google"
              rows={2}
              maxLength={160}
            />
            <p className="text-sm text-muted-foreground">
              {formData.meta_description.length}/160 caracteres
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/landing/list")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar Landing Page"}
          </Button>
        </div>
      </form>
    </div>
  );
}