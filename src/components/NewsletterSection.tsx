import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const NewsletterSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter signup:", { name, email });
  };

  return (
    <section className="py-16 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-8 leading-relaxed">
            Cadastre-se e receba os melhores conteúdos sobre{" "}
            <span className="text-primary font-normal">
              e-commerce, performance e marketing digital
            </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-left">
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Insira seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-background"
                />
              </div>

              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Insira seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-background"
                />
              </div>
            </div>

            <div className="text-left text-sm text-muted-foreground">
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
    </section>
  );
};

export default NewsletterSection;
