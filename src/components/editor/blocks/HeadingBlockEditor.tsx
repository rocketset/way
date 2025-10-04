// ============================================
// EDITOR DE BLOCO DE TÍTULO
// ============================================
// Títulos H1 a H6 com seletor de nível

import { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { HeadingBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function HeadingBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const contentRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleContentChange = (evt: any) => {
    onChange({
      ...block,
      content: evt.target.value,
    });
  };

  const handleLevelChange = (level: string) => {
    onChange({
      ...block,
      level: parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6,
    });
  };

  const getFontSize = () => {
    const sizes = {
      1: 'text-4xl',
      2: 'text-3xl',
      3: 'text-2xl',
      4: 'text-xl',
      5: 'text-lg',
      6: 'text-base',
    };
    return sizes[block.level];
  };

  return (
    <div className="group relative">
      <div
        className={`
          border rounded-lg p-4 transition-all
          ${isFocused ? 'border-primary shadow-sm' : 'border-transparent hover:border-border'}
        `}
      >
        <div className="flex items-center gap-2 mb-2">
          <Select
            value={block.level.toString()}
            onValueChange={handleLevelChange}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1</SelectItem>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
              <SelectItem value="4">H4</SelectItem>
              <SelectItem value="5">H5</SelectItem>
              <SelectItem value="6">H6</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ContentEditable
          innerRef={contentRef}
          html={block.content || `<span class="text-muted-foreground">Título H${block.level}</span>`}
          onChange={handleContentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            outline-none font-bold ${getFontSize()}
            text-${block.alignment || 'left'}
          `}
          tagName="div"
        />
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
