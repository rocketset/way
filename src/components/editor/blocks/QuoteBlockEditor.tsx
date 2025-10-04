// Editor de Bloco de Citação
import { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { QuoteBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function QuoteBlockEditor({
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

  return (
    <div className="group relative">
      <div
        className={`
          border-l-4 border-primary rounded-lg p-4 bg-muted/30 transition-all
          ${isFocused ? 'shadow-sm' : ''}
        `}
      >
        <ContentEditable
          innerRef={contentRef}
          html={block.content || '<span class="text-muted-foreground">Digite a citação...</span>'}
          onChange={(evt) => onChange({ ...block, content: evt.target.value })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            outline-none text-lg italic mb-3
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
            [&_a]:decoration-primary/50 [&_a:hover]:decoration-primary
            [&_a]:transition-colors [&_a]:cursor-pointer
          `}
          tagName="div"
        />

        <div className="space-y-2">
          <Label className="text-xs">Autor (opcional)</Label>
          <Input
            value={block.author || ''}
            onChange={(e) => onChange({ ...block, author: e.target.value })}
            placeholder="Nome do autor"
            className="h-8"
          />
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
