import { useParams, useNavigate } from "react-router-dom";
import { useBriefing } from "@/hooks/useBriefings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";

const BriefingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: briefing, isLoading } = useBriefing(id);
  const isPdfView = window.location.pathname.includes('/pdf');

  useEffect(() => {
    if (isPdfView && briefing) {
      document.title = `Briefing - ${briefing.nome_empresa}`;
    }
  }, [isPdfView, briefing]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!briefing) {
    return <div className="p-6">Briefing não encontrado</div>;
  }

  const renderSection = (title: string, data: Record<string, string>) => {
    const questions = Object.entries(data);
    if (questions.length === 0) return null;

    return (
      <div className="mb-6 page-break-inside-avoid">
        <h3 className="text-lg font-bold mb-3 text-primary">{title}</h3>
        <div className="space-y-3">
          {questions.map(([key, value]) => {
            const questionNumber = key.replace('q', '');
            return (
              <div key={key} className="pl-4">
                <p className="text-sm font-medium mb-1">Pergunta {questionNumber}:</p>
                <p className="text-sm text-muted-foreground pl-4">{value || "Não respondido"}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={isPdfView ? "print-view" : "p-6"}>
      {!isPdfView && (
        <div className="mb-6 flex items-center justify-between no-print">
          <Button variant="outline" onClick={() => navigate("/admin/briefings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir / Salvar PDF
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white p-8 print-content">
        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold mb-2">Briefing de Implantação de E-commerce</h1>
          <p className="text-muted-foreground">
            Recebido em {format(new Date(briefing.criado_em!), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>

        {/* Informações Gerais */}
        <div className="mb-8 page-break-inside-avoid">
          <h2 className="text-2xl font-bold mb-4 text-primary">1. Informações Gerais</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Nome da Empresa</p>
              <p className="text-sm text-muted-foreground">{briefing.nome_empresa}</p>
            </div>
            <div>
              <p className="text-sm font-medium">CNPJ</p>
              <p className="text-sm text-muted-foreground">{briefing.cnpj}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Segmento</p>
              <p className="text-sm text-muted-foreground">{briefing.segmento}</p>
            </div>
            {briefing.endereco && (
              <div>
                <p className="text-sm font-medium">Endereço</p>
                <p className="text-sm text-muted-foreground">{briefing.endereco}</p>
              </div>
            )}
            {briefing.cidade && (
              <div>
                <p className="text-sm font-medium">Cidade</p>
                <p className="text-sm text-muted-foreground">{briefing.cidade}</p>
              </div>
            )}
            {briefing.estado && (
              <div>
                <p className="text-sm font-medium">Estado</p>
                <p className="text-sm text-muted-foreground">{briefing.estado}</p>
              </div>
            )}
            {briefing.site_atual && (
              <div>
                <p className="text-sm font-medium">Site Atual</p>
                <p className="text-sm text-muted-foreground">{briefing.site_atual}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Responsável pelo Projeto</p>
              <p className="text-sm text-muted-foreground">{briefing.responsavel_projeto}</p>
            </div>
            {briefing.cargo_funcao && (
              <div>
                <p className="text-sm font-medium">Cargo / Função</p>
                <p className="text-sm text-muted-foreground">{briefing.cargo_funcao}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Contato</p>
              <p className="text-sm text-muted-foreground">{briefing.contato}</p>
            </div>
            {briefing.data_inicio_projeto && (
              <div>
                <p className="text-sm font-medium">Data de Início do Projeto</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(briefing.data_inicio_projeto), "dd/MM/yyyy")}
                </p>
              </div>
            )}
            {briefing.forma_juridica && (
              <div>
                <p className="text-sm font-medium">Forma Jurídica</p>
                <p className="text-sm text-muted-foreground">{briefing.forma_juridica}</p>
              </div>
            )}
          </div>
        </div>

        {/* Seções Dinâmicas */}
        {renderSection("2. Estrutura e Organização da Empresa", briefing.estrutura_organizacao)}
        {renderSection("3. Sistemas e Integrações", briefing.sistemas_integracoes)}
        {renderSection("4. Produtos e Fornecimento", briefing.produtos_fornecimento)}
        {renderSection("5. Mercado e Estratégia", briefing.mercado_estrategia)}
        {renderSection("6. Comunicação e Relacionamento", briefing.comunicacao_relacionamento)}
        {renderSection("7. Operação e Logística", briefing.operacao_logistica)}

        {/* Observações Gerais */}
        {briefing.observacoes_gerais && (
          <div className="mb-6 page-break-inside-avoid">
            <h3 className="text-lg font-bold mb-3 text-primary">8. Observações Gerais</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{briefing.observacoes_gerais}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>Way E-commerce - www.wayecommerce.com.br</p>
          <p>CNPJ: 27.195.145/0001-41</p>
        </div>
      </div>

      <style>{`
        @media print {
          body { 
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-content {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20mm !important;
          }
          .print-view {
            padding: 0 !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default BriefingView;
