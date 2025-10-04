// ============================================
// EDITOR DE BLOCO DE SEPARADOR
// ============================================
// Linha divisória com diferentes estilos

import { DividerBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  block: DividerBlock;
  onChange: (block: DividerBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function DividerBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const handleStyleChange = (style: string) => {
    onChange({
      ...block,
      style: style as 'solid' | 'dashed' | 'dotted',
    });
  };

  const getBorderClass = () => {
    const styles = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };
    return styles[block.style || 'solid'];
  };

  return (
    <div className="group relative">
      <div className="border rounded-lg p-4 hover:border-border transition-all">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <hr
              className={`
                border-t-2 ${getBorderClass()} border-border
              `}
            />
          </div>

          <Select
            value={block.style || 'solid'}
            onValueChange={handleStyleChange}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Sólida</SelectItem>
              <SelectItem value="dashed">Tracejada</SelectItem>
              <SelectItem value="dotted">Pontilhada</SelectItem>
            </SelectContent>
          </Select>
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
