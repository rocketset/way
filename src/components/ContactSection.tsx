import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User, MessageSquare, Send, Sparkles } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <section id="contato" className="relative py-24 bg-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary tracking-wider">ENTRE EM CONTATO</span>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <h2 className="text-5xl font-bold mb-4 text-gray-900 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
              Quer mudar o ritmo do seu negócio?
            </h2>
            <p className="text-xl text-gray-600">
              Vem falar com a gente!
            </p>
          </div>

          {/* Form Card */}
          <div className="relative group animate-scale-in">
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
            
            <div className="relative bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
              {/* Form title with icon */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Converse com nosso parceiro
                </h3>
              </div>

              <form className="space-y-6">
                {/* Nome Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-yellow-400/50 rounded-lg blur opacity-0 ${focusedField === 'name' ? 'opacity-30' : ''} group-hover/field:opacity-20 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <User className={`w-5 h-5 ${focusedField === 'name' ? 'text-primary' : ''}`} />
                    </div>
                    <Input
                      placeholder="Nome completo"
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 pr-4 py-6 bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white text-gray-900 rounded-lg transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-yellow-400/50 rounded-lg blur opacity-0 ${focusedField === 'email' ? 'opacity-30' : ''} group-hover/field:opacity-20 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <Mail className={`w-5 h-5 ${focusedField === 'email' ? 'text-primary' : ''}`} />
                    </div>
                    <Input
                      type="email"
                      placeholder="E-mail"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 pr-4 py-6 bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white text-gray-900 rounded-lg transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-yellow-400/50 rounded-lg blur opacity-0 ${focusedField === 'phone' ? 'opacity-30' : ''} group-hover/field:opacity-20 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <Phone className={`w-5 h-5 ${focusedField === 'phone' ? 'text-primary' : ''}`} />
                    </div>
                    <Input
                      type="tel"
                      placeholder="Telefone"
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 pr-4 py-6 bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white text-gray-900 rounded-lg transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative group/field">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-yellow-400/50 rounded-lg blur opacity-0 ${focusedField === 'message' ? 'opacity-30' : ''} group-hover/field:opacity-20 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-400 group-hover/field:text-primary transition-colors duration-300">
                      <MessageSquare className={`w-5 h-5 ${focusedField === 'message' ? 'text-primary' : ''}`} />
                    </div>
                    <Textarea
                      placeholder="Mensagem"
                      rows={5}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 pr-4 pt-4 pb-4 bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white text-gray-900 rounded-lg transition-all duration-300 hover:border-primary/50 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="relative group/button pt-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-lg blur opacity-40 group-hover/button:opacity-70 transition-opacity duration-500 animate-pulse" />
                  <Button className="relative w-full bg-gradient-to-r from-primary to-yellow-400 text-gray-900 hover:from-yellow-400 hover:to-primary font-bold py-7 text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group-hover/button:shadow-primary/50">
                    <span className="flex items-center justify-center gap-2">
                      ENVIAR MENSAGEM
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
