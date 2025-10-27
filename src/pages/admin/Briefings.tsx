import { useBriefings, useUpdateBriefing, useDeleteBriefing } from "@/hooks/useBriefings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, Download, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Briefings = () => {
  const navigate = useNavigate();
  const { data: briefings, isLoading } = useBriefings();
  const updateBriefing = useUpdateBriefing();
  const deleteBriefing = useDeleteBriefing();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    await updateBriefing.mutateAsync({ id, lido: !currentStatus });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBriefing.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Carregando briefings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Briefings Comerciais</h1>
        <p className="text-muted-foreground">
          Gerenciar briefings de implantação de e-commerce recebidos
        </p>
      </div>

      <div className="grid gap-4">
        {briefings && briefings.length > 0 ? (
          briefings.map((briefing) => (
            <Card key={briefing.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{briefing.nome_empresa}</h3>
                    {!briefing.lido && (
                      <Badge variant="default">Novo</Badge>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                    <div>
                      <span className="font-medium">CNPJ:</span> {briefing.cnpj}
                    </div>
                    <div>
                      <span className="font-medium">Segmento:</span> {briefing.segmento}
                    </div>
                    <div>
                      <span className="font-medium">Responsável:</span> {briefing.responsavel_projeto}
                    </div>
                    <div>
                      <span className="font-medium">Contato:</span> {briefing.contato}
                    </div>
                    {briefing.cidade && briefing.estado && (
                      <div>
                        <span className="font-medium">Localização:</span> {briefing.cidade} - {briefing.estado}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Recebido em:</span>{" "}
                      {briefing.criado_em && format(new Date(briefing.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin/briefings/${briefing.id}`)}
                    title="Visualizar briefing"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMarkAsRead(briefing.id!, briefing.lido!)}
                    title={briefing.lido ? "Marcar como não lido" : "Marcar como lido"}
                  >
                    <CheckCircle className={`h-4 w-4 ${briefing.lido ? 'text-primary' : ''}`} />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`/admin/briefings/${briefing.id}/pdf`, '_blank')}
                    title="Baixar PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteId(briefing.id!)}
                    title="Deletar briefing"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Nenhum briefing recebido ainda.</p>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O briefing será permanentemente deletado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Briefings;
