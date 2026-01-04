import { useState } from 'react';
import { EventsBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { MediaSelector } from '../MediaSelector';

interface EventsBlockEditorProps {
  block: EventsBlock;
  onChange: (block: EventsBlock) => void;
}

export const EventsBlockEditor = ({ block, onChange }: EventsBlockEditorProps) => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);

  const updateBlock = (updates: Partial<EventsBlock>) => {
    onChange({ ...block, ...updates });
  };

  const addEvent = () => {
    const newEvent = {
      id: uuid(),
      nome: 'Novo Evento',
      imagem: '/placeholder.svg',
      data: 'A definir',
      local: 'A definir',
      modalidade: 'Presencial' as const,
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

      {/* Configurações gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título da Seção</Label>
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

      <div className="flex items-center gap-2">
        <Switch
          checked={block.showFilters ?? true}
          onCheckedChange={(checked) => updateBlock({ showFilters: checked })}
        />
        <Label>Mostrar filtros de busca</Label>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Eventos ({(block.events || []).length})</Label>
          <Button onClick={addEvent} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Evento
          </Button>
        </div>

        {(block.events || []).map((event, index) => (
          <Card key={event.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <CardTitle className="text-sm">{event.nome || 'Sem nome'}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEvent(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Imagem */}
              <div className="space-y-2">
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
                </div>
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

              {/* Público e Valor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Público-alvo</Label>
                  <Input
                    value={event.publicoAlvo || ''}
                    onChange={(e) => updateEvent(index, { publicoAlvo: e.target.value })}
                    placeholder="Ex: Empreendedores, startups"
                  />
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

              {/* Participação e Descrição */}
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
                  <Label>Link - Inscrição</Label>
                  <Input
                    value={event.linkInscricao || ''}
                    onChange={(e) => updateEvent(index, { linkInscricao: e.target.value })}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

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
