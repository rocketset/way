// Página de Leads unificada com formato Kanban
// Unifica contacts (formulários do site) e popup_leads em uma única visualização

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Mail, Phone, Building2, User, Calendar, MoreVertical, Trash2, MessageSquare, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Tipos
interface Lead {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  empresa?: string | null;
  mensagem?: string | null;
  assunto?: string | null;
  popup_nome?: string | null;
  criado_em: string;
  status_lead: string;
  source: 'contact' | 'popup';
}

// Colunas do Kanban
const KANBAN_COLUMNS = [
  { id: 'entrar_em_contato', label: 'Entrar em contato', color: 'bg-blue-500' },
  { id: 'em_contato', label: 'Em contato', color: 'bg-yellow-500' },
  { id: 'ganho', label: 'Ganho', color: 'bg-green-500' },
  { id: 'perdido', label: 'Perdido', color: 'bg-red-500' },
];

export default function LeadsKanban() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  // Carrega leads de ambas as fontes
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      // Busca contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('criado_em', { ascending: false });

      if (contactsError) throw contactsError;

      // Busca popup_leads
      const { data: popupLeads, error: popupError } = await supabase
        .from('popup_leads')
        .select('*, popups(nome)')
        .order('criado_em', { ascending: false });

      if (popupError) throw popupError;

      // Unifica os leads
      const unifiedLeads: Lead[] = [
        ...(contacts || []).map((c) => ({
          id: c.id,
          nome: c.nome,
          email: c.email,
          telefone: c.telefone,
          empresa: c.empresa,
          mensagem: c.mensagem,
          assunto: c.assunto,
          criado_em: c.criado_em,
          status_lead: c.status_lead || 'entrar_em_contato',
          source: 'contact' as const,
        })),
        ...(popupLeads || []).map((p) => ({
          id: p.id,
          nome: p.nome,
          email: p.email,
          telefone: p.telefone,
          popup_nome: (p.popups as { nome: string } | null)?.nome,
          criado_em: p.criado_em,
          status_lead: p.status_lead || 'entrar_em_contato',
          source: 'popup' as const,
        })),
      ];

      // Ordena por data
      unifiedLeads.sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
      setLeads(unifiedLeads);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      toast.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Atualiza status do lead
  const updateLeadStatus = async (lead: Lead, newStatus: string) => {
    try {
      const table = lead.source === 'contact' ? 'contacts' : 'popup_leads';
      const { error } = await supabase
        .from(table)
        .update({ status_lead: newStatus })
        .eq('id', lead.id);

      if (error) throw error;

      // Atualiza estado local
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status_lead: newStatus } : l))
      );
      toast.success('Status atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  // Delete lead
  const deleteLead = async (lead: Lead) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    try {
      const table = lead.source === 'contact' ? 'contacts' : 'popup_leads';
      const { error } = await supabase.from(table).delete().eq('id', lead.id);

      if (error) throw error;

      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      toast.success('Lead excluído!');
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      toast.error('Erro ao excluir lead');
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (draggedLead && draggedLead.status_lead !== columnId) {
      updateLeadStatus(draggedLead, columnId);
    }
    setDraggedLead(null);
  };

  // Exportar CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Nome', 'E-mail', 'Telefone', 'Empresa', 'Origem', 'Status', 'Data'];
    const rows = leads.map((lead) => [
      lead.nome || '',
      lead.email || '',
      lead.telefone || '',
      lead.empresa || lead.popup_nome || '',
      lead.source === 'contact' ? 'Formulário' : 'Popup',
      KANBAN_COLUMNS.find((c) => c.id === lead.status_lead)?.label || lead.status_lead,
      format(new Date(lead.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Leads por coluna
  const getLeadsByColumn = (columnId: string) =>
    leads.filter((lead) => lead.status_lead === columnId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie leads de formulários e popups do site
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchLeads}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={leads.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leads.length}</p>
          </CardContent>
        </Card>
        {KANBAN_COLUMNS.map((col) => (
          <Card key={col.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', col.color)} />
                {col.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getLeadsByColumn(col.id).length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {KANBAN_COLUMNS.map((column) => (
          <div
            key={column.id}
            className="bg-muted/30 rounded-lg p-4 min-h-[500px]"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={cn('w-3 h-3 rounded-full', column.color)} />
              <h3 className="font-semibold">{column.label}</h3>
              <Badge variant="secondary" className="ml-auto">
                {getLeadsByColumn(column.id).length}
              </Badge>
            </div>

            {/* Cards */}
            <ScrollArea className="h-[450px] pr-2">
              <div className="space-y-3">
                {getLeadsByColumn(column.id).map((lead) => (
                  <Card
                    key={lead.id}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                  >
                    <CardContent className="p-3 space-y-2">
                      {/* Header do Card */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm truncate">
                            {lead.nome || 'Sem nome'}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedLead(lead); setDialogOpen(true); }}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteLead(lead)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Email */}
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
                        >
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{lead.email}</span>
                        </a>
                      )}

                      {/* Telefone */}
                      {lead.telefone && (
                        <a
                          href={`tel:${lead.telefone}`}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{lead.telefone}</span>
                        </a>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge variant={lead.source === 'contact' ? 'default' : 'secondary'} className="text-xs">
                          {lead.source === 'contact' ? 'Formulário' : 'Popup'}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(lead.criado_em), 'dd/MM', { locale: ptBR })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getLeadsByColumn(column.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhum lead
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              {selectedLead && format(new Date(selectedLead.criado_em), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="mt-1">{selectedLead.nome || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                  <p className="mt-1">{selectedLead.email || '-'}</p>
                </div>
                {selectedLead.telefone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="mt-1">{selectedLead.telefone}</p>
                  </div>
                )}
                {selectedLead.empresa && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                    <p className="mt-1">{selectedLead.empresa}</p>
                  </div>
                )}
                {selectedLead.popup_nome && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Popup</p>
                    <p className="mt-1">{selectedLead.popup_nome}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Origem</p>
                  <Badge variant={selectedLead.source === 'contact' ? 'default' : 'secondary'}>
                    {selectedLead.source === 'contact' ? 'Formulário do site' : 'Popup'}
                  </Badge>
                </div>
              </div>

              {selectedLead.mensagem && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Mensagem</p>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <p className="whitespace-pre-wrap text-sm">{selectedLead.mensagem}</p>
                  </div>
                </div>
              )}

              {/* Alterar Status */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Alterar Status</p>
                <div className="flex flex-wrap gap-2">
                  {KANBAN_COLUMNS.map((col) => (
                    <Button
                      key={col.id}
                      variant={selectedLead.status_lead === col.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        updateLeadStatus(selectedLead, col.id);
                        setSelectedLead({ ...selectedLead, status_lead: col.id });
                      }}
                    >
                      <div className={cn('w-2 h-2 rounded-full mr-2', col.color)} />
                      {col.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
