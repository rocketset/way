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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTarget, setLinkTarget] = useState<'_self' | '_blank'>('_self');

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

  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^(https?|mailto|tel):/.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleApplyLink = () => {
    const sel = window.getSelection();
    const range = savedRangeRef.current;
    if (!sel || !range || range.collapsed || !linkUrl.trim()) return;

    // Restaura a seleção
    sel.removeAllRanges();
    sel.addRange(range);

    // Cria o link
    const normalizedUrl = normalizeUrl(linkUrl);
    document.execCommand('createLink', false, normalizedUrl);

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
      linkEl.target = linkTarget;
      if (linkTarget === '_blank') linkEl.rel = 'noopener noreferrer';
    }

    // Atualiza o conteúdo
    if (contentRef.current) {
      onChange({ ...block, content: contentRef.current.innerHTML });
    }

    // Fecha o dialog e limpa estados
    setLinkOpen(false);
    setLinkUrl('');
    setLinkTarget('_self');

    // Re-foca o editor
    setTimeout(() => contentRef.current?.focus(), 0);
  };
  return (
    <div className="group relative">
      <div
        className={`
          border rounded-lg p-4 transition-all
          ${isFocused ? 'border-primary shadow-sm' : 'border-transparent hover:border-border'}
        `}
      >
        {(isFocused || linkOpen) && (
          <FormattingToolbar
            onFormat={(format) => {
              document.execCommand(format, false);
            }}
            alignment={block.alignment}
            onAlignmentChange={handleAlignmentChange}
            onCaptureSelection={captureSelection}
            onRequestLink={() => setLinkOpen(true)}
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
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
            [&_a]:decoration-primary/50 [&_a:hover]:decoration-primary
            [&_a]:transition-colors [&_a]:cursor-pointer
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

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inserir Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyLink();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-target">Abrir em</Label>
              <Select value={linkTarget} onValueChange={(v) => setLinkTarget(v as '_self' | '_blank')}>
                <SelectTrigger id="link-target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Mesma janela</SelectItem>
                  <SelectItem value="_blank">Nova janela</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyLink}>
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
