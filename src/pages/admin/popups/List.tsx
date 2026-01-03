import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Copy, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { usePopups, useUpdatePopup, useDeletePopup, useCreatePopup } from "@/hooks/usePopups";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const tipoLabels: Record<string, string> = {
  anuncio: "Anúncio",
  lead: "Captura de Lead",
  cookie: "Cookies/LGPD",
  custom: "Personalizado",
};

const gatilhoLabels: Record<string, string> = {
  ao_carregar: "Ao carregar",
  apos_segundos: "Após segundos",
  exit_intent: "Exit Intent",
};

export default function PopupsList() {
  const { toast } = useToast();
  const { data: popups, isLoading } = usePopups();
  const updatePopup = useUpdatePopup();
  const deletePopup = useDeletePopup();
  const createPopup = useCreatePopup();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggleActive = async (id: string, ativo: boolean) => {
    try {
      await updatePopup.mutateAsync({ id, ativo });
      toast({
        title: ativo ? "Popup ativado" : "Popup desativado",
        description: "Status atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePopup.mutateAsync(deleteId);
      toast({
        title: "Popup excluído",
        description: "O popup foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o popup.",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleDuplicate = async (popup: typeof popups extends (infer T)[] | undefined ? T : never) => {
    if (!popup) return;
    try {
      await createPopup.mutateAsync({
        ...popup,
        id: undefined,
        nome: `${popup.nome} (cópia)`,
        ativo: false,
        criado_em: undefined,
        atualizado_em: undefined,
      } as any);
      toast({
        title: "Popup duplicado",
        description: "Uma cópia do popup foi criada.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o popup.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Popups</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os popups exibidos no site
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/popups/leads">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Leads
            </Button>
          </Link>
          <Link to="/admin/popups/novo">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Popup
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : popups && popups.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Gatilho</TableHead>
                  <TableHead>Páginas</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popups.map((popup) => (
                  <TableRow key={popup.id}>
                    <TableCell>
                      <Switch
                        checked={popup.ativo}
                        onCheckedChange={(checked) =>
                          handleToggleActive(popup.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{popup.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {tipoLabels[popup.tipo] || popup.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {gatilhoLabels[popup.gatilho] || popup.gatilho}
                        {popup.gatilho === 'apos_segundos' && ` (${popup.delay_segundos}s)`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {popup.paginas_alvo?.includes('todas')
                          ? 'Todas'
                          : `${popup.paginas_alvo?.length || 0} páginas`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(popup.criado_em), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(popup)}
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Link to={`/admin/popups/editar/${popup.id}`}>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(popup.id)}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p className="mb-4">Nenhum popup cadastrado</p>
              <Link to="/admin/popups/novo">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro popup
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir popup?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O popup será removido permanentemente
              junto com todos os leads capturados por ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
