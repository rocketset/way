// Editor de Bloco de Colunas
import { ColumnsBlock, EditorBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParagraphBlockEditor } from './ParagraphBlockEditor';
import { HeadingBlockEditor } from './HeadingBlockEditor';
import { ImageBlockEditor } from './ImageBlockEditor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
  block: ColumnsBlock;
  onChange: (block: ColumnsBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function ColumnsBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const handleColumnCountChange = (count: string) => {
    const newCount = parseInt(count) as 2 | 3 | 4;
    const newColumns = Array(newCount).fill([]).map((_, i) => block.columns[i] || []);
    onChange({ ...block, columnCount: newCount, columns: newColumns });
  };

  const handleBlockChange = (columnIndex: number, blockIndex: number, updatedBlock: EditorBlock) => {
    const newColumns = block.columns.map((col, i) =>
      i === columnIndex
        ? col.map((b, j) => (j === blockIndex ? updatedBlock : b))
        : col
    );
    onChange({ ...block, columns: newColumns });
  };

  const handleAddBlock = (columnIndex: number) => {
    const newColumns = block.columns.map((col, i) =>
      i === columnIndex
        ? [...col, { id: crypto.randomUUID(), type: 'paragraph', content: '', alignment: 'left' } as any]
        : col
    );
    onChange({ ...block, columns: newColumns });
  };

  const renderBlock = (b: EditorBlock, columnIndex: number, blockIndex: number) => {
    const commonProps = {
      onChange: (updated: EditorBlock) => handleBlockChange(columnIndex, blockIndex, updated),
      onDelete: () => {
        const newColumns = block.columns.map((col, i) =>
          i === columnIndex ? col.filter((_, j) => j !== blockIndex) : col
        );
        onChange({ ...block, columns: newColumns });
      },
      onDuplicate: () => {},
      onInsertBelow: () => {},
    };

    switch (b.type) {
      case 'paragraph':
        return <ParagraphBlockEditor key={b.id} block={b} {...commonProps} />;
      case 'heading':
        return <HeadingBlockEditor key={b.id} block={b} {...commonProps} />;
      case 'image':
        return <ImageBlockEditor key={b.id} block={b} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="group relative">
      <div className="border rounded-lg p-4 hover:border-border transition-all">
        <div className="flex items-center gap-2 mb-4">
          <Label>Número de Colunas:</Label>
          <Select value={block.columnCount.toString()} onValueChange={handleColumnCountChange}>
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
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${block.columnCount}, minmax(0, 1fr))` }}
        >
          {block.columns.map((column, colIndex) => (
            <div key={colIndex} className="border rounded-lg p-3 bg-muted/20 space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Coluna {colIndex + 1}
              </div>
              {column.map((b, blockIndex) => renderBlock(b, colIndex, blockIndex))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => handleAddBlock(colIndex)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar
              </Button>
            </div>
          ))}
        </div>
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
