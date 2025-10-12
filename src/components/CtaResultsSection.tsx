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
  })
});

type ContactFormData = z.infer<typeof contactSchema>;

const CtaResultsSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { error } = await supabase.from("contacts").insert([{
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

  return (
    <section className="relative py-32 bg-gradient-to-b from-background to-gray-900 overflow-hidden">
      {/* Animated Plus Icons Background */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(15)].map((_, i) => (
          <Plus 
            key={i}
            className="absolute text-primary animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
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
              Estruture, evolua e escale seu e-commerce com quem entende de{" "}
              <span className="gradient-text">performance</span>.
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Preencha o formulário abaixo e nossos especialistas entrarão em contato.
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
                  <h3 className="text-2xl font-bold text-white">Envie sua Mensagem</h3>
                  <p className="text-muted-foreground">Responderemos em até 24h</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">Nome Completo *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu nome" 
                              {...field} 
                              className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">E-mail *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="seu@email.com" 
                              {...field} 
                              className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">Telefone *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(11) 98765-4321" 
                              {...field} 
                              className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">Site/Empresa</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu site ou nome da empresa" 
                              {...field} 
                              className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-white">Assunto *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50">
                              <SelectValue placeholder="Selecione um assunto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border z-50">
                            <SelectItem value="implantacao">Implantação de E-commerce</SelectItem>
                            <SelectItem value="migracao">Migração de Plataforma de E-commerce</SelectItem>
                            <SelectItem value="vender-mais">Quero vender mais pelo meu E-commerce</SelectItem>
                            <SelectItem value="marketplace">Quero vender em Marketplace</SelectItem>
                            <SelectItem value="evolucao">Evolução/On-going</SelectItem>
                            <SelectItem value="parcerias">Parcerias Comerciais</SelectItem>
                            <SelectItem value="sac">Falar com o SAC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-white">Mensagem *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos sobre seu projeto..." 
                            rows={5} 
                            {...field} 
                            className="resize-none bg-background/50 border-border/50 transition-all duration-300 focus:scale-[1.01] hover:border-primary/50" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full h-14 bg-gradient-to-r from-primary via-yellow-500 to-primary hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02] text-lg font-semibold" 
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Plus className="w-5 h-5 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensagem
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaResultsSection;