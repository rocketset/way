import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(10, "Telefone inválido").max(20),
  empresa: z.string().trim().max(100).optional(),
});

const CaseContactForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validação dos dados
      const validatedData = contactSchema.parse(formData);

      // Salva no banco de dados
      const { error } = await supabase.from("contacts").insert([{
        nome: validatedData.nome,
        email: validatedData.email,
        telefone: validatedData.telefone,
        empresa: validatedData.empresa || null,
        mensagem: "Solicitação de contato via formulário de case",
      }]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Em breve entraremos em contato.",
      });
      setFormData({ nome: "", email: "", telefone: "", empresa: "" });
    } catch (error: any) {
      console.error("Erro ao enviar:", error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="bg-background py-24 px-4">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Vamos iniciar o seu projeto?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Entre em contato com nosso time de especialistas e coloque seu negócio no topo da página.
              </p>
            </div>

            {/* Right Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      name="nome"
                      placeholder="Nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="bg-background border-border h-12"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background border-border h-12"
                    />
                  </div>

                  <div>
                    <Input
                      type="tel"
                      name="telefone"
                      placeholder="Telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className="bg-background border-border h-12"
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="empresa"
                      placeholder="Nome da empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      required
                      className="bg-background border-border h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseContactForm;
