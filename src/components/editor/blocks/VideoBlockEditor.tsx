// Editor de Bloco de Vídeo
import { VideoBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Props {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function VideoBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const [showConfig, setShowConfig] = useState(!block.url);

  // Converte URL do YouTube para embed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="group relative">
      <div className="border border-transparent rounded-lg p-4 hover:border-border/40 transition-all">
        {!block.url || showConfig ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>URL do Vídeo</Label>
              <Input
                value={block.url}
                onChange={(e) => onChange({ ...block, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
              />
              <p className="text-xs text-muted-foreground">
                YouTube, Vimeo ou URL direta
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
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={getEmbedUrl(block.url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <button
              onClick={() => setShowConfig(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Trocar vídeo
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
