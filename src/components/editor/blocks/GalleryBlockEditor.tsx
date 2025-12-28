// Editor de Bloco de Galeria
import { GalleryBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  block: GalleryBlock;
  onChange: (block: GalleryBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function GalleryBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const handleAddImage = () => {
    const url = prompt('URL da imagem:');
    if (url) {
      onChange({
        ...block,
        images: [
          ...block.images,
          { id: crypto.randomUUID(), url, alt: '', caption: '' },
        ],
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    onChange({
      ...block,
      images: block.images.filter((img) => img.id !== id),
    });
  };

  const handleUpdateImage = (id: string, field: string, value: string) => {
    onChange({
      ...block,
      images: block.images.map((img) =>
        img.id === id ? { ...img, [field]: value } : img
      ),
    });
  };

  return (
    <div className="group relative">
      <div className="border border-transparent rounded-lg p-4 hover:border-border/40 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <Label>Colunas:</Label>
          <Select
            value={block.columns?.toString() || '3'}
            onValueChange={(value) =>
              onChange({ ...block, columns: parseInt(value) as 2 | 3 | 4 })
            }
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          className={`grid gap-4 mb-4`}
          style={{
            gridTemplateColumns: `repeat(${block.columns || 3}, minmax(0, 1fr))`,
          }}
        >
          {block.images.map((image) => (
            <div key={image.id} className="relative group/image">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(image.id)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover/image:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mt-2 space-y-1">
                <Input
                  value={image.alt}
                  onChange={(e) => handleUpdateImage(image.id, 'alt', e.target.value)}
                  placeholder="Alt text"
                  className="h-7 text-xs"
                />
                <Input
                  value={image.caption || ''}
                  onChange={(e) => handleUpdateImage(image.id, 'caption', e.target.value)}
                  placeholder="Legenda"
                  className="h-7 text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full" onClick={handleAddImage}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Imagem
        </Button>
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
