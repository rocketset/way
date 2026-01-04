import { useState, useMemo } from 'react';
import { EventCard, EventData } from './EventCard';
import { EventsCalendar } from './EventsCalendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventCategory } from '@/types/editor';

interface EventsShowcaseProps {
  events: EventData[];
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  showFilters?: boolean;
  showCalendar?: boolean;
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

// Parse date from various formats
const parseEventDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Try DD/MM/YYYY format
  const brMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (brMatch) {
    return new Date(parseInt(brMatch[3]), parseInt(brMatch[2]) - 1, parseInt(brMatch[1]));
  }
  
  // Try YYYY-MM-DD format
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }
  
  // Try to parse natural date formats like "20 de março de 2026"
  const months: Record<string, number> = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5,
    'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
  };
  
  const naturalMatch = dateStr.toLowerCase().match(/(\d{1,2})\s*(?:a\s*\d{1,2}\s*)?(?:de\s+)?(\w+)\s*(?:de\s+)?(\d{4})/);
  if (naturalMatch) {
    const day = parseInt(naturalMatch[1]);
    const month = months[naturalMatch[2]];
    const year = parseInt(naturalMatch[3]);
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  return null;
};

// Format date for display
const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Check if event is on a specific date
const isEventOnDate = (eventDate: string, targetDate: Date): boolean => {
  const parsed = parseEventDate(eventDate);
  if (!parsed) return false;
  return parsed.toDateString() === targetDate.toDateString();
};

// Check if event is on or after a specific date
const isEventOnOrAfterDate = (eventDate: string, targetDate: Date): boolean => {
  const parsed = parseEventDate(eventDate);
  if (!parsed) return false;
  return parsed >= targetDate;
};

export const EventsShowcase = ({
  events,
  title = "Vitrine de Eventos",
  subtitle = "Mapeamos os principais eventos, feiras e capacitações do setor para você acompanhar",
  showTitle = false,
  showFilters = true,
  showCalendar = true,
}: EventsShowcaseProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('todos');
  const [valorFilter, setValorFilter] = useState<string>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todos');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateFilterMode, setDateFilterMode] = useState<'exact' | 'from' | null>(null);

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | null) => {
    if (!date) {
      setSelectedDate(null);
      setDateFilterMode(null);
      return;
    }

    // Check if there are events on this exact date
    const hasEventsOnDate = events.some(event => isEventOnDate(event.data, date));
    
    setSelectedDate(date);
    setDateFilterMode(hasEventsOnDate ? 'exact' : 'from');
  };

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
    setDateFilterMode(null);
  };

  // Sort events by date (closest first)
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = parseEventDate(a.data);
      const dateB = parseEventDate(b.data);
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((event) => {
      // Text search
      const matchesSearch = event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.publicoAlvo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.categoria?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Modalidade filter
      const matchesModalidade = modalidadeFilter === 'todos' || event.modalidade === modalidadeFilter;
      
      // Valor filter
      const matchesValor = valorFilter === 'todos' || event.valor === valorFilter;
      
      // Categoria filter
      const matchesCategoria = categoriaFilter === 'todos' || event.categoria === categoriaFilter;

      // Date filter
      let matchesDate = true;
      if (selectedDate && dateFilterMode) {
        if (dateFilterMode === 'exact') {
          matchesDate = isEventOnDate(event.data, selectedDate);
        } else {
          matchesDate = isEventOnOrAfterDate(event.data, selectedDate);
        }
      }

      return matchesSearch && matchesModalidade && matchesValor && matchesCategoria && matchesDate;
    });
  }, [sortedEvents, searchTerm, modalidadeFilter, valorFilter, categoriaFilter, selectedDate, dateFilterMode]);

  // Prepare events for calendar (extract dates)
  const calendarEvents = events.map(event => ({ date: event.data }));

  // Check if any filters are active
  const hasActiveFilters = searchTerm || modalidadeFilter !== 'todos' || valorFilter !== 'todos' || categoriaFilter !== 'todos' || selectedDate;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setModalidadeFilter('todos');
    setValorFilter('todos');
    setCategoriaFilter('todos');
    clearDateFilter();
  };

  return (
    <div className="w-full">
      {/* Header - respeitando showTitle */}
      {(showTitle && title) || subtitle ? (
        <div className="text-center mb-8">
          {showTitle && title && (
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      ) : null}

      {/* Calendário Visual Interativo */}
      {showCalendar && events.length > 0 && (
        <EventsCalendar 
          events={calendarEvents} 
          className="mb-6"
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
      )}

      {/* Date Filter Indicator */}
      {selectedDate && dateFilterMode && (
        <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {dateFilterMode === 'exact' 
              ? `Filtrando por: ${formatDateForDisplay(selectedDate)}`
              : `Mostrando eventos a partir de: ${formatDateForDisplay(selectedDate)}`
            }
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateFilter}
            className="h-7 px-2 text-primary hover:text-primary hover:bg-primary/20"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar filtro de data
          </Button>
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <div className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Busca */}
            <div className="relative flex-1 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro Categoria */}
            <div className="w-full sm:w-[150px] space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Categoria</label>
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas categorias</SelectItem>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Modalidade */}
            <div className="w-full sm:w-[150px] space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Modalidade</label>
              <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Valor */}
            <div className="w-full sm:w-[150px] space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Valor</label>
              <Select value={valorFilter} onValueChange={setValorFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Valor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Gratuito">Gratuito</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="A confirmar">A confirmar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Filtros ativos:</span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Busca: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {categoriaFilter !== 'todos' && (
                <Badge variant="secondary" className="text-xs">
                  {categoriaFilter}
                  <button onClick={() => setCategoriaFilter('todos')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {modalidadeFilter !== 'todos' && (
                <Badge variant="secondary" className="text-xs">
                  {modalidadeFilter}
                  <button onClick={() => setModalidadeFilter('todos')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {valorFilter !== 'todos' && (
                <Badge variant="secondary" className="text-xs">
                  {valorFilter}
                  <button onClick={() => setValorFilter('todos')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
                Limpar todos
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Contador de Eventos */}
      {showFilters && (
        <div className="text-sm text-muted-foreground mb-4">
          Exibindo <strong>{filteredEvents.length}</strong> de <strong>{events.length}</strong> eventos
        </div>
      )}

      {/* Grid de Eventos - 3 colunas desktop, 2 tablet, 1 mobile */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhum evento encontrado</p>
          <p className="text-sm">Tente ajustar os filtros de busca</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearAllFilters} className="mt-2">
              Limpar todos os filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
