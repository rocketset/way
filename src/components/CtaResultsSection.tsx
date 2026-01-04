import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowRight, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { useIntencoesCadastro } from "@/hooks/useIntencoesCadastro";
const contactSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres"
  }).max(100, {
    message: "Nome deve ter no máximo 100 caracteres"
  }),
  email: z.string().trim().email({
    message: "E-mail inválido"
  }).max(255, {
    message: "E-mail deve ter no máximo 255 caracteres"
  }),
  phone: z.string().trim().min(10, {
    message: "Telefone inválido"
  }).max(20, {
    message: "Telefone deve ter no máximo 20 caracteres"
  }),
  company: z.string().trim().max(100, {
    message: "Empresa deve ter no máximo 100 caracteres"
  }).optional(),
  subject: z.string().min(1, {
    message: "Selecione um assunto"
  }),
  message: z.string().trim().min(10, {
    message: "Mensagem deve ter pelo menos 10 caracteres"
  }).max(1000, {
    message: "Mensagem deve ter no máximo 1000 caracteres"
  }).transform(val => DOMPurify.sanitize(val, {
    ALLOWED_TAGS: []
  })) // Strip all HTML tags
});
type ContactFormData = z.infer<typeof contactSchema>;
const CtaResultsSection = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: intencoes
  } = useIntencoesCadastro('home');
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: ""
    }
  });
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from("contacts").insert([{
        nome: data.name,
        email: data.email,
        telefone: data.phone,
        empresa: data.company || null,
        assunto: data.subject,
        mensagem: data.message
      }]);
      if (error) throw error;
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Em breve entraremos em contato.",
        duration: 5000
      });
      form.reset();
    } catch (error: any) {
      console.error("Erro ao enviar:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section className="relative py-32 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
      {/* Animated Plus Icons Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => <Plus key={i} className="absolute text-primary/10 animate-pulse" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${20 + Math.random() * 40}px`,
        height: `${20 + Math.random() * 40}px`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }} />)}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Plus className="w-6 h-6 text-primary plus-rotate" />
              <span className="text-sm font-bold text-primary tracking-wider">PRONTO PARA CRESCER?</span>
              <Plus className="w-6 h-6 text-primary plus-rotate" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Agende um diagnóstico{" "}
              <span className="text-primary">gratuito</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Fale com a Way e acelere seu crescimento digital.
            </p>
          </div>

          {/* Contact Form */}
          <div className="group bg-card border border-border rounded-3xl p-8 md:p-10 shadow-2xl animate-fade-in hover:shadow-3xl hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
            {/* Decorative + in background */}
            <Plus className="absolute -top-10 -right-10 w-48 h-48 text-primary/5 group-hover:text-primary/10 group-hover:rotate-90 transition-all duration-700" />
            <Plus className="absolute -bottom-8 -left-8 w-40 h-40 text-primary/5 group-hover:text-primary/10 group-hover:-rotate-45 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Agende um
diagnóstico, é gratuito!</h3>
                  <p className="text-muted-foreground">Fale com um dos nossos especialistas!</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">Nome Completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">E-mail *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">Telefone *</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 98765-4321" {...field} className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="company" render={({
                    field
                  }) => <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">Site/Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu site ou nome da empresa" {...field} className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="subject" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-sm font-semibold text-white">Assunto *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50">
                              <SelectValue placeholder="Selecione um assunto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border z-50">
                            {intencoes?.map(intencao => <SelectItem key={intencao.id} value={intencao.valor_slug || intencao.id}>
                                {intencao.nome}
                              </SelectItem>)}
                            {!intencoes?.length && <SelectItem value="contato" disabled>
                                Carregando...
                              </SelectItem>}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />

                  <FormField control={form.control} name="message" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-sm font-semibold text-white">Mensagem *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Conte-nos sobre seu projeto..." rows={5} {...field} className="resize-none bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1 h-14 bg-primary text-background hover:bg-primary/90 transition-all duration-300 group text-lg font-medium rounded-lg" size="lg">
                      {isSubmitting ? <>
                          <Plus className="w-5 h-5 animate-spin mr-2" />
                          Enviando...
                        </> : <>
                          Enviar Mensagem
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                        </>}
                    </Button>
                    
                    <a href="https://api.whatsapp.com/message/5AGVY5WZR56KA1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 h-14 bg-gradient-to-r from-[#43E460] via-[#3ACC54] to-[#43E460] hover:from-[#3ACC54] hover:via-[#32B849] hover:to-[#3ACC54] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group text-lg font-medium">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span className="hidden sm:inline">Fale agora no WhatsApp</span>
                      <span className="sm:hidden">WhatsApp</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CtaResultsSection;