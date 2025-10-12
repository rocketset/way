import logoWay from "@/assets/logo-way-yellow.png";
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
    <footer className="bg-[#3D2A2B] py-12">
      <div className="container mx-auto px-4">
        <div className="bg-[#2D1F20] rounded-2xl p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Side - Company Info */}
            <div className="space-y-6 border-r border-white/10 pr-8">
              <img src={logoWay} alt="Way E-commerce" className="h-10 brightness-0 invert" />
              
              <p className="text-white text-base leading-relaxed">
                Somos uma agência especializada em e-commerce e performance digital, 
                com mais de 10 anos transformando negócios no mercado digital.
              </p>

              <div className="space-y-3">
                <a 
                  href="tel:+558399644-3602" 
                  className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>(83) 99644-3602</span>
                </a>

                <a 
                  href="mailto:contato@wayecommerce.com.br" 
                  className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>contato@wayecommerce.com.br</span>
                </a>

                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>João Pessoa, Paraíba - Brasil</span>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-3 pt-2">
                <a 
                  href="https://www.instagram.com/wayecommerce/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/wayecommerce/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://share.google/AaJY99hxuyzkT8BZi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side - Newsletter Form */}
            <div className="space-y-5">
              <h3 className="text-xl text-white leading-relaxed">
                Inscreva-se para receber insights e conteúdos estratégicos sobre{" "}
                <span className="text-primary italic">
                  e-commerce, performance e marketing digital.
                </span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="footer-name" className="block text-xs font-medium text-white mb-1.5">
                      Nome
                    </label>
                    <Input
                      id="footer-name"
                      type="text"
                      placeholder="Insira seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white text-black placeholder:text-gray-400 border-0"
                    />
                  </div>

                  <div>
                    <label htmlFor="footer-email" className="block text-xs font-medium text-white mb-1.5">
                      E-mail
                    </label>
                    <Input
                      id="footer-email"
                      type="email"
                      placeholder="Insira seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white text-black placeholder:text-gray-400 border-0"
                    />
                  </div>
                </div>

                <div className="text-xs text-white/70 italic">
                  Ao se cadastrar, você confirma que está de acordo com as{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    Políticas de Privacidade.
                  </a>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-5 text-base rounded-full"
                >
                  Cadastrar
                </Button>
              </form>

              {/* Copyright */}
              <div className="pt-4 text-center">
                <p className="text-xs text-white/50">
                  2025 © Way E-commerce. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;