import logoWay from "@/assets/logo-way-light.png";
import { Phone, Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Footer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter signup:", { name, email });
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Company Info */}
          <div className="space-y-6">
            <img src={logoWay} alt="Way E-commerce" className="h-12 mb-6" />
            
            <p className="text-foreground text-lg leading-relaxed max-w-md">
              Somos uma agência especializada em e-commerce e performance digital, 
              com mais de 10 anos transformando negócios no mercado digital.
            </p>

            <div className="space-y-4">
              <a 
                href="tel:+558399644-3602" 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>(83) 99644-3602</span>
              </a>

              <a 
                href="mailto:contato@wayecommerce.com.br" 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>contato@wayecommerce.com.br</span>
              </a>

              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>João Pessoa, Paraíba - Brasil</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 pt-4">
              <a 
                href="https://www.instagram.com/wayecommerce/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/wayecommerce/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://share.google/AaJY99hxuyzkT8BZi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Side - Newsletter Form */}
          <div className="space-y-6">
            <h3 className="text-2xl font-normal text-foreground leading-relaxed">
              Cadastre-se e receba os melhores conteúdos sobre{" "}
              <span className="text-primary">
                e-commerce, performance e marketing digital
              </span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="footer-name" className="block text-sm font-medium text-foreground mb-2">
                    Nome
                  </label>
                  <Input
                    id="footer-name"
                    type="text"
                    placeholder="Insira seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="footer-email" className="block text-sm font-medium text-foreground mb-2">
                    E-mail
                  </label>
                  <Input
                    id="footer-email"
                    type="email"
                    placeholder="Insira seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background"
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Ao se cadastrar, você confirma que está de acordo com as{" "}
                <a href="/privacy" className="underline hover:text-primary">
                  Políticas de Privacidade.
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto md:min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-6 text-lg rounded-sm"
              >
                Cadastrar
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            2025 © Way E-commerce. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;