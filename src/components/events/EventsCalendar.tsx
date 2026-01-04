import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventDate {
  date: string; // formato: YYYY-MM-DD ou DD/MM/YYYY
}

interface EventsCalendarProps {
  events: EventDate[];
  className?: string;
  onDateSelect?: (date: Date | null) => void;
  selectedDate?: Date | null;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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

export const EventsCalendar = ({ events, className, onDateSelect, selectedDate }: EventsCalendarProps) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Parse all event dates and create a Set of date strings for quick lookup
  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    events.forEach(event => {
      const parsed = parseEventDate(event.date);
      if (parsed) {
        const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
        dates.add(key);
      }
    });
    return dates;
  }, [events]);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if a day has an event
  const hasEvent = (day: number) => {
    const key = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventDates.has(key);
  };

  // Check if a day is selected
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === selectedMonth && 
           selectedDate.getFullYear() === selectedYear;
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    if (onDateSelect) {
      const clickedDate = new Date(selectedYear, selectedMonth, day);
      onDateSelect(clickedDate);
    }
  };

  // Navigate months
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const today = new Date();
  const isToday = (day: number) => 
    today.getDate() === day && 
    today.getMonth() === selectedMonth && 
    today.getFullYear() === selectedYear;

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-8 md:h-10" />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayHasEvent = hasEvent(day);
    const dayIsToday = isToday(day);
    const dayIsSelected = isSelected(day);
    
    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={cn(
          "relative h-8 md:h-10 flex items-center justify-center text-sm rounded-lg transition-all cursor-pointer",
          "hover:bg-primary/20 hover:text-primary",
          dayIsSelected && "bg-primary text-primary-foreground font-semibold",
          dayIsToday && !dayIsSelected && "bg-primary/10 text-primary font-semibold ring-1 ring-primary/30",
          dayHasEvent && !dayIsToday && !dayIsSelected && "bg-accent/50",
          !dayHasEvent && !dayIsToday && !dayIsSelected && "text-muted-foreground"
        )}
      >
        <span className="relative z-10">{day}</span>
        {dayHasEvent && (
          <span className={cn(
            "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
            dayIsSelected ? "bg-primary-foreground" : "bg-primary"
          )} />
        )}
      </button>
    );
  }

  // Count events in current month
  const eventsInMonth = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      if (hasEvent(day)) count++;
    }
    return count;
  }, [selectedMonth, selectedYear, eventDates, daysInMonth]);

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4 md:p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Calendário de Eventos</h3>
          <p className="text-sm text-muted-foreground">
            {eventsInMonth > 0 
              ? `${eventsInMonth} dia${eventsInMonth > 1 ? 's' : ''} com evento em ${MONTHS[selectedMonth]}`
              : `Nenhum evento em ${MONTHS[selectedMonth]}`
            }
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {MONTHS[selectedMonth]} {selectedYear}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekdays header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Dia com evento</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-primary/10 ring-1 ring-primary/30" />
          <span>Hoje</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-primary" />
          <span>Selecionado</span>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Clique em um dia para filtrar os eventos
      </p>
    </div>
  );
};
