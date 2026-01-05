import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  useDiagnostics, 
  useDiagnosticStats, 
  useUpdateDiagnostic, 
  useDeleteDiagnostic,
  DiagnosticRecord 
} from '@/hooks/useDiagnostics';
import { DiagnosticResult } from '@/components/diagnostico/DiagnosticResult';
import { 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  ArrowUpDown, 
  BarChart3, 
  Users, 
  Award, 
  Calendar,
  Mail,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getScoreLevel } from '@/data/diagnosticData';

type SortField = 'created_at' | 'name' | 'score';
type SortOrder = 'asc' | 'desc';

const DiagnosticsList = () => {
  const { data: diagnostics = [], isLoading } = useDiagnostics();
  const { data: stats } = useDiagnosticStats();
  const updateDiagnostic = useUpdateDiagnostic();
  const deleteDiagnostic = useDeleteDiagnostic();
  
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticRecord | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredDiagnostics = diagnostics
    .filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.store_url.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleViewDiagnostic = (diagnostic: DiagnosticRecord) => {
    setSelectedDiagnostic(diagnostic);
    if (!diagnostic.lido) {
      updateDiagnostic.mutate({ id: diagnostic.id, lido: true });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Data', 'Nome', 'Email', 'URL da Loja', 'Instagram', 'WhatsApp', 'Score'];
    const rows = filteredDiagnostics.map(d => [
      format(new Date(d.created_at), 'dd/MM/yyyy'),
      d.name,
      d.email,
      d.store_url,
      `@${d.instagram}`,
      d.whatsapp,
      d.score.toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `diagnosticos_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getScoreBadge = (score: number) => {
    const { level, bgColor } = getScoreLevel(score);
    return (
      <Badge className={cn(bgColor, "text-white")}>
        {score}% - {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleExportCSV} disabled={filteredDiagnostics.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.averageScore || 0}%</p>
                <p className="text-xs text-muted-foreground">Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.perfectScores || 0}</p>
                <p className="text-xs text-muted-foreground">Score 100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.last7Days || 0}</p>
                <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.unread || 0}</p>
                <p className="text-xs text-muted-foreground">Não lidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Lista de Diagnósticos</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : filteredDiagnostics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {search ? 'Nenhum diagnóstico encontrado' : 'Nenhum diagnóstico realizado ainda'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('created_at')}
                        className="flex items-center gap-1"
                      >
                        Data
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1"
                      >
                        Nome
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Loja</TableHead>
                    <TableHead className="hidden lg:table-cell">Instagram</TableHead>
                    <TableHead className="hidden md:table-cell">WhatsApp</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('score')}
                        className="flex items-center gap-1"
                      >
                        Score
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiagnostics.map((diagnostic) => (
                    <TableRow 
                      key={diagnostic.id}
                      className={cn(!diagnostic.lido && "bg-primary/5")}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!diagnostic.lido && (
                            <span className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          {format(new Date(diagnostic.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{diagnostic.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{diagnostic.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <a 
                          href={diagnostic.store_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate max-w-[150px] block"
                        >
                          {diagnostic.store_url}
                        </a>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">@{diagnostic.instagram}</TableCell>
                      <TableCell className="hidden md:table-cell">{diagnostic.whatsapp}</TableCell>
                      <TableCell>{getScoreBadge(diagnostic.score)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDiagnostic(diagnostic)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {diagnostic.lido ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateDiagnostic.mutate({ id: diagnostic.id, lido: false })}
                              title="Marcar como não lido"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateDiagnostic.mutate({ id: diagnostic.id, lido: true })}
                              title="Marcar como lido"
                            >
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este diagnóstico?')) {
                                deleteDiagnostic.mutate(diagnostic.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes */}
      <Dialog open={!!selectedDiagnostic} onOpenChange={() => setSelectedDiagnostic(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Diagnóstico</DialogTitle>
          </DialogHeader>
          {selectedDiagnostic && (
            <DiagnosticResult
              userData={{
                name: selectedDiagnostic.name,
                email: selectedDiagnostic.email,
                storeUrl: selectedDiagnostic.store_url,
                instagram: selectedDiagnostic.instagram,
                whatsapp: selectedDiagnostic.whatsapp,
                segments: [],
                sellsOnline: '',
                salesChannels: [],
                averageTicket: '',
                monthlyRevenue: ''
              }}
              answers={selectedDiagnostic.answers as Record<string, boolean>}
              onRestart={() => {}}
              isModal
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiagnosticsList;
