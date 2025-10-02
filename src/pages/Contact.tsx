import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Instagram,
  Linkedin,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "E-mail deve ter no máximo 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Telefone inválido" })
    .max(20, { message: "Telefone deve ter no máximo 20 caracteres" }),
  company: z
    .string()
    .trim()
    .max(100, { message: "Empresa deve ter no máximo 100 caracteres" })
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, { message: "Mensagem deve ter pelo menos 10 caracteres" })
    .max(1000, { message: "Mensagem deve ter no máximo 1000 caracteres" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // WhatsApp message with proper encoding
    const whatsappMessage = encodeURIComponent(
      `*Nova mensagem do site Way+*\n\n` +
      `*Nome:* ${data.name}\n` +
      `*E-mail:* ${data.email}\n` +
      `*Telefone:* ${data.phone}\n` +
      `${data.company ? `*Empresa:* ${data.company}\n` : ''}` +
      `*Mensagem:* ${data.message}`
    );

    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Em breve entraremos em contato.",
      duration: 5000,
    });

    form.reset();
    setIsSubmitting(false);

    // Open WhatsApp
    // window.open(`https://wa.me/5583996443602?text=${whatsappMessage}`, '_blank');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-mail",
      info: "contato@wayecommerce.com.br",
      link: "mailto:contato@wayecommerce.com.br",
    },
    {
      icon: Phone,
      title: "Telefone",
      info: "(83) 99644-3602",
      link: "tel:+5583996443602",
    },
  ];

  const socialLinks = [
    { icon: Instagram, link: "https://www.instagram.com/wayecommerce/", label: "Instagram" },
    { icon: Linkedin, link: "https://www.linkedin.com/company/wayecommerce/", label: "LinkedIn" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-scale-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Fale Conosco</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
              Vamos Crescer Juntos?
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Estamos prontos para transformar seu e-commerce em uma máquina de vendas.
              Entre em contato e descubra como podemos ajudar seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl animate-fade-in hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Envie sua Mensagem</h2>
                  <p className="text-muted-foreground">Responderemos em até 24h</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seu nome"
                            {...field}
                            className="transition-all duration-300 focus:scale-[1.02]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              {...field}
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(11) 98765-4321"
                              {...field}
                              className="transition-all duration-300 focus:scale-[1.02]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome da sua empresa"
                            {...field}
                            className="transition-all duration-300 focus:scale-[1.02]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte-nos sobre seu projeto..."
                            rows={5}
                            {...field}
                            className="resize-none transition-all duration-300 focus:scale-[1.02]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary via-yellow-500 to-primary hover:shadow-2xl transition-all duration-300 group"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="grid gap-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="group bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">{item.info}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 animate-fade-in">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Siga-nos nas Redes Sociais
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-background rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Success Message Card */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                      Resposta Rápida Garantida
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nossa equipe analisa cada mensagem com cuidado e responde em até 24 horas úteis.
                      Seu sucesso é nossa prioridade!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Contact;
