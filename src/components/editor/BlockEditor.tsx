// ============================================
// EDITOR DE BLOCOS PRINCIPAL
// ============================================
// Sistema completo de edição por blocos estilo WordPress/Gutenberg
// Suporta drag-and-drop, múltiplos tipos de blocos, formatação rica

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EditorBlock } from '@/types/editor';
import { createEmptyBlock, moveBlock } from '@/utils/editorUtils';
import { BlockToolbar } from './BlockToolbar';
import { SortableBlockWrapper } from './SortableBlockWrapper';
import { ParagraphBlockEditor } from './blocks/ParagraphBlockEditor';
import { HeadingBlockEditor } from './blocks/HeadingBlockEditor';
import { ListBlockEditor } from './blocks/ListBlockEditor';
import { ImageBlockEditor } from './blocks/ImageBlockEditor';
import { DividerBlockEditor } from './blocks/DividerBlockEditor';
import { QuoteBlockEditor } from './blocks/QuoteBlockEditor';
import { CodeBlockEditor } from './blocks/CodeBlockEditor';
import { VideoBlockEditor } from './blocks/VideoBlockEditor';
import { AudioBlockEditor } from './blocks/AudioBlockEditor';
import { GalleryBlockEditor } from './blocks/GalleryBlockEditor';
import { ColumnsBlockEditor } from './blocks/ColumnsBlockEditor';
import { ButtonBlockEditor } from './blocks/ButtonBlockEditor';
import { HTMLBlockEditor } from './blocks/HTMLBlockEditor';
import { PollBlockEditor } from './blocks/PollBlockEditor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// ============================================
// PROPS DO COMPONENTE
// ============================================

interface BlockEditorProps {
  blocks: EditorBlock[]; // Array de blocos do post
  onChange: (blocks: EditorBlock[]) => void; // Callback quando blocos mudam
  placeholder?: string; // Texto placeholder inicial
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function BlockEditor({ blocks, onChange, placeholder }: BlockEditorProps) {
  // Estado para controlar qual toolbar está aberta
  const [activeToolbarIndex, setActiveToolbarIndex] = useState<number | null>(null);

  // Configuração do drag and drop
  // Sensores para detectar interações de mouse/teclado
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Arrasta após mover 8px (evita clicks acidentais)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ============================================
  // MANIPULADORES DE BLOCOS
  // ============================================

  /**
   * Adiciona um novo bloco em uma posição específica
   * @param type - Tipo do bloco a adicionar (paragraph, heading, etc.)
   * @param index - Posição onde inserir (-1 = final)
   */
  const handleInsertBlock = useCallback((
    type: EditorBlock['type'],
    index: number = -1
  ) => {
    const newBlock = createEmptyBlock(type);
    
    if (index === -1) {
      // Adiciona no final
      onChange([...blocks, newBlock]);
    } else {
      // Insere na posição específica
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      onChange(newBlocks);
    }
    
    // Fecha o toolbar
    setActiveToolbarIndex(null);
  }, [blocks, onChange]);

  /**
   * Atualiza um bloco específico
   * @param index - Índice do bloco
   * @param updatedBlock - Bloco atualizado
   */
  const handleUpdateBlock = useCallback((
    index: number,
    updatedBlock: EditorBlock
  ) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  }, [blocks, onChange]);

  /**
   * Remove um bloco
   * @param index - Índice do bloco a remover
   */
  const handleDeleteBlock = useCallback((index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  }, [blocks, onChange]);

  /**
   * Duplica um bloco
   * @param index - Índice do bloco a duplicar
   */
  const handleDuplicateBlock = useCallback((index: number) => {
    const blockToDuplicate = blocks[index];
    const newBlock = {
      ...blockToDuplicate,
      id: crypto.randomUUID(), // Novo ID único
    };
    
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  }, [blocks, onChange]);

  /**
   * Move um bloco para cima
   * @param index - Índice do bloco
   */
  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) {
      const newBlocks = moveBlock(blocks, index, index - 1);
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  /**
   * Move um bloco para baixo
   * @param index - Índice do bloco
   */
  const handleMoveDown = useCallback((index: number) => {
    if (index < blocks.length - 1) {
      const newBlocks = moveBlock(blocks, index, index + 1);
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  // ============================================
  // DRAG AND DROP
  // ============================================

  /**
   * Callback quando termina de arrastar um bloco
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        onChange(newBlocks);
      }
    }
  };

  // ============================================
  // RENDERIZAÇÃO DE BLOCOS
  // ============================================

  /**
   * Renderiza o editor apropriado para cada tipo de bloco
   * Como adicionar novos tipos:
   * 1. Importe o componente do bloco
   * 2. Adicione um case aqui
   * 3. Passe as props necessárias
   */
  const renderBlock = (block: EditorBlock, index: number) => {
    // Props comuns a todos os blocos
    const commonProps = {
      onChange: (updated: EditorBlock) => handleUpdateBlock(index, updated),
      onDelete: () => handleDeleteBlock(index),
      onDuplicate: () => handleDuplicateBlock(index),
      onMoveUp: index > 0 ? () => handleMoveUp(index) : undefined,
      onMoveDown: index < blocks.length - 1 ? () => handleMoveDown(index) : undefined,
      onInsertBelow: (type: EditorBlock['type']) => handleInsertBlock(type, index),
    };

    switch (block.type) {
      case 'paragraph':
        return <ParagraphBlockEditor block={block} {...commonProps} />;
      
      case 'heading':
        return <HeadingBlockEditor block={block} {...commonProps} />;
      
      case 'list':
        return <ListBlockEditor block={block} {...commonProps} />;
      
      case 'image':
        return <ImageBlockEditor block={block} {...commonProps} />;
      
      case 'divider':
        return <DividerBlockEditor block={block} {...commonProps} />;
      
      case 'quote':
        return <QuoteBlockEditor block={block} {...commonProps} />;
      
      case 'code':
        return <CodeBlockEditor block={block} {...commonProps} />;
      
      case 'video':
        return <VideoBlockEditor block={block} {...commonProps} />;
      
      case 'audio':
        return <AudioBlockEditor block={block} {...commonProps} />;
      
      case 'gallery':
        return <GalleryBlockEditor block={block} {...commonProps} />;
      
      case 'columns':
        return <ColumnsBlockEditor block={block} {...commonProps} />;
      
      case 'button':
        return <ButtonBlockEditor block={block} {...commonProps} />;
      
      case 'html':
        return <HTMLBlockEditor block={block} {...commonProps} />;
      
      case 'poll':
        return <PollBlockEditor block={block} {...commonProps} />;
      
      default:
        return (
          <div className="p-4 border border-dashed rounded bg-muted/50 text-muted-foreground text-center">
            Tipo de bloco desconhecido
          </div>
        );
    }
  };

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div className="space-y-1">
      {/* Contexto de drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.length === 0 ? (
            // Estado vazio - mostra placeholder e botão inicial
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-4">
                {placeholder || 'Comece a escrever seu conteúdo...'}
              </p>
              <BlockToolbar
                onInsert={(type) => handleInsertBlock(type, -1)}
                position="center"
              />
            </div>
          ) : (
            // Lista de blocos
            blocks.map((block, index) => (
              <SortableBlockWrapper key={block.id} id={block.id}>
                {renderBlock(block, index)}
              </SortableBlockWrapper>
            ))
          )}
        </SortableContext>
      </DndContext>

      {/* Botão para adicionar bloco no final */}
      {blocks.length > 0 && (
        <div className="pt-4">
          <BlockToolbar
            onInsert={(type) => handleInsertBlock(type, -1)}
            position="bottom"
          />
        </div>
      )}
    </div>
  );
}
