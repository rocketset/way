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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Trash2, GripVertical, Image as ImageIcon, AlertCircle, ChevronDown, ChevronRight, Check, CalendarIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { MediaSelector } from '../MediaSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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

// Helper para parsear datas do formato DD/MM/YYYY
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Try DD/MM/YYYY format
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const date = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
    return isValid(date) ? date : null;
  }
  
  return null;
};

// Componente de Date Picker com suporte a período
interface EventDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const EventDatePicker = ({ value, onChange }: EventDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRange, setIsRange] = useState(() => value?.includes(' a ') || value?.includes(' - '));
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    if (!value || value === 'A definir') return undefined;
    if (value.includes(' a ') || value.includes(' - ')) {
      const parts = value.split(/ a | - /);
      return parseDate(parts[0].trim()) || undefined;
    }
    return parseDate(value) || undefined;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    if (!value || value === 'A definir') return undefined;
    if (value.includes(' a ') || value.includes(' - ')) {
      const parts = value.split(/ a | - /);
      if (parts[1]) {
        return parseDate(parts[1].trim()) || undefined;
      }
    }
    return undefined;
  });

  const formatDateStr = (date: Date) => format(date, 'dd/MM/yyyy');

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    if (isRange) {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(undefined);
      } else if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
        const result = `${formatDateStr(startDate)} a ${formatDateStr(date)}`;
        onChange(result);
        setIsOpen(false);
      }
    } else {
      setStartDate(date);
      setEndDate(undefined);
      onChange(formatDateStr(date));
      setIsOpen(false);
    }
  };

  const handleToggleRange = (checked: boolean) => {
    setIsRange(checked);
    setEndDate(undefined);
    if (!checked && startDate) {
      onChange(formatDateStr(startDate));
    }
  };

  const displayValue = () => {
    if (!value || value === 'A definir') {
      return <span className="text-muted-foreground">Selecione a data</span>;
    }
    return value;
  };

  const selectedDates = startDate && endDate && isRange
    ? [startDate, endDate]
    : startDate
    ? [startDate]
    : [];

  return (
    <div className="space-y-2">
      <Label>Data *</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Evento com período?</Label>
              <Switch
                checked={isRange}
                onCheckedChange={handleToggleRange}
              />
            </div>
            {isRange && startDate && !endDate && (
              <p className="text-xs text-muted-foreground">
                Selecione a data final
              </p>
            )}
            {isRange && startDate && endDate && (
              <p className="text-xs text-primary font-medium">
                {formatDateStr(startDate)} a {formatDateStr(endDate)}
              </p>
            )}
          </div>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleSelectDate}
            className="p-3 pointer-events-auto"
            locale={ptBR}
            modifiers={{
              inRange: (day) => {
                if (!isRange || !startDate || !endDate) return false;
                return day > startDate && day < endDate;
              },
              rangeStart: (day) => {
                if (!startDate) return false;
                return day.getTime() === startDate.getTime();
              },
              rangeEnd: (day) => {
                if (!isRange || !endDate) return false;
                return day.getTime() === endDate.getTime();
              },
            }}
            modifiersStyles={{
              inRange: { backgroundColor: 'hsl(var(--primary) / 0.1)' },
              rangeStart: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
              rangeEnd: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
            }}
          />
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">
        {isRange ? 'Selecione a data inicial e depois a data final' : 'Formato: DD/MM/AAAA'}
      </p>
    </div>
  );
};

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
                            {event.data} • {event.local} • {(event.modalidades || [event.modalidade]).join(', ')}
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
                        <EventDatePicker
                          value={event.data}
                          onChange={(date) => updateEvent(index, { data: date })}
                        />
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
                          <Label>Modalidades *</Label>
                          <div className="flex flex-wrap gap-2">
                            {(['Presencial', 'Online', 'Híbrido'] as const).map((mod) => {
                              const modalidades = event.modalidades || (event.modalidade ? [event.modalidade] : []);
                              const isSelected = modalidades.includes(mod);
                              return (
                                <Button
                                  key={mod}
                                  type="button"
                                  variant={isSelected ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => {
                                    const current = event.modalidades || (event.modalidade ? [event.modalidade] : []);
                                    const newModalidades = isSelected
                                      ? current.filter(m => m !== mod)
                                      : [...current, mod];
                                    updateEvent(index, { 
                                      modalidades: newModalidades,
                                      modalidade: newModalidades[0] || 'Presencial'
                                    });
                                  }}
                                >
                                  {isSelected && <Check className="w-3 h-3 mr-1" />}
                                  {mod}
                                </Button>
                              );
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">Selecione uma ou mais modalidades</p>
                        </div>
                      </div>

                      {/* Categoria e Valor */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Categorias do Evento</Label>
                          <div className="flex flex-wrap gap-2">
                            {EVENT_CATEGORIES.map((cat) => {
                              const categorias = event.categorias || (event.categoria ? [event.categoria] : []);
                              const isSelected = categorias.includes(cat);
                              return (
                                <Button
                                  key={cat}
                                  type="button"
                                  variant={isSelected ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => {
                                    const current = event.categorias || (event.categoria ? [event.categoria] : []);
                                    const newCategorias = isSelected
                                      ? current.filter(c => c !== cat)
                                      : [...current, cat];
                                    updateEvent(index, { 
                                      categorias: newCategorias,
                                      categoria: newCategorias[0]
                                    });
                                  }}
                                >
                                  {isSelected && <Check className="w-3 h-3 mr-1" />}
                                  {cat}
                                </Button>
                              );
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">Selecione uma ou mais categorias</p>
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
