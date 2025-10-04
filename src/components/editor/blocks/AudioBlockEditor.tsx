// Editor de Bloco de Áudio
import { AudioBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Props {
  block: AudioBlock;
  onChange: (block: AudioBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function AudioBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const [showConfig, setShowConfig] = useState(!block.url);

  return (
    <div className="group relative">
      <div className="border rounded-lg p-4 hover:border-border transition-all">
        {!block.url || showConfig ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>URL do Áudio</Label>
              <Input
                value={block.url}
                onChange={(e) => onChange({ ...block, url: e.target.value })}
                placeholder="https://exemplo.com/audio.mp3"
              />
              <p className="text-xs text-muted-foreground">
                MP3, WAV, OGG ou outros formatos de áudio
              </p>
            </div>

            {block.url && (
              <button
                onClick={() => setShowConfig(false)}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Aplicar
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <audio controls className="w-full">
              <source src={block.url} />
              Seu navegador não suporta o elemento de áudio.
            </audio>

            <button
              onClick={() => setShowConfig(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Trocar áudio
            </button>

            <div className="space-y-2">
              <Label>Legenda (opcional)</Label>
              <Textarea
                value={block.caption || ''}
                onChange={(e) => onChange({ ...block, caption: e.target.value })}
                placeholder="Adicione uma legenda..."
                rows={2}
              />
            </div>
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
