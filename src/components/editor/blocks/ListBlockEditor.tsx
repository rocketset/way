// ============================================
// EDITOR DE BLOCO DE LISTA
// ============================================
// Listas ordenadas, não-ordenadas e checklists

import { ListBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  block: ListBlock;
  onChange: (block: ListBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function ListBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const handleTypeChange = (listType: string) => {
    onChange({
      ...block,
      listType: listType as 'ordered' | 'unordered' | 'checklist',
    });
  };

  const handleItemChange = (itemId: string, content: string) => {
    onChange({
      ...block,
      items: block.items.map((item) =>
        item.id === itemId ? { ...item, content } : item
      ),
    });
  };

  const handleItemCheck = (itemId: string, checked: boolean) => {
    onChange({
      ...block,
      items: block.items.map((item) =>
        item.id === itemId ? { ...item, checked } : item
      ),
    });
  };

  const handleAddItem = () => {
    onChange({
      ...block,
      items: [
        ...block.items,
        { id: crypto.randomUUID(), content: '', checked: false },
      ],
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (block.items.length > 1) {
      onChange({
        ...block,
        items: block.items.filter((item) => item.id !== itemId),
      });
    }
  };

  return (
    <div className="group relative">
      <div className="border border-transparent rounded-lg p-4 hover:border-border/40 transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Select
            value={block.listType}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-40 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unordered">Bullets</SelectItem>
              <SelectItem value="ordered">Numerada</SelectItem>
              <SelectItem value="checklist">Checklist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {block.items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              {block.listType === 'checklist' ? (
                <Checkbox
                  checked={item.checked || false}
                  onCheckedChange={(checked) =>
                    handleItemCheck(item.id, checked as boolean)
                  }
                />
              ) : block.listType === 'ordered' ? (
                <span className="text-sm text-muted-foreground w-6">
                  {index + 1}.
                </span>
              ) : (
                <span className="text-sm text-muted-foreground w-6">•</span>
              )}

              <Input
                value={item.content}
                onChange={(e) => handleItemChange(item.id, e.target.value)}
                placeholder="Item da lista"
                className="flex-1 h-8"
              />

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemoveItem(item.id)}
                disabled={block.items.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
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
