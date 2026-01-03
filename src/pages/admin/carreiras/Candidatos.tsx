import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandidaturas, useUpdateCandidatura, useDeleteCandidatura, Candidatura } from "@/hooks/useCandidaturas";
import { useVagas } from "@/hooks/useVagas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Eye, 
  Trash2, 
  Loader2, 
  Mail, 
  Phone, 
  Linkedin, 
  Globe, 
  FileText,
  ExternalLink,
  Filter,
  Users
} from "lucide-react";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  novo: { label: "Novo", variant: "default" },
  em_analise: { label: "Em Análise", variant: "secondary" },
  entrevista: { label: "Entrevista", variant: "outline" },
  aprovado: { label: "Aprovado", variant: "default" },
  reprovado: { label: "Reprovado", variant: "destructive" },
};

const nivelLabels: Record<string, string> = {
  estagio: "Estágio",
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
};

export default function AdminCandidatos() {
  const [filtroVaga, setFiltroVaga] = useState<string>("todas");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const { data: candidaturas, isLoading } = useCandidaturas();
  const { data: vagas } = useVagas();
  const updateCandidatura = useUpdateCandidatura();
  const deleteCandidatura = useDeleteCandidatura();

  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notas, setNotas] = useState("");

  const filteredCandidaturas = candidaturas?.filter((c) => {
    if (filtroVaga !== "todas" && c.vaga_id !== filtroVaga) return false;
    if (filtroStatus !== "todos" && c.status !== filtroStatus) return false;
    return true;
  });

  const openDetails = (candidatura: Candidatura) => {
    setSelectedCandidatura(candidatura);
    setNotas(candidatura.notas_internas || "");
    
    // Marcar como lido
    if (!candidatura.lido) {
      updateCandidatura.mutate({ id: candidatura.id, lido: true });
    }
  };

  const updateStatus = async (status: string) => {
    if (selectedCandidatura) {
      await updateCandidatura.mutateAsync({ 
        id: selectedCandidatura.id, 
        status,
        notas_internas: notas 
      });
      setSelectedCandidatura(null);
    }
  };

  const saveNotas = async () => {
    if (selectedCandidatura) {
      await updateCandidatura.mutateAsync({ 
        id: selectedCandidatura.id, 
        notas_internas: notas 
      });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCandidatura.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const stats = {
    total: candidaturas?.length || 0,
    novos: candidaturas?.filter(c => c.status === "novo").length || 0,
    emAnalise: candidaturas?.filter(c => c.status === "em_analise").length || 0,
    aprovados: candidaturas?.filter(c => c.status === "aprovado").length || 0,
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Candidaturas</h1>
          <p className="text-muted-foreground">
            Gerencie os candidatos recebidos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Novos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.novos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.emAnalise}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.aprovados}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          <Select value={filtroVaga} onValueChange={setFiltroVaga}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por vaga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as vagas</SelectItem>
              {vagas?.map((vaga) => (
                <SelectItem key={vaga.id} value={vaga.id}>
                  {vaga.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {Object.entries(statusLabels).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidaturas?.map((candidatura) => (
                  <TableRow 
                    key={candidatura.id}
                    className={!candidatura.lido ? "bg-primary/5" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!candidatura.lido && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <div>
                          <div className="font-medium">{candidatura.nome}</div>
                          <div className="text-sm text-muted-foreground">{candidatura.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {candidatura.vaga?.titulo || (
                        <span className="text-muted-foreground italic">Espontânea</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {nivelLabels[candidatura.nivel_experiencia || ""] || candidatura.nivel_experiencia || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusLabels[candidatura.status]?.variant || "secondary"}>
                        {statusLabels[candidatura.status]?.label || candidatura.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(candidatura.criado_em), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetails(candidatura)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(candidatura.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!filteredCandidaturas || filteredCandidaturas.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Nenhuma candidatura encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedCandidatura} onOpenChange={() => setSelectedCandidatura(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCandidatura && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedCandidatura.nome}</span>
                  <Badge variant={statusLabels[selectedCandidatura.status]?.variant || "secondary"}>
                    {statusLabels[selectedCandidatura.status]?.label || selectedCandidatura.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${selectedCandidatura.email}`} className="hover:underline">
                      {selectedCandidatura.email}
                    </a>
                  </div>
                  {selectedCandidatura.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedCandidatura.telefone}`} className="hover:underline">
                        {selectedCandidatura.telefone}
                      </a>
                    </div>
                  )}
                  {selectedCandidatura.linkedin_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={selectedCandidatura.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {selectedCandidatura.portfolio_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={selectedCandidatura.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        Portfólio <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Job Info */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vaga:</span>
                    <span className="font-medium">
                      {selectedCandidatura.vaga?.titulo || "Candidatura Espontânea"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nível:</span>
                    <span className="font-medium">
                      {nivelLabels[selectedCandidatura.nivel_experiencia || ""] || selectedCandidatura.nivel_experiencia || "-"}
                    </span>
                  </div>
                  {selectedCandidatura.pretensao_salarial && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pretensão salarial:</span>
                      <span className="font-medium">{selectedCandidatura.pretensao_salarial}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data da candidatura:</span>
                    <span className="font-medium">
                      {format(new Date(selectedCandidatura.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>

                {/* CV */}
                {selectedCandidatura.curriculo_url && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Currículo</Label>
                    <a 
                      href={selectedCandidatura.curriculo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-1 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <span>Baixar currículo</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </div>
                )}

                {/* Message */}
                {selectedCandidatura.mensagem && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Mensagem do candidato</Label>
                    <p className="mt-1 p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-line">
                      {selectedCandidatura.mensagem}
                    </p>
                  </div>
                )}

                {/* Internal Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas internas</Label>
                  <Textarea
                    id="notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Adicione observações sobre o candidato..."
                    rows={3}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={saveNotas}
                    disabled={updateCandidatura.isPending}
                  >
                    Salvar notas
                  </Button>
                </div>

                {/* Status Update */}
                <div className="space-y-2">
                  <Label>Atualizar status</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusLabels).map(([value, { label }]) => (
                      <Button
                        key={value}
                        variant={selectedCandidatura.status === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStatus(value)}
                        disabled={updateCandidatura.isPending}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedCandidatura(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir candidatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A candidatura será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
