import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVagas, Vaga } from "@/hooks/useVagas";
import { useCreateCandidatura, uploadCurriculo } from "@/hooks/useCandidaturas";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Send, 
  ChevronRight,
  Building2,
  Users,
  Sparkles,
  FileText,
  Loader2,
  Heart,
  Award,
  TrendingUp
} from "lucide-react";

const candidaturaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  linkedin_url: z.string().url("URL inválida").optional().or(z.literal("")),
  portfolio_url: z.string().url("URL inválida").optional().or(z.literal("")),
  nivel_experiencia: z.string().min(1, "Selecione o nível de experiência"),
  mensagem: z.string().min(10, "Conte um pouco mais sobre você"),
  lgpd_consent: z.boolean().refine(val => val === true, "Você deve autorizar o uso dos seus dados"),
});

type CandidaturaForm = z.infer<typeof candidaturaSchema>;

const modalidadeLabels: Record<string, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  hibrido: "Híbrido",
};

const nivelLabels: Record<string, string> = {
  estagio: "Estágio",
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
};

const tipoContratacaoLabels: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  estagio: "Estágio",
  freelancer: "Freelancer",
};

export default function Carreiras() {
  const { data: vagas, isLoading } = useVagas(true);
  const createCandidatura = useCreateCandidatura();
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [curriculoFile, setCurriculoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CandidaturaForm>({
    resolver: zodResolver(candidaturaSchema),
  });

  const openForm = (vaga: Vaga | null = null) => {
    setSelectedVaga(vaga);
    setIsFormOpen(true);
    reset();
    setCurriculoFile(null);
  };

  const onSubmit = async (data: CandidaturaForm) => {
    try {
      setIsUploading(true);
      let curriculo_url = null;

      if (curriculoFile) {
        curriculo_url = await uploadCurriculo(curriculoFile);
      }

      await createCandidatura.mutateAsync({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        nivel_experiencia: data.nivel_experiencia,
        mensagem: data.mensagem,
        vaga_id: selectedVaga?.id || null,
        curriculo_url,
        linkedin_url: data.linkedin_url || null,
        portfolio_url: data.portfolio_url || null,
      });

      setIsFormOpen(false);
      reset();
      setCurriculoFile(null);
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Carreiras | Way E-commerce"
        description="Faça parte do time Way E-commerce. Confira nossas vagas abertas e candidate-se."
      />
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Content */}
              <div className="order-2 lg:order-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
                  Faça parte do time Way
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  A Way é para quem gosta de desafio, responsabilidade e resultado.
                  <br />
                  Trabalhamos com método, ritmo forte e foco total em performance.
                  <br />
                  Aqui valorizamos pessoas que querem crescer, aprender e entregar com consistência.
                </p>
                <Button 
                  size="lg" 
                  className="mb-10"
                  onClick={() => openForm(null)}
                >
                  Bora crescer juntos? Envie seu currículo!
                </Button>

                {/* Stats / Pillars */}
                <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Ambiente colaborativo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Time de alta performance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Crescimento contínuo</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Image with Floating Badges */}
              <div className="order-1 lg:order-2 relative">
                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/lovable-uploads/be62bf36-4078-4afb-ab3c-273c92ed91d0.jpg" 
                    alt="Time Way E-commerce em evento" 
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                </div>

                {/* Floating Badge - Top Right */}
                <div className="absolute -top-4 right-4 lg:-right-6 bg-background rounded-xl shadow-lg border border-border px-4 py-3 flex items-center gap-3 animate-fade-in z-10">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Equipe de alta performance</p>
                    <p className="text-xs text-muted-foreground">Colaboração diária e foco em resultados</p>
                  </div>
                </div>

                {/* Floating Badge - Bottom Right */}
                <div className="absolute -bottom-4 right-4 lg:-right-6 bg-background rounded-xl shadow-lg border border-border px-4 py-3 flex items-center gap-3 animate-fade-in z-10" style={{ animationDelay: '0.2s' }}>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Cultura forte e reconhecida</p>
                    <p className="text-xs text-muted-foreground">Método, crescimento e consistência</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vagas Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Vagas Abertas</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Confira as oportunidades disponíveis e encontre a vaga ideal para você
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Vagas ativas */}
                {vagas && vagas.map((vaga) => (
                  <Card 
                    key={vaga.id} 
                    className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer"
                    onClick={() => openForm(vaga)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {tipoContratacaoLabels[vaga.tipo_contratacao] || vaga.tipo_contratacao}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {nivelLabels[vaga.nivel || "pleno"] || vaga.nivel}
                        </Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {vaga.titulo}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {vaga.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {modalidadeLabels[vaga.modalidade] || vaga.modalidade}
                        </div>
                        {vaga.area && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {vaga.area}
                          </div>
                        )}
                        {vaga.salario_visivel && vaga.faixa_salarial && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {vaga.faixa_salarial}
                          </div>
                        )}
                      </div>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Ver detalhes e candidatar-se
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {/* Card fixo - Banco de Talentos (sempre visível) */}
                <Card 
                  className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer border-dashed border-2 bg-gradient-to-br from-primary/5 to-secondary/5"
                  onClick={() => openForm(null)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      Banco de Talentos – Way
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      Mesmo quando não houver vagas abertas no momento, você pode enviar seu currículo para o nosso banco de talentos. Estamos sempre em busca de pessoas que queiram crescer e evoluir com a Way.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="w-4 h-4 mr-2" />
                      Enviar currículo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Faça parte do time Way
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              Estamos sempre em busca de pessoas que queiram crescer, aprender e construir operações digitais de alto nível com a gente.
            </p>
          </DialogHeader>

          {selectedVaga && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">Sobre a vaga:</h4>
              <p className="text-sm text-muted-foreground mb-3">{selectedVaga.descricao}</p>
              
              {selectedVaga.requisitos && (
                <div className="mb-3">
                  <h5 className="font-medium text-sm mb-1">Requisitos:</h5>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedVaga.requisitos}</p>
                </div>
              )}
              
              {selectedVaga.beneficios && (
                <div>
                  <h5 className="font-medium text-sm mb-1">Benefícios:</h5>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedVaga.beneficios}</p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  {...register("nome")}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  {...register("telefone")}
                />
                {errors.telefone && (
                  <p className="text-sm text-destructive">{errors.telefone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel_experiencia">Nível de experiência *</Label>
                <Select onValueChange={(value) => setValue("nivel_experiencia", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estagio">Estágio</SelectItem>
                    <SelectItem value="junior">Júnior</SelectItem>
                    <SelectItem value="pleno">Pleno</SelectItem>
                    <SelectItem value="senior">Sênior</SelectItem>
                    <SelectItem value="especialista">Especialista</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nivel_experiencia && (
                  <p className="text-sm text-destructive">{errors.nivel_experiencia.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn (opcional)</Label>
                <Input
                  id="linkedin_url"
                  placeholder="https://linkedin.com/in/seu-perfil"
                  {...register("linkedin_url")}
                />
                {errors.linkedin_url && (
                  <p className="text-sm text-destructive">{errors.linkedin_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfólio/Site (opcional)</Label>
                <Input
                  id="portfolio_url"
                  placeholder="https://seu-portfolio.com"
                  {...register("portfolio_url")}
                />
                {errors.portfolio_url && (
                  <p className="text-sm text-destructive">{errors.portfolio_url.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="curriculo">Currículo * (PDF, DOC ou DOCX – máx. 10MB)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="curriculo"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCurriculoFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </div>
              {curriculoFile && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {curriculoFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem">Por que quer fazer parte da Way? *</Label>
              <Textarea
                id="mensagem"
                placeholder="Conte um pouco sobre você, sua experiência, seus objetivos profissionais e por que acredita que faz sentido crescer junto com a Way."
                rows={4}
                {...register("mensagem")}
              />
              {errors.mensagem && (
                <p className="text-sm text-destructive">{errors.mensagem.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="lgpd_consent"
                onCheckedChange={(checked) => setValue("lgpd_consent", checked === true)}
              />
              <div className="space-y-1">
                <label 
                  htmlFor="lgpd_consent" 
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Autorizo o uso dos meus dados pessoais pela Way, exclusivamente para fins de contato e processos de recrutamento e seleção, conforme a LGPD (Lei nº 13.709/2018).
                </label>
                {errors.lgpd_consent && (
                  <p className="text-sm text-destructive">{errors.lgpd_consent.message}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={createCandidatura.isPending || isUploading}
            >
              {(createCandidatura.isPending || isUploading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar candidatura
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
