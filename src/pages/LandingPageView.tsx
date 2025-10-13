import { useParams } from "react-router-dom";
import { useLandingPage } from "@/hooks/useLandingPages";
import { useLandingPageBlocks } from "@/hooks/useLandingPageBlocks";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LandingPageView() {
  const { slug } = useParams();
  const { data: landingPage, isLoading } = useLandingPage(slug!);
  const { data: blocks = [] } = useLandingPageBlocks(landingPage?.id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-muted-foreground">Esta landing page não existe ou não está publicada.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{landingPage.meta_title || landingPage.titulo}</title>
        <meta name="description" content={landingPage.meta_description || landingPage.descricao || ""} />
        {landingPage.og_image && <meta property="og:image" content={landingPage.og_image} />}
      </Helmet>

      <div className="min-h-screen bg-background">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} landingPageId={landingPage.id} />
        ))}

        {blocks.length === 0 && (
          <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl font-bold mb-4">{landingPage.titulo}</h1>
            {landingPage.descricao && (
              <p className="text-xl text-muted-foreground">{landingPage.descricao}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

interface BlockRendererProps {
  block: any;
  landingPageId: string;
}

function BlockRenderer({ block, landingPageId }: BlockRendererProps) {
  const { block_type, content } = block;

  switch (block_type) {
    case 'hero':
      return <HeroBlock content={content} />;
    case 'features':
      return <FeaturesBlock content={content} />;
    case 'cta':
      return <CTABlock content={content} />;
    case 'form':
      return <FormBlock content={content} landingPageId={landingPageId} />;
    case 'testimonials':
      return <TestimonialsBlock content={content} />;
    default:
      return null;
  }
}

function HeroBlock({ content }: { content: any }) {
  return (
    <section className="relative min-h-[600px] flex items-center py-20 px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto text-center space-y-6">
        <h1 className="text-5xl lg:text-7xl font-bold">{content.titulo}</h1>
        {content.subtitulo && (
          <p className="text-xl lg:text-2xl text-muted-foreground">{content.subtitulo}</p>
        )}
        {content.cta_text && (
          <Button size="lg" className="mt-8">
            {content.cta_text}
          </Button>
        )}
      </div>
    </section>
  );
}

function FeaturesBlock({ content }: { content: any }) {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {content.items?.map((item: any, index: number) => (
            <div key={index} className="text-center space-y-4">
              <h3 className="text-2xl font-bold">{item.titulo}</h3>
              <p className="text-muted-foreground">{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABlock({ content }: { content: any }) {
  return (
    <section className="py-20 px-6 bg-primary/5">
      <div className="container mx-auto text-center space-y-6">
        <h2 className="text-4xl font-bold">{content.titulo}</h2>
        {content.texto && <p className="text-xl text-muted-foreground">{content.texto}</p>}
        {content.botao && (
          <Button size="lg" className="mt-4">
            {content.botao}
          </Button>
        )}
      </div>
    </section>
  );
}

function FormBlock({ content, landingPageId }: { content: any; landingPageId: string }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("landing_page_leads")
      .insert([{
        landing_page_id: landingPageId,
        ...formData,
      }]);

    setLoading(false);

    if (error) {
      toast.error("Erro ao enviar formulário");
      return;
    }

    toast.success("Formulário enviado com sucesso!");
    setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">{content.titulo}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function TestimonialsBlock({ content }: { content: any }) {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {content.items?.map((item: any, index: number) => (
            <div key={index} className="bg-card p-6 rounded-lg border">
              <p className="text-lg mb-4">"{item.texto}"</p>
              <p className="font-semibold">— {item.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}