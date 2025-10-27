import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBriefing, BriefingData } from "@/hooks/useBriefings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const briefingSchema = z.object({
  nome_empresa: z.string().min(1, "Campo obrigatório"),
  cnpj: z.string().min(1, "Campo obrigatório"),
  segmento: z.string().min(1, "Campo obrigatório"),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  site_atual: z.string().optional(),
  responsavel_projeto: z.string().min(1, "Campo obrigatório"),
  cargo_funcao: z.string().optional(),
  contato: z.string().min(1, "Campo obrigatório"),
  data_inicio_projeto: z.string().optional(),
  forma_juridica: z.string().optional(),
  observacoes_gerais: z.string().optional(),
});

type BriefingFormData = z.infer<typeof briefingSchema>;

const Briefing = () => {
  const navigate = useNavigate();
  const createBriefing = useCreateBriefing();
  const [currentSection, setCurrentSection] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm<BriefingFormData>({
    resolver: zodResolver(briefingSchema),
  });

  // Estados para as seções
  const [estruturaOrg, setEstruturaOrg] = useState<Record<string, string>>({});
  const [sistemasInt, setSistemasInt] = useState<Record<string, string>>({});
  const [produtosForn, setProdutosForn] = useState<Record<string, string>>({});
  const [mercadoEst, setMercadoEst] = useState<Record<string, string>>({});
  const [comunicacaoRel, setComunicacaoRel] = useState<Record<string, string>>({});
  const [operacaoLog, setOperacaoLog] = useState<Record<string, string>>({});

  const onSubmit = async (data: BriefingFormData) => {
    const briefingData: BriefingData = {
      nome_empresa: data.nome_empresa,
      cnpj: data.cnpj,
      segmento: data.segmento,
      endereco: data.endereco,
      cidade: data.cidade,
      estado: data.estado,
      site_atual: data.site_atual,
      responsavel_projeto: data.responsavel_projeto,
      cargo_funcao: data.cargo_funcao,
      contato: data.contato,
      data_inicio_projeto: data.data_inicio_projeto,
      forma_juridica: data.forma_juridica,
      estrutura_organizacao: estruturaOrg,
      sistemas_integracoes: sistemasInt,
      produtos_fornecimento: produtosForn,
      mercado_estrategia: mercadoEst,
      comunicacao_relacionamento: comunicacaoRel,
      operacao_logistica: operacaoLog,
      observacoes_gerais: data.observacoes_gerais,
    };

    try {
      await createBriefing.mutateAsync(briefingData);
      navigate("/");
    } catch (error) {
      console.error("Erro ao enviar briefing:", error);
    }
  };

  const sections = [
    { title: "Informações Gerais", key: "geral" },
    { title: "Estrutura e Organização", key: "estrutura" },
    { title: "Sistemas e Integrações", key: "sistemas" },
    { title: "Produtos e Fornecimento", key: "produtos" },
    { title: "Mercado e Estratégia", key: "mercado" },
    { title: "Comunicação e Relacionamento", key: "comunicacao" },
    { title: "Operação e Logística", key: "operacao" },
    { title: "Observações Finais", key: "observacoes" },
  ];

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Nome da Empresa *</Label>
                <Input {...register("nome_empresa")} />
                {errors.nome_empresa && <p className="text-sm text-destructive">{errors.nome_empresa.message}</p>}
              </div>
              <div>
                <Label>CNPJ *</Label>
                <Input {...register("cnpj")} />
                {errors.cnpj && <p className="text-sm text-destructive">{errors.cnpj.message}</p>}
              </div>
            </div>
            
            <div>
              <Label>Segmento / Categoria de Produtos *</Label>
              <Input {...register("segmento")} />
              {errors.segmento && <p className="text-sm text-destructive">{errors.segmento.message}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Endereço</Label>
                <Input {...register("endereco")} />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input {...register("cidade")} />
              </div>
              <div>
                <Label>Estado</Label>
                <Input {...register("estado")} />
              </div>
            </div>

            <div>
              <Label>Site atual (se houver)</Label>
              <Input {...register("site_atual")} placeholder="https://" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Responsável pelo projeto *</Label>
                <Input {...register("responsavel_projeto")} />
                {errors.responsavel_projeto && <p className="text-sm text-destructive">{errors.responsavel_projeto.message}</p>}
              </div>
              <div>
                <Label>Cargo / Função</Label>
                <Input {...register("cargo_funcao")} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Contato (WhatsApp / E-mail) *</Label>
                <Input {...register("contato")} />
                {errors.contato && <p className="text-sm text-destructive">{errors.contato.message}</p>}
              </div>
              <div>
                <Label>Data de início do projeto</Label>
                <Input type="date" {...register("data_inicio_projeto")} />
              </div>
            </div>

            <div>
              <Label>Forma jurídica da empresa</Label>
              <Input {...register("forma_juridica")} placeholder="LTDA, MEI, etc." />
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            <QuestionInput 
              question="Há quanto tempo a empresa está em operação?"
              value={estruturaOrg.q1 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q1: val})}
            />
            <QuestionInput 
              question="A equipe e a infraestrutura física já foram definidas?"
              value={estruturaOrg.q2 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q2: val})}
            />
            <QuestionInput 
              question="Já possui identidade visual (nome, logotipo, paleta de cores, tipografia)?"
              value={estruturaOrg.q3 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q3: val})}
            />
            <QuestionInput 
              question="Já possui o registro do domínio da loja virtual?"
              value={estruturaOrg.q4 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q4: val})}
            />
            <QuestionInput 
              question="A empresa possui profissional capacitado para operar o e-commerce?"
              value={estruturaOrg.q5 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q5: val})}
            />
            <QuestionInput 
              question="A empresa possui CNPJ ativo e regularizado?"
              value={estruturaOrg.q6 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q6: val})}
            />
            <QuestionInput 
              question="Os tributos e encargos sobre a venda online já foram considerados nos custos da operação?"
              value={estruturaOrg.q7 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q7: val})}
            />
            <QuestionInput 
              question="A empresa já possui políticas internas definidas (troca, devolução, garantia, privacidade)?"
              value={estruturaOrg.q8 || ""}
              onChange={(val) => setEstruturaOrg({...estruturaOrg, q8: val})}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <QuestionInput 
              question="A empresa utiliza algum ERP? Se sim, qual?"
              value={sistemasInt.q1 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q1: val})}
            />
            <QuestionInput 
              question="Qual o banco principal da empresa?"
              value={sistemasInt.q2 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q2: val})}
            />
            <QuestionInput 
              question="Qual o gateway de pagamento da empresa?"
              value={sistemasInt.q3 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q3: val})}
            />
            <QuestionInput 
              question="A empresa possui mais de um centro de distribuição (CD)?"
              value={sistemasInt.q4 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q4: val})}
            />
            <QuestionInput 
              question="Há integração entre o ERP e o controle de estoque físico?"
              value={sistemasInt.q5 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q5: val})}
            />
            <QuestionInput 
              question="Utiliza algum sistema de emissão de notas fiscais (NFe) integrado?"
              value={sistemasInt.q6 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q6: val})}
            />
            <QuestionInput 
              question="Já conhece os custos e taxas de sistemas de pagamento e antifraude?"
              value={sistemasInt.q7 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q7: val})}
            />
            <QuestionInput 
              question="Pretende integrar com marketplaces (Amazon, Mercado Livre, Magalu, etc.)?"
              value={sistemasInt.q8 || ""}
              onChange={(val) => setSistemasInt({...sistemasInt, q8: val})}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <QuestionInput 
              question="Quantos produtos a empresa possui atualmente?"
              value={produtosForn.q1 || ""}
              onChange={(val) => setProdutosForn({...produtosForn, q1: val})}
            />
            <QuestionInput 
              question="Os produtos já foram cadastrados e possuem fotos e descrições otimizadas?"
              value={produtosForn.q2 || ""}
              onChange={(val) => setProdutosForn({...produtosForn, q2: val})}
            />
            <QuestionInput 
              question="Os produtos a serem comercializados já foram adquiridos e estão prontos para venda?"
              value={produtosForn.q3 || ""}
              onChange={(val) => setProdutosForn({...produtosForn, q3: val})}
            />
            <QuestionInput 
              question="Possui fornecedores fixos? Quais são e qual a periodicidade de reposição?"
              value={produtosForn.q4 || ""}
              onChange={(val) => setProdutosForn({...produtosForn, q4: val})}
            />
            <QuestionInput 
              question="A empresa trabalha com estoque próprio, sob demanda ou terceirizado?"
              value={produtosForn.q5 || ""}
              onChange={(val) => setProdutosForn({...produtosForn, q5: val})}
            />
            <QuestionInput 
              question="Existem produtos com variações (tamanho, cor, modelo)?"
              value={produtosForn.q6 || ""}
              onChange={(val) => setProdutosForn({...produtosForn, q6: val})}
            />
            <QuestionInput 
              question="O mix de produtos será o mesmo da loja física ou diferenciado para o digital?"
              value={produtosForn.q7 || ""}
              onChange={(val) => setProdutosForn({...produtosForn, q7: val})}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <QuestionInput 
              question="Você conhece bem o seu mercado de atuação?"
              value={mercadoEst.q1 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q1: val})}
            />
            <QuestionInput 
              question="Cite 3 concorrentes diretos da sua região."
              value={mercadoEst.q2 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q2: val})}
            />
            <QuestionInput 
              question="Cite suas principais referências (marcas ou operações que inspiram seu negócio)."
              value={mercadoEst.q3 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q3: val})}
            />
            <QuestionInput 
              question="Você sabe como as outras lojas virtuais atuam no mercado?"
              value={mercadoEst.q4 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q4: val})}
            />
            <QuestionInput 
              question="O negócio é considerado inovador dentro do segmento?"
              value={mercadoEst.q5 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q5: val})}
            />
            <QuestionInput 
              question="Quanto a empresa investe, em média, em marketing digital por mês?"
              value={mercadoEst.q6 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q6: val})}
            />
            <QuestionInput 
              question="Quais canais de divulgação a empresa já utiliza (Meta Ads, Google Ads, influenciadores etc.)?"
              value={mercadoEst.q7 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q7: val})}
            />
            <QuestionInput 
              question="Qual é o principal objetivo com o e-commerce nos próximos 12 meses?"
              value={mercadoEst.q8 || ""}
              onChange={(val) => setMercadoEst({...mercadoEst, q8: val})}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <QuestionInput 
              question="A empresa utiliza as redes sociais para gerar vendas ou apenas engajamento?"
              value={comunicacaoRel.q1 || ""}
              onChange={(val) => setComunicacaoRel({...comunicacaoRel, q1: val})}
            />
            <QuestionInput 
              question="Possui estrutura ou equipe de atendimento (SAC / WhatsApp / Chat)?"
              value={comunicacaoRel.q2 || ""}
              onChange={(val) => setComunicacaoRel({...comunicacaoRel, q2: val})}
            />
            <QuestionInput 
              question="Já tem uma equipe definida para gerenciar o e-commerce?"
              value={comunicacaoRel.q3 || ""}
              onChange={(val) => setComunicacaoRel({...comunicacaoRel, q3: val})}
            />
            <QuestionInput 
              question="Existe rotina de pós-venda (pesquisa de satisfação, acompanhamento de entrega, reativação de clientes)?"
              value={comunicacaoRel.q4 || ""}
              onChange={(val) => setComunicacaoRel({...comunicacaoRel, q4: val})}
            />
            <QuestionInput 
              question="A empresa trabalha com base de dados de clientes (CRM, planilhas, e-mails, etc.)?"
              value={comunicacaoRel.q5 || ""}
              onChange={(val) => setComunicacaoRel({...comunicacaoRel, q5: val})}
            />
            <QuestionInput 
              question="Há automações de comunicação ativa (ex: e-mail marketing, WhatsApp, SMS)?"
              value={comunicacaoRel.q6 || ""}
              onChange={(val) => setComunicacaoRel({...comunicacaoRel, q6: val})}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <QuestionInput 
              question="Quantos produtos estão disponíveis para venda?"
              value={operacaoLog.q1 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q1: val})}
            />
            <QuestionInput 
              question="Qual é o ticket médio atual (ou estimado)?"
              value={operacaoLog.q2 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q2: val})}
            />
            <QuestionInput 
              question="Como é feito o controle de estoque e saída de pedidos?"
              value={operacaoLog.q3 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q3: val})}
            />
            <QuestionInput 
              question="A empresa oferece mais de uma alternativa de entrega?"
              value={operacaoLog.q4 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q4: val})}
            />
            <QuestionInput 
              question="Já possui contrato ou integração com transportadoras / Correios?"
              value={operacaoLog.q5 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q5: val})}
            />
            <QuestionInput 
              question="Trabalha com frete próprio, terceirizado ou híbrido?"
              value={operacaoLog.q6 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q6: val})}
            />
            <QuestionInput 
              question="Já possui embalagens padronizadas e identificadas com a marca?"
              value={operacaoLog.q7 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q7: val})}
            />
            <QuestionInput 
              question="Pretende operar com política de frete grátis ou frete promocional?"
              value={operacaoLog.q8 || ""}
              onChange={(val) => setOperacaoLog({...operacaoLog, q8: val})}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <Label>Observações Gerais</Label>
              <Textarea 
                {...register("observacoes_gerais")} 
                rows={8}
                placeholder="Espaço destinado para informações complementares, particularidades da operação, observações fiscais, comerciais ou técnicas relevantes ao projeto."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Briefing de Implantação de E-commerce</h1>
          <p className="text-muted-foreground">
            Este formulário tem como objetivo reunir todas as informações essenciais para o início do projeto.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((section, index) => (
              <button
                key={section.key}
                onClick={() => setCurrentSection(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  currentSection === index 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {index + 1}. {section.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">{sections[currentSection].title}</h2>
            {renderSectionContent()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                Anterior
              </Button>
              
              {currentSection < sections.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                >
                  Próximo
                </Button>
              ) : (
                <Button type="submit" disabled={createBriefing.isPending}>
                  {createBriefing.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar Briefing
                </Button>
              )}
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

const QuestionInput = ({ question, value, onChange }: { question: string; value: string; onChange: (val: string) => void }) => {
  return (
    <div>
      <Label>{question}</Label>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  );
};

export default Briefing;
