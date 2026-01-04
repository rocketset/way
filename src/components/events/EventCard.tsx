import { Calendar, MapPin, Users, ExternalLink, Info, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventCategory } from '@/types/editor';

export interface EventData {
  id: string;
  nome: string;
  resumo?: string;
  imagem: string;
  data: string;
  dataFim?: string; // data fim do evento
  local: string;
  modalidade: 'Presencial' | 'Online' | 'Híbrido';
  modalidades?: ('Presencial' | 'Online' | 'Híbrido')[];
  categoria?: EventCategory;
  categorias?: EventCategory[];
  publicoAlvo?: string;
  valor?: 'Gratuito' | 'Pago' | 'A confirmar';
  participacaoSebrae?: string;
  descricao?: string;
  linkMaisInfo?: string;
  linkInscricao?: string;
}

interface EventCardProps {
  event: EventData;
}

export const EventCard = ({ event }: EventCardProps) => {
  const modalidadeColor = {
    'Presencial': 'bg-green-100 text-green-800 border-green-200',
    'Online': 'bg-blue-100 text-blue-800 border-blue-200',
    'Híbrido': 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const valorColor = {
    'Gratuito': 'bg-emerald-100 text-emerald-800',
    'Pago': 'bg-amber-100 text-amber-800',
    'A confirmar': 'bg-gray-100 text-gray-600',
  };

  const categoriaColor = {
    'Ecommerce': 'bg-indigo-100 text-indigo-800',
    'Marketplace': 'bg-cyan-100 text-cyan-800',
    'ERP': 'bg-orange-100 text-orange-800',
    'Logística': 'bg-teal-100 text-teal-800',
    'Varejo': 'bg-pink-100 text-pink-800',
    'Tecnologia': 'bg-violet-100 text-violet-800',
    'Inovação': 'bg-rose-100 text-rose-800',
  };

  // Get all modalidades (support both single and multiple)
  const modalidades = event.modalidades || [event.modalidade];
  // Get all categorias (support both single and multiple)
  const categorias = event.categorias || (event.categoria ? [event.categoria] : []);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
      {/* 1. Imagem do Evento - Obrigatória */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={event.imagem}
          alt={event.nome}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Badges de Modalidade */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[70%]">
          {modalidades.map((mod) => (
            <Badge key={mod} className={modalidadeColor[mod]}>
              {mod}
            </Badge>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex-1 flex flex-col">
        {/* 2. Nome do Evento */}
        <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-1">
          {event.nome}
        </h3>

        {/* 2.1 Resumo do Evento */}
        {event.resumo && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {event.resumo}
          </p>
        )}

        {/* Informações ordenadas */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-1">
          {/* 3. Data */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>{event.data}</span>
          </div>

          {/* 4. Local */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="line-clamp-1">{event.local}</span>
          </div>

          {/* 5. Para quem é (Público-alvo) */}
          {event.publicoAlvo && (
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-2">{event.publicoAlvo}</span>
            </div>
          )}
        </div>

        {/* 6. Badges (Categorias, Valor) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categorias.map((cat) => (
            <Badge key={cat} variant="secondary" className={categoriaColor[cat]}>
              <Tag className="w-3 h-3 mr-1" />
              {cat}
            </Badge>
          ))}
          {event.valor && (
            <Badge variant="secondary" className={valorColor[event.valor]}>
              {event.valor}
            </Badge>
          )}
          {event.participacaoSebrae && (
            <Badge variant="outline" className="text-xs">
              {event.participacaoSebrae}
            </Badge>
          )}
        </div>

        {/* 7. Botões de Ação */}
        <div className="flex gap-2 mt-auto">
          {event.linkMaisInfo && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              asChild
            >
              <a href={event.linkMaisInfo} target="_blank" rel="noopener noreferrer">
                <Info className="w-3.5 h-3.5 mr-1.5" />
                Mais informações
              </a>
            </Button>
          )}
          {event.linkInscricao && (
            <Button
              size="sm"
              className="flex-1 text-xs bg-primary hover:bg-primary/90"
              asChild
            >
              <a href={event.linkInscricao} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Inscreva-se
              </a>
            </Button>
          )}
          {!event.linkMaisInfo && !event.linkInscricao && (
            <Badge variant="secondary" className="w-full justify-center py-2 text-xs">
              Inscrições em breve
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
