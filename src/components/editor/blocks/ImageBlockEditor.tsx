// ============================================
// EDITOR DE BLOCO DE IMAGEM
// ============================================
// Upload de imagem com alt text, legenda e alinhamento

import { ImageBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Link2 } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function ImageBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const [showUrlInput, setShowUrlInput] = useState(!block.url);

  const handleUrlChange = (url: string) => {
    onChange({ ...block, url });
  };

  const handleAltChange = (alt: string) => {
    onChange({ ...block, alt });
  };

  const handleCaptionChange = (caption: string) => {
    onChange({ ...block, caption });
  };

  const handleAlignmentChange = (alignment: string) => {
    onChange({
      ...block,
      alignment: alignment as 'left' | 'center' | 'right' | 'full',
    });
  };

  return (
    <div className="group relative">
      <div className="border rounded-lg p-4 hover:border-border transition-all">
        {!block.url || showUrlInput ? (
          // Estado de configuração
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <div className="flex gap-2">
                <Input
                  value={block.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Abrir biblioteca de mídia
                    alert('Biblioteca de mídia em desenvolvimento');
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Texto Alternativo (Alt) *</Label>
              <Input
                value={block.alt}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Descrição da imagem para acessibilidade"
              />
              <p className="text-xs text-muted-foreground">
                Importante para SEO e acessibilidade
              </p>
            </div>

            {block.url && (
              <Button
                variant="default"
                className="w-full"
                onClick={() => setShowUrlInput(false)}
                disabled={!block.alt}
              >
                Aplicar
              </Button>
            )}
          </div>
        ) : (
          // Visualização da imagem
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Select
                value={block.alignment || 'center'}
                onValueChange={handleAlignmentChange}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                  <SelectItem value="full">Largura Total</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUrlInput(true)}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Trocar
              </Button>
            </div>

            <div
              className={`
                ${block.alignment === 'left' ? 'mr-auto' : ''}
                ${block.alignment === 'right' ? 'ml-auto' : ''}
                ${block.alignment === 'center' ? 'mx-auto' : ''}
                ${block.alignment === 'full' ? 'w-full' : 'max-w-2xl'}
              `}
            >
              <img
                src={block.url}
                alt={block.alt}
                className="rounded-lg w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <Label>Legenda (opcional)</Label>
              <Textarea
                value={block.caption || ''}
                onChange={(e) => handleCaptionChange(e.target.value)}
                placeholder="Adicione uma legenda..."
                rows={2}
                className="resize-none"
              />
            </div>

            {block.caption && (
              <p className="text-sm text-muted-foreground text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        )}
      </div>

      <BlockActions
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onInsertBelow={onInsertBelow}
      />
    </div>
  );
}
