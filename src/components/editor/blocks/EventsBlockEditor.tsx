import { useState } from 'react';
import { EventsBlock, EventCategory } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, GripVertical, Image as ImageIcon, AlertCircle, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { MediaSelector } from '../MediaSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface EventsBlockEditorProps {
  block: EventsBlock;
  onChange: (block: EventsBlock) => void;
}

const EVENT_CATEGORIES: EventCategory[] = [
  'Ecommerce',
  'Marketplace',
  'ERP',
  'Logística',
  'Varejo',
  'Tecnologia',
  'Inovação',
];

export const EventsBlockEditor = ({ block, onChange }: EventsBlockEditorProps) => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);
  const [openEvents, setOpenEvents] = useState<Set<string>>(new Set());

  const toggleEvent = (eventId: string) => {
    setOpenEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const collapseAll = () => setOpenEvents(new Set());
  const expandAll = () => setOpenEvents(new Set((block.events || []).map(e => e.id)));

  const isEventComplete = (event: EventsBlock['events'][0]) => {
    return event.nome && event.nome !== 'Novo Evento' && 
           event.data && event.data !== 'A definir' &&
           event.imagem && event.imagem !== '/placeholder.svg';
  };

  const updateBlock = (updates: Partial<EventsBlock>) => {
    onChange({ ...block, ...updates });
  };

  const addEvent = () => {
    const newEvent = {
      id: uuid(),
      nome: 'Novo Evento',
      resumo: '',
      imagem: '/placeholder.svg',
      data: 'A definir',
      local: 'A definir',
      modalidade: 'Presencial' as const,
      categoria: undefined as EventCategory | undefined,
      publicoAlvo: '',
      valor: 'A confirmar' as const,
      participacaoSebrae: '',
      descricao: '',
      linkMaisInfo: '',
      linkInscricao: '',
    };
    updateBlock({ events: [...(block.events || []), newEvent] });
  };

  const updateEvent = (index: number, updates: Partial<EventsBlock['events'][0]>) => {
    const newEvents = [...(block.events || [])];
    newEvents[index] = { ...newEvents[index], ...updates };
    updateBlock({ events: newEvents });
  };

  const removeEvent = (index: number) => {
    const newEvents = (block.events || []).filter((_, i) => i !== index);
    updateBlock({ events: newEvents });
  };

  const handleImageSelect = (url: string) => {
    if (editingEventIndex !== null) {
      updateEvent(editingEventIndex, { imagem: url });
    }
    setIsMediaOpen(false);
    setEditingEventIndex(null);
  };

  return (
    <div className="space-y-6 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vitrine de Eventos</h3>
      </div>

      {/* Dica sobre hierarquia de título */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          O H1 da página é o título do post. O título da seção aqui é opcional e, quando visível, será renderizado como H2 para manter a hierarquia correta.
        </AlertDescription>
      </Alert>

      {/* Configurações gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título da Seção (H2)</Label>
          <Input
            value={block.title || ''}
            onChange={(e) => updateBlock({ title: e.target.value })}
            placeholder="Vitrine de Eventos"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Input
            value={block.subtitle || ''}
            onChange={(e) => updateBlock({ subtitle: e.target.value })}
            placeholder="Descrição da vitrine"
          />
        </div>
      </div>

      {/* Texto introdutório do calendário */}
      <div className="space-y-4 p-4 bg-background rounded-lg border">
        <h4 className="text-sm font-medium">Texto antes do calendário</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={block.calendarIntroTitle || ''}
              onChange={(e) => updateBlock({ calendarIntroTitle: e.target.value })}
              placeholder="Ex: Calendário de Eventos"
            />
          </div>
          <div className="space-y-2">
            <Label>Texto explicativo</Label>
            <Input
              value={block.calendarIntroText || ''}
              onChange={(e) => updateBlock({ calendarIntroText: e.target.value })}
              placeholder="Ex: Clique em uma data para filtrar os eventos"
            />
          </div>
        </div>
      </div>

      {/* Texto introdutório da listagem */}
      <div className="space-y-4 p-4 bg-background rounded-lg border">
        <h4 className="text-sm font-medium">Texto antes da listagem de eventos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={block.eventsIntroTitle || ''}
              onChange={(e) => updateBlock({ eventsIntroTitle: e.target.value })}
              placeholder="Ex: Todos os Eventos"
            />
          </div>
          <div className="space-y-2">
            <Label>Texto explicativo</Label>
            <Input
              value={block.eventsIntroText || ''}
              onChange={(e) => updateBlock({ eventsIntroText: e.target.value })}
              placeholder="Ex: Confira todos os eventos do setor"
            />
          </div>
        </div>
      </div>

      {/* Toggles de configuração */}
      <div className="space-y-3 p-4 bg-background rounded-lg border">
        <h4 className="text-sm font-medium mb-3">Opções de exibição</h4>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Exibir título da seção</Label>
            <p className="text-xs text-muted-foreground">Quando desativado, apenas o subtítulo será exibido</p>
          </div>
          <Switch
            checked={block.showTitle ?? false}
            onCheckedChange={(checked) => updateBlock({ showTitle: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Mostrar calendário</Label>
            <p className="text-xs text-muted-foreground">Calendário interativo para filtrar eventos por data</p>
          </div>
          <Switch
            checked={block.showCalendar ?? true}
            onCheckedChange={(checked) => updateBlock({ showCalendar: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Mostrar filtros de busca</Label>
            <p className="text-xs text-muted-foreground">Busca, categoria, modalidade e valor</p>
          </div>
          <Switch
            checked={block.showFilters ?? true}
            onCheckedChange={(checked) => updateBlock({ showFilters: checked })}
          />
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Label className="text-base">Eventos ({(block.events || []).length})</Label>
          <div className="flex items-center gap-2">
            {(block.events || []).length > 0 && (
              <>
                <Button onClick={collapseAll} size="sm" variant="ghost" className="text-xs">
                  Recolher todos
                </Button>
                <Button onClick={expandAll} size="sm" variant="ghost" className="text-xs">
                  Expandir todos
                </Button>
              </>
            )}
            <Button onClick={addEvent} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Evento
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {(block.events || []).map((event, index) => {
            const isOpen = openEvents.has(event.id);
            const isComplete = isEventComplete(event);

            return (
              <Collapsible
                key={event.id}
                open={isOpen}
                onOpenChange={() => toggleEvent(event.id)}
              >
                <div className="border rounded-lg bg-card overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 cursor-grab" />
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        {event.imagem && event.imagem !== '/placeholder.svg' ? (
                          <img
                            src={event.imagem}
                            alt={event.nome}
                            className="w-10 h-10 object-cover rounded flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {event.nome || 'Sem nome'}
                            </span>
                            {isComplete && (
                              <Badge variant="secondary" className="flex-shrink-0 gap-1 text-xs bg-green-500/10 text-green-600">
                                <Check className="w-3 h-3" />
                                Completo
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {event.data} • {event.local} • {event.modalidade}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEvent(index);
                        }}
                        className="text-destructive hover:text-destructive flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-4 border-t">
                      {/* Imagem */}
                      <div className="space-y-2 pt-4">
                        <Label>Imagem do Evento *</Label>
                        <div className="flex items-center gap-4">
                          {event.imagem && event.imagem !== '/placeholder.svg' ? (
                            <img
                              src={event.imagem}
                              alt={event.nome}
                              className="w-24 h-16 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-24 h-16 bg-muted rounded border flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingEventIndex(index);
                              setIsMediaOpen(true);
                            }}
                          >
                            Selecionar Imagem
                          </Button>
                        </div>
                      </div>

                      {/* Nome e Data */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome do Evento *</Label>
                          <Input
                            value={event.nome}
                            onChange={(e) => updateEvent(index, { nome: e.target.value })}
                            placeholder="Nome do evento"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Data *</Label>
                          <Input
                            value={event.data}
                            onChange={(e) => updateEvent(index, { data: e.target.value })}
                            placeholder="Ex: 20 a 23 de março de 2026"
                          />
                          <p className="text-xs text-muted-foreground">Formatos: DD/MM/AAAA ou texto descritivo</p>
                        </div>
                      </div>

                      {/* Resumo */}
                      <div className="space-y-2">
                        <Label>Resumo do Evento</Label>
                        <Input
                          value={event.resumo || ''}
                          onChange={(e) => updateEvent(index, { resumo: e.target.value })}
                          placeholder="Breve descrição do evento (exibido abaixo do nome)"
                        />
                      </div>

                      {/* Local e Modalidade */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Local *</Label>
                          <Input
                            value={event.local}
                            onChange={(e) => updateEvent(index, { local: e.target.value })}
                            placeholder="Ex: São Paulo - SP"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Modalidade *</Label>
                          <Select
                            value={event.modalidade}
                            onValueChange={(value) => updateEvent(index, { modalidade: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Presencial">Presencial</SelectItem>
                              <SelectItem value="Online">Online</SelectItem>
                              <SelectItem value="Híbrido">Híbrido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Categoria e Valor */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Categoria do Evento</Label>
                          <Select
                            value={event.categoria || ''}
                            onValueChange={(value) => updateEvent(index, { categoria: value as EventCategory })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Valor</Label>
                          <Select
                            value={event.valor || 'A confirmar'}
                            onValueChange={(value) => updateEvent(index, { valor: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Gratuito">Gratuito</SelectItem>
                              <SelectItem value="Pago">Pago</SelectItem>
                              <SelectItem value="A confirmar">A confirmar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Para quem é */}
                      <div className="space-y-2">
                        <Label>Para quem é (Público-alvo)</Label>
                        <Input
                          value={event.publicoAlvo || ''}
                          onChange={(e) => updateEvent(index, { publicoAlvo: e.target.value })}
                          placeholder="Ex: Empreendedores, lojistas, startups"
                        />
                      </div>

                      {/* Participação e Organização */}
                      <div className="space-y-2">
                        <Label>Participação/Organização</Label>
                        <Input
                          value={event.participacaoSebrae || ''}
                          onChange={(e) => updateEvent(index, { participacaoSebrae: e.target.value })}
                          placeholder="Ex: Organizador, Patrocinador, Parceiro"
                        />
                      </div>

                      {/* Links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Link - Mais Informações</Label>
                          <Input
                            value={event.linkMaisInfo || ''}
                            onChange={(e) => updateEvent(index, { linkMaisInfo: e.target.value })}
                            placeholder="https://..."
                            type="url"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link - Inscrição (opcional)</Label>
                          <Input
                            value={event.linkInscricao || ''}
                            onChange={(e) => updateEvent(index, { linkInscricao: e.target.value })}
                            placeholder="https://..."
                            type="url"
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>

        {(block.events || []).length === 0 && (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
            <p>Nenhum evento adicionado</p>
            <Button onClick={addEvent} variant="link" className="mt-2">
              Adicionar primeiro evento
            </Button>
          </div>
        )}
      </div>

      <MediaSelector
        open={isMediaOpen}
        onClose={() => {
          setIsMediaOpen(false);
          setEditingEventIndex(null);
        }}
        onSelect={handleImageSelect}
      />
    </div>
  );
};
