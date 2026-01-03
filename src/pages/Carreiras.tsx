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
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Upload, 
  Send, 
  ChevronRight,
  Building2,
  Users,
  Sparkles,
  FileText,
  Loader2
} from "lucide-react";

const candidaturaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  linkedin_url: z.string().url("URL inválida").optional().or(z.literal("")),
  portfolio_url: z.string().url("URL inválida").optional().or(z.literal("")),
  nivel_experiencia: z.string().min(1, "Selecione o nível de experiência"),
  pretensao_salarial: z.string().optional(),
  mensagem: z.string().min(10, "Conte um pouco mais sobre você"),
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
        pretensao_salarial: data.pretensao_salarial || null,
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
        <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Venha fazer parte do nosso time
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Carreiras na Way
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                A Way é para quem gosta de desafio, responsabilidade e resultado.
                Trabalhamos com método, ritmo forte e foco total em performance.
                <br /><br />
                Aqui não existe espaço para acomodação, existe espaço para quem quer crescer, aprender e entregar.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>Ambiente colaborativo</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Time de alta performance</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Crescimento contínuo</span>
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
            ) : vagas && vagas.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vagas.map((vaga) => (
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
              </div>
            ) : (
              <Card className="max-w-lg mx-auto text-center py-12">
                <CardContent>
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma vaga no momento</h3>
                  <p className="text-muted-foreground mb-6">
                    Não temos vagas abertas no momento, mas você pode enviar seu currículo para nosso banco de talentos.
                  </p>
                  <Button onClick={() => openForm(null)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Enviar currículo | Cadastro reserva
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* CTA Candidatura Espontânea */}
            {vagas && vagas.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Não encontrou a vaga ideal? Envie seu currículo para nosso banco de talentos!
                </p>
                <Button variant="outline" size="lg" onClick={() => openForm(null)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Candidatura espontânea
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de Candidatura */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedVaga ? (
                <>Candidatar-se para: {selectedVaga.titulo}</>
              ) : (
                <>Candidatura Espontânea</>
              )}
            </DialogTitle>
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
              <Label htmlFor="pretensao_salarial">Pretensão salarial (opcional)</Label>
              <Input
                id="pretensao_salarial"
                placeholder="Ex: R$ 5.000 - R$ 7.000"
                {...register("pretensao_salarial")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="curriculo">Currículo (PDF)</Label>
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
              <Label htmlFor="mensagem">Por que quer trabalhar conosco? *</Label>
              <Textarea
                id="mensagem"
                placeholder="Conte um pouco sobre você, sua experiência e por que gostaria de fazer parte do nosso time..."
                rows={4}
                {...register("mensagem")}
              />
              {errors.mensagem && (
                <p className="text-sm text-destructive">{errors.mensagem.message}</p>
              )}
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
