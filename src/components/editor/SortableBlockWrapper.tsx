// ============================================
// WRAPPER PARA BLOCOS ARRASTÁVEIS
// ============================================
// Adiciona funcionalidade de drag-and-drop aos blocos do editor
// Mostra handle de arrasto e feedback visual durante o arrasto

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ReactNode } from 'react';

interface SortableBlockWrapperProps {
  id: string; // ID único do bloco
  children: ReactNode; // Conteúdo do bloco
}

/**
 * Wrapper que torna um bloco arrastável
 * Adiciona:
 * - Handle de arrasto (ícone de grip)
 * - Animações de transição
 * - Feedback visual durante o arrasto
 * - Estilos de hover
 */
export function SortableBlockWrapper({ id, children }: SortableBlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Estilo de transformação do drag
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative 
        ${isDragging ? 'opacity-50 z-50' : 'opacity-100'}
      `}
    >
      {/* Handle de arrasto (aparece no hover) */}
      <div
        {...attributes}
        {...listeners}
        className="
          absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          cursor-grab active:cursor-grabbing
          p-1 hover:bg-muted rounded
        "
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Conteúdo do bloco */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
