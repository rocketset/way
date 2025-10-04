// ============================================
// EDITOR DE BLOCO DE PARÁGRAFO
// ============================================
// Bloco de texto simples com formatação rica
// Suporta: negrito, itálico, sublinhado, links, alinhamento

import { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { ParagraphBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { FormattingToolbar } from '../FormattingToolbar';

interface Props {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function ParagraphBlockEditor({
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

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    onChange({
      ...block,
      alignment,
    });
  };

  return (
    <div className="group relative">
      <div
        className={`
          border rounded-lg p-4 transition-all
          ${isFocused ? 'border-primary shadow-sm' : 'border-transparent hover:border-border'}
        `}
      >
        {isFocused && (
          <FormattingToolbar
            onFormat={(format) => {
              // Aplicar formatação ao texto selecionado
              document.execCommand(format, false);
            }}
            alignment={block.alignment}
            onAlignmentChange={handleAlignmentChange}
          />
        )}

        <ContentEditable
          innerRef={contentRef}
          html={block.content || '<p class="text-muted-foreground">Digite seu texto aqui...</p>'}
          onChange={handleContentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            outline-none min-h-[60px] prose prose-sm max-w-none
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
