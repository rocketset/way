import { useState } from 'react';
import { EventCard, EventData } from './EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EventsShowcaseProps {
  events: EventData[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

export const EventsShowcase = ({
  events,
  title = "Vitrine de Eventos",
  subtitle = "Mapeamos os principais eventos, feiras e capacitações do setor para você acompanhar",
  showFilters = true,
}: EventsShowcaseProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('todos');
  const [valorFilter, setValorFilter] = useState<string>('todos');

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.publicoAlvo?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesModalidade = modalidadeFilter === 'todos' || event.modalidade === modalidadeFilter;
    const matchesValor = valorFilter === 'todos' || event.valor === valorFilter;

    return matchesSearch && matchesModalidade && matchesValor;
  });

  return (
    <div className="w-full">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro Modalidade */}
          <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro Valor */}
          <Select value={valorFilter} onValueChange={setValorFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
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
      )}

      {/* Grid de Eventos */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhum evento encontrado</p>
          <p className="text-sm">Tente ajustar os filtros de busca</p>
        </div>
      )}

      {/* Contador */}
      {showFilters && filteredEvents.length > 0 && (
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Exibindo {filteredEvents.length} de {events.length} eventos
        </div>
      )}
    </div>
  );
};
