import logoWay from "@/assets/logo-way.png";
import { Phone, Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
const Footer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const {
    settings
  } = useSiteSettings();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter signup:", {
      name,
      email
    });
  };
  return <footer className="py-6 md:py-12 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="rounded-xl md:rounded-2xl p-5 md:p-10 bg-[#2a2a2a]">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {/* Left Side - Company Info */}
            <div className="space-y-4 md:space-y-6 md:border-r border-white/10 md:pr-8">
              <img src={logoWay} alt="Way E-commerce" className="h-8 md:h-10" />
              
              <p className="text-white text-sm md:text-base leading-relaxed">Projetamos, estruturamos e escalamos operações de e-commerce e marketplace com método, tecnologia e foco em crescimento previsível.</p>

              <div className="space-y-2 md:space-y-3">
                {settings?.phone && <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 md:gap-3 text-white/70 hover:text-primary transition-colors text-xs md:text-sm">
                    <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>{settings.phone}</span>
                  </a>}

                {settings?.email && <a href={`mailto:${settings.email}`} className="flex items-center gap-2 md:gap-3 text-white/70 hover:text-primary transition-colors text-xs md:text-sm">
                    <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>{settings.email}</span>
                  </a>}

                {(settings?.city || settings?.state) && <div className="flex items-center gap-2 md:gap-3 text-white/70 text-xs md:text-sm">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>{[settings.city, settings.state].filter(Boolean).join(', ')} - {settings.country || 'Brasil'}</span>
                  </div>}
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-2 md:gap-3 pt-1 md:pt-2">
                {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-colors">
                    <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>}
                {settings?.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-colors">
                    <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>}
                {settings?.google_reviews_url && <a href={settings.google_reviews_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-colors">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                  </a>}
              </div>
            </div>

            {/* Right Side - Newsletter Form */}
            <div className="space-y-4 md:space-y-5">
              <h3 className="text-base md:text-xl text-white leading-relaxed">
                Inscreva-se para receber insights e conteúdos estratégicos sobre{" "}
                <span className="text-primary italic">
                  e-commerce, performance e marketing digital.
                </span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <div>
                    <label htmlFor="footer-name" className="block text-[10px] md:text-xs font-medium text-white mb-1 md:mb-1.5">
                      Nome
                    </label>
                    <Input id="footer-name" type="text" placeholder="Insira seu nome" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white text-black placeholder:text-gray-400 border-0 h-9 md:h-10 text-sm" />
                  </div>

                  <div>
                    <label htmlFor="footer-email" className="block text-[10px] md:text-xs font-medium text-white mb-1 md:mb-1.5">
                      E-mail
                    </label>
                    <Input id="footer-email" type="email" placeholder="Insira seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white text-black placeholder:text-gray-400 border-0 h-9 md:h-10 text-sm" />
                  </div>
                </div>

                <div className="text-[10px] md:text-xs text-white/70 italic">
                  Ao se cadastrar, você confirma que está de acordo com as{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    Políticas de Privacidade.
                  </a>
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-background font-medium px-6 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-lg h-auto">
                  Cadastrar
                </Button>
              </form>

              {/* Copyright */}
              <div className="pt-2 md:pt-4 text-center">
                <p className="text-[10px] md:text-xs text-white/50">2026 © Way E-commerce. Todos os direitos reservados | Way Soluções, Treinamentos e Serviços em Tecnologia LTDA  - CNPJ: 27.195.145/0001-41</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;