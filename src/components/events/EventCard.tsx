import { Calendar, MapPin, Users, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface EventData {
  id: string;
  nome: string;
  imagem: string;
  data: string;
  local: string;
  modalidade: 'Presencial' | 'Online' | 'Híbrido';
  publicoAlvo?: string;
  valor?: 'Gratuito' | 'Pago' | 'A confirmar';
  participacaoSebrae?: 'Organizador' | 'Patrocinador' | 'Parceiro' | string;
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

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
      {/* Imagem do Evento - Obrigatória */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={event.imagem}
          alt={event.nome}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Badge de Modalidade */}
        <Badge className={`absolute top-3 right-3 ${modalidadeColor[event.modalidade]}`}>
          {event.modalidade}
        </Badge>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Nome do Evento */}
        <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-3">
          {event.nome}
        </h3>

        {/* Informações */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-1">
          {/* Data */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>{event.data}</span>
          </div>

          {/* Local */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="line-clamp-1">{event.local}</span>
          </div>

          {/* Público-alvo */}
          {event.publicoAlvo && (
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-2">{event.publicoAlvo}</span>
            </div>
          )}
        </div>

        {/* Tags de Valor e Participação */}
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Botões de Ação */}
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
