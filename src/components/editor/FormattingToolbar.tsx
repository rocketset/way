// ============================================
// TOOLBAR DE FORMATAÇÃO DE TEXTO
// ============================================
// Botões para formatar texto: negrito, itálico, sublinhado, links, etc.

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

interface FormattingToolbarProps {
  onFormat: (format: string) => void;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  onAlignmentChange?: (alignment: 'left' | 'center' | 'right' | 'justify') => void;
  onRequestLink?: () => void;
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
  onRequestLink,
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

  const handleFormatClick = (format: string) => {
    if (format === 'createLink') {
      onCaptureSelection?.();
      onRequestLink?.();
      return;
    }
    onFormat(format);
  };

  return (
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
  );
}
