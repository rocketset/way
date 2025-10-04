// ============================================
// TOOLBAR DE FORMATAÇÃO DE TEXTO
// ============================================
// Botões para formatar texto: negrito, itálico, sublinhado, links, etc.

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormattingToolbarProps {
  onFormat: (format: string) => void;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  onAlignmentChange?: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  onCreateLink?: (url: string, target: '_self' | '_blank') => void;
  onCaptureSelection?: () => void;
}

/**
 * Toolbar flutuante com opções de formatação de texto
 * Aparece quando o usuário seleciona texto
 */
export function FormattingToolbar({
  onFormat,
  alignment,
  onAlignmentChange,
  onCreateLink,
  onCaptureSelection,
}: FormattingToolbarProps) {
  const formatButtons = [
    { icon: Bold, format: 'bold', label: 'Negrito', shortcut: 'Ctrl+B' },
    { icon: Italic, format: 'italic', label: 'Itálico', shortcut: 'Ctrl+I' },
    { icon: Underline, format: 'underline', label: 'Sublinhado', shortcut: 'Ctrl+U' },
    { icon: Link2, format: 'createLink', label: 'Link', shortcut: 'Ctrl+K' },
  ];

  const alignmentButtons = [
    { icon: AlignLeft, value: 'left' as const, label: 'Alinhar à Esquerda' },
    { icon: AlignCenter, value: 'center' as const, label: 'Centralizar' },
    { icon: AlignRight, value: 'right' as const, label: 'Alinhar à Direita' },
    { icon: AlignJustify, value: 'justify' as const, label: 'Justificar' },
  ];

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTarget, setLinkTarget] = useState<'_self' | '_blank'>('_self');

  const handleFormatClick = (format: string) => {
    if (format === 'createLink') {
      // Captura a seleção antes de abrir o dialog
      // para que possamos restaurar ao aplicar o link
      // (o foco muda para o dialog)
      // A função é passada pelo editor do bloco
      // e apenas registra o Range atual
      // sem alterar o DOM
      onCaptureSelection?.();
      setLinkOpen(true);
      return;
    }
    onFormat(format);
  };

  return (
    <>
      <div className="flex items-center gap-1 p-2 bg-card border rounded-lg shadow-lg mb-2">
        {/* Botões de formatação */}
        {formatButtons.map((btn) => (
          <Tooltip key={btn.format}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFormatClick(btn.format);
                }}
              >
                <btn.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="text-center">
                <div>{btn.label}</div>
                <div className="text-xs text-muted-foreground">{btn.shortcut}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}

        {onAlignmentChange && (
          <>
            <div className="h-6 w-px bg-border mx-1" />

            {/* Botões de alinhamento */}
            {alignmentButtons.map((btn) => (
              <Tooltip key={btn.value}>
                <TooltipTrigger asChild>
                  <Button
                    variant={alignment === btn.value ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onAlignmentChange(btn.value);
                    }}
                  >
                    <btn.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{btn.label}</TooltipContent>
              </Tooltip>
            ))}
          </>
        )}
      </div>

      {/* Dialog de Link */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Inserir link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Destino</Label>
              <Select value={linkTarget} onValueChange={(v) => setLinkTarget(v as '_self' | '_blank')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[60] bg-popover">
                  <SelectItem value="_self">Mesma aba</SelectItem>
                  <SelectItem value="_blank">Nova aba</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!linkUrl) return;
                onCreateLink?.(linkUrl, linkTarget);
                setLinkOpen(false);
                setLinkUrl('');
                setLinkTarget('_self');
              }}
            >
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
