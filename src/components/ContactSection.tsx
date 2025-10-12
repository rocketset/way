import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, User, MessageSquare, Send, Sparkles, Briefcase } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(10, "Telefone inválido").max(20),
  assunto: z.string().min(1, "Selecione um assunto"),
  mensagem: z.string().trim().min(10, "Mensagem muito curta").max(1000),
});

const ContactSection = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);

      const { error } = await supabase.from("contacts").insert([{
        nome: validatedData.nome,
        email: validatedData.email,
        telefone: validatedData.telefone,
        empresa: null,
        assunto: validatedData.assunto,
        mensagem: validatedData.mensagem,
      }]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Em breve entraremos em contato.",
      });
      setFormData({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, assunto: value });
  };

  return (
    <section id="contato" className="relative py-24 bg-gradient-to-b from-background to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Plus icons animados de fundo */}
      <div className="absolute top-10 left-10 text-primary/5 text-6xl animate-float" style={{ animationDelay: '0s' }}>+</div>
      <div className="absolute top-20 right-20 text-primary/5 text-8xl animate-float" style={{ animationDelay: '1s' }}>+</div>
      <div className="absolute bottom-20 left-1/4 text-primary/5 text-7xl animate-float" style={{ animationDelay: '2s' }}>+</div>
      <div className="absolute bottom-10 right-1/3 text-primary/5 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>+</div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary tracking-wider">ENTRE EM CONTATO</span>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              Quer mudar o ritmo do seu negócio?
            </h2>
            <p className="text-xl text-gray-300">
              Vem falar com a gente!
            </p>
          </div>

          {/* Form Card */}
          <div className="relative group animate-scale-in">
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            
            <div className="relative bg-card/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-border">
              {/* Form title with icon */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-white">
                  Converse com nosso parceiro
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-0 ${focusedField === 'nome' ? 'opacity-20' : ''} group-hover/field:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <User className={`w-5 h-5 ${focusedField === 'nome' ? 'text-primary' : ''}`} />
                    </div>
                    <Input
                      name="nome"
                      placeholder="Nome completo"
                      value={formData.nome}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('nome')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-12 pr-4 py-6 bg-background border border-border focus:border-primary focus:bg-card text-foreground rounded-lg transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-0 ${focusedField === 'email' ? 'opacity-20' : ''} group-hover/field:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <Mail className={`w-5 h-5 ${focusedField === 'email' ? 'text-primary' : ''}`} />
                    </div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-12 pr-4 py-6 bg-background border border-border focus:border-primary focus:bg-card text-foreground rounded-lg transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-0 ${focusedField === 'telefone' ? 'opacity-20' : ''} group-hover/field:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <Phone className={`w-5 h-5 ${focusedField === 'telefone' ? 'text-primary' : ''}`} />
                    </div>
                    <Input
                      name="telefone"
                      type="tel"
                      placeholder="Telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('telefone')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-12 pr-4 py-6 bg-background border border-border focus:border-primary focus:bg-card text-foreground rounded-lg transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Assunto Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-0 ${focusedField === 'assunto' ? 'opacity-20' : ''} group-hover/field:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/field:text-primary transition-colors duration-300 z-10 pointer-events-none">
                      <Briefcase className={`w-5 h-5 ${focusedField === 'assunto' ? 'text-primary' : ''}`} />
                    </div>
                    <Select 
                      value={formData.assunto} 
                      onValueChange={handleSelectChange}
                      onOpenChange={(open) => setFocusedField(open ? 'assunto' : null)}
                      required
                    >
                      <SelectTrigger className="pl-12 pr-4 py-6 bg-background border border-border focus:border-primary focus:bg-card text-foreground rounded-lg transition-all duration-300 hover:border-primary/50 h-auto">
                        <SelectValue placeholder="Assunto" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="loja-virtual">Quero fazer uma loja virtual</SelectItem>
                        <SelectItem value="vender-mais">Quero vender mais pelo meu E-commerce</SelectItem>
                        <SelectItem value="marketplace">Quero vender em marketplace</SelectItem>
                        <SelectItem value="parceiro">Quero me tornar um parceiro</SelectItem>
                        <SelectItem value="sac">Quero falar com o SAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-0 ${focusedField === 'mensagem' ? 'opacity-20' : ''} group-hover/field:opacity-10 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <MessageSquare className={`w-5 h-5 ${focusedField === 'mensagem' ? 'text-primary' : ''}`} />
                    </div>
                    <Textarea
                      name="mensagem"
                      placeholder="Mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows={5}
                      onFocus={() => setFocusedField('mensagem')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="pl-12 pr-4 pt-4 pb-4 bg-background border border-border focus:border-primary focus:bg-card text-foreground rounded-lg transition-all duration-300 hover:border-primary/50 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-background font-medium py-6 text-lg rounded-lg hover:bg-primary/90 transition-all duration-300 group/button"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
                      <Send className="w-5 h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>
              </form>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/30 rounded-br-2xl" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
