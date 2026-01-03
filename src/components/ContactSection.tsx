import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, User, MessageSquare, Send, Sparkles, Briefcase, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import DOMPurify from "dompurify";
import { useIntencoesCadastro } from "@/hooks/useIntencoesCadastro";

const contactSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(10, "Telefone inválido").max(20),
  assunto: z.string().min(1, "Selecione um assunto"),
  mensagem: z.string().trim().min(10, "Mensagem muito curta").max(1000)
    .transform((val) => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] })), // Strip all HTML tags
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
  const { data: intencoes } = useIntencoesCadastro('home');

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
                        {intencoes?.map((intencao) => (
                          <SelectItem key={intencao.id} value={intencao.valor_slug || intencao.id}>
                            {intencao.nome}
                          </SelectItem>
                        ))}
                        {!intencoes?.length && (
                          <SelectItem value="contato" disabled>
                            Carregando...
                          </SelectItem>
                        )}
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

                {/* Submit Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-background font-medium py-6 text-lg rounded-lg hover:bg-primary/90 transition-all duration-300 group/button"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
                      <Send className="w-5 h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                  
                  <a 
                    href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-[#43E460] via-[#3ACC54] to-[#43E460] hover:from-[#3ACC54] hover:via-[#32B849] hover:to-[#3ACC54] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group text-lg font-medium"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span className="hidden sm:inline">Fale agora no WhatsApp</span>
                    <span className="sm:hidden">WhatsApp</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
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
