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
  const savedRangeRef = useRef<Range | null>(null);

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

  const captureSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (contentRef.current && contentRef.current.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  const applyLink = (url: string, target: '_self' | '_blank') => {
    const sel = window.getSelection();
    const range = savedRangeRef.current;
    if (!sel || !range || range.collapsed) return;

    // Restaura a seleção antes de aplicar o link
    sel.removeAllRanges();
    sel.addRange(range);

    // Cria o link em volta da seleção
    document.execCommand('createLink', false, url);

    // Ajusta atributos do link criado
    let linkEl: HTMLAnchorElement | null = null;
    const anchorNode = sel.anchorNode as (Node & { parentElement?: HTMLElement }) | null;
    if (anchorNode) {
      const startEl = (anchorNode.nodeType === 3 ? anchorNode.parentElement : (anchorNode as any)) as HTMLElement | null;
      linkEl = startEl?.closest('a') as HTMLAnchorElement | null;
    }
    if (!linkEl && contentRef.current) {
      const anchors = contentRef.current.querySelectorAll('a');
      if (anchors.length > 0) linkEl = anchors[anchors.length - 1] as HTMLAnchorElement;
    }
    if (linkEl) {
      linkEl.target = target;
      if (target === '_blank') linkEl.rel = 'noopener noreferrer';
    }

    if (contentRef.current) {
      onChange({ ...block, content: contentRef.current.innerHTML });
    }
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
            onCaptureSelection={captureSelection}
            onCreateLink={applyLink}
          />
        )}

        <ContentEditable
          innerRef={contentRef}
          html={block.content || '<p class="text-muted-foreground">Digite seu texto aqui...</p>'}
          onChange={handleContentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseUp={captureSelection}
          onKeyUp={captureSelection}
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
