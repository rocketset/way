// Editor de Bloco de HTML
import { HTMLBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  block: HTMLBlock;
  onChange: (block: HTMLBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function HTMLBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="group relative">
      <div className="border border-transparent rounded-lg p-4 bg-yellow-500/10 hover:border-border/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs font-semibold flex items-center gap-2">
            <span className="text-yellow-600">⚠</span>
            HTML Bruto (use com cuidado)
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Editar' : 'Preview'}
          </Button>
        </div>

        {showPreview ? (
          <div
            className="border rounded p-4 bg-background min-h-[100px]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content, {
              ALLOWED_TAGS: ['div', 'span', 'p', 'br', 'strong', 'em', 'u', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
              ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel']
            }) }}
          />
        ) : (
          <Textarea
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="<div>Seu HTML aqui...</div>"
            className="font-mono text-sm min-h-[200px]"
            spellCheck={false}
          />
        )}

        <p className="text-xs text-muted-foreground mt-2">
          ✓ HTML é sanitizado automaticamente para segurança. Tags e atributos perigosos são removidos.
        </p>
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
