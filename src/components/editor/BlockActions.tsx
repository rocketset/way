// ============================================
// AÇÕES DE BLOCO
// ============================================
// Botões de ação que aparecem ao lado de cada bloco
// Deletar, duplicar, mover para cima/baixo, inserir abaixo

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { EditorBlock } from '@/types/editor';

interface BlockActionsProps {
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow?: (type: EditorBlock['type']) => void;
}

/**
 * Menu de ações contextuais para cada bloco
 * Aparece no hover sobre o bloco
 */
export function BlockActions({
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: BlockActionsProps) {
  return (
    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur hover:bg-background"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {onMoveUp && (
            <DropdownMenuItem onClick={onMoveUp}>
              <ChevronUp className="h-4 w-4 mr-2" />
              Mover para Cima
            </DropdownMenuItem>
          )}

          {onMoveDown && (
            <DropdownMenuItem onClick={onMoveDown}>
              <ChevronDown className="h-4 w-4 mr-2" />
              Mover para Baixo
            </DropdownMenuItem>
          )}

          {(onMoveUp || onMoveDown) && <DropdownMenuSeparator />}

          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar Bloco
          </DropdownMenuItem>

          {onInsertBelow && (
            <DropdownMenuItem onClick={() => onInsertBelow('paragraph')}>
              <Plus className="h-4 w-4 mr-2" />
              Inserir Abaixo
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar Bloco
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
