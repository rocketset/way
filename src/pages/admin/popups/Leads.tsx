import { useState } from "react";
import { ArrowLeft, Download, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePopups, usePopupLeads } from "@/hooks/usePopups";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PopupLeads() {
  const [selectedPopup, setSelectedPopup] = useState<string>("all");
  const { data: popups } = usePopups();
  const { data: leads, isLoading } = usePopupLeads(
    selectedPopup === "all" ? undefined : selectedPopup
  );

  const handleExportCSV = () => {
    if (!leads || leads.length === 0) return;

    const headers = ["Nome", "E-mail", "Telefone", "Popup", "Data"];
    const rows = leads.map((lead) => [
      lead.nome || "",
      lead.email || "",
      lead.telefone || "",
      (lead as { popups?: { nome: string } }).popups?.nome || "",
      format(new Date(lead.criado_em), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `popup-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/popups">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leads Capturados</h1>
            <p className="text-muted-foreground mt-1">
              Leads coletados através dos popups do site
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPopup} onValueChange={setSelectedPopup}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por popup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os popups</SelectItem>
              {popups?.map((popup) => (
                <SelectItem key={popup.id} value={popup.id}>
                  {popup.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV} disabled={!leads?.length}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{leads?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com E-mail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {leads?.filter((l) => l.email).length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com Telefone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {leads?.filter((l) => l.telefone).length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : leads && leads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Popup</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {lead.nome || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.telefone ? (
                        <a
                          href={`tel:${lead.telefone}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Phone className="w-4 h-4" />
                          {lead.telefone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(lead as { popups?: { nome: string } }).popups?.nome || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(lead.criado_em), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum lead capturado ainda
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
