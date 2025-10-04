// Editor de Bloco de Imagem
import { useState } from 'react';
import { ImageBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Image, Library } from 'lucide-react';
import { MediaSelector } from '../MediaSelector';

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
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);

  return (
    <>
      <MediaSelector
        open={mediaSelectorOpen}
        onClose={() => setMediaSelectorOpen(false)}
        onSelect={(url, alt) => {
          onChange({ ...block, url, alt: alt || '' });
        }}
      />

      <div className="group relative">
        <div className="border rounded-lg p-4 hover:border-border transition-all">
          {block.url ? (
            <div className="space-y-4">
              <img
                src={block.url}
                alt={block.alt}
                className={`max-w-full h-auto rounded ${
                  block.alignment === 'center' ? 'mx-auto' :
                  block.alignment === 'right' ? 'ml-auto' : ''
                }`}
                style={{ maxHeight: '400px' }}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Alt Text</Label>
                  <Input
                    value={block.alt}
                    onChange={(e) => onChange({ ...block, alt: e.target.value })}
                    placeholder="Descrição da imagem"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Alinhamento</Label>
                  <Select value={block.alignment} onValueChange={(value: any) => onChange({ ...block, alignment: value })}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Esquerda</SelectItem>
                      <SelectItem value="center">Centro</SelectItem>
                      <SelectItem value="right">Direita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {block.caption !== undefined && (
                <div>
                  <Label className="text-xs">Legenda</Label>
                  <Input
                    value={block.caption}
                    onChange={(e) => onChange({ ...block, caption: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setMediaSelectorOpen(true)}
              >
                Trocar Imagem
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Image className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setMediaSelectorOpen(true)}
                  className="w-full"
                >
                  <Library className="h-4 w-4 mr-2" />
                  Escolher da Biblioteca
                </Button>
                <div>
                  <Label className="text-sm">Ou cole uma URL</Label>
                  <Input
                    placeholder="https://exemplo.com/imagem.jpg"
                    onChange={(e) => onChange({ ...block, url: e.target.value })}
                    className="mt-2"
                  />
                </div>
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
    </>
  );
}
