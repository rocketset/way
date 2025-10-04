// ============================================
// TOOLBAR PARA ADICIONAR BLOCOS
// ============================================
// Menu com todos os tipos de blocos disponíveis
// Organizado por categorias: Texto, Mídia, Layout, etc.

import { EditorBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListChecks,
  Quote,
  Code,
  Minus,
  Image,
  Images,
  Video,
  Music,
  Columns,
  Link2,
  FileCode,
  BarChart3,
} from 'lucide-react';

interface BlockToolbarProps {
  onInsert: (type: EditorBlock['type']) => void;
  position?: 'top' | 'bottom' | 'center';
}

/**
 * Toolbar com botões para inserir diferentes tipos de blocos
 * Organizado em categorias para facilitar a navegação
 */
export function BlockToolbar({ onInsert, position = 'bottom' }: BlockToolbarProps) {
  // ============================================
  // CATEGORIAS DE BLOCOS
  // ============================================

  const textBlocks = [
    { type: 'paragraph' as const, icon: Type, label: 'Parágrafo', description: 'Texto simples' },
    { type: 'heading' as const, icon: Heading1, label: 'Título', description: 'H1, H2, H3...' },
    { type: 'list' as const, icon: List, label: 'Lista', description: 'Ordenada ou bullets' },
    { type: 'quote' as const, icon: Quote, label: 'Citação', description: 'Destaque um trecho' },
    { type: 'code' as const, icon: Code, label: 'Código', description: 'Bloco de código' },
  ];

  const mediaBlocks = [
    { type: 'image' as const, icon: Image, label: 'Imagem', description: 'Upload ou URL' },
    { type: 'gallery' as const, icon: Images, label: 'Galeria', description: 'Múltiplas imagens' },
    { type: 'video' as const, icon: Video, label: 'Vídeo', description: 'YouTube, Vimeo...' },
    { type: 'audio' as const, icon: Music, label: 'Áudio', description: 'Arquivo de áudio' },
  ];

  const layoutBlocks = [
    { type: 'divider' as const, icon: Minus, label: 'Separador', description: 'Linha divisória' },
    { type: 'columns' as const, icon: Columns, label: 'Colunas', description: '2, 3 ou 4 colunas' },
    { type: 'button' as const, icon: Link2, label: 'Botão', description: 'Call-to-action' },
  ];

  const advancedBlocks = [
    { type: 'html' as const, icon: FileCode, label: 'HTML', description: 'Código HTML bruto' },
    { type: 'poll' as const, icon: BarChart3, label: 'Enquete', description: 'Votação interativa' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          + Adicionar Bloco
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-2" 
        align={position === 'center' ? 'center' : 'start'}
      >
        <div className="space-y-4">
          {/* Categoria: Texto */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              Texto
            </h4>
            <div className="space-y-1">
              {textBlocks.map((block) => (
                <Button
                  key={block.type}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2"
                  onClick={() => onInsert(block.type)}
                >
                  <block.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{block.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {block.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Categoria: Mídia */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              Mídia
            </h4>
            <div className="space-y-1">
              {mediaBlocks.map((block) => (
                <Button
                  key={block.type}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2"
                  onClick={() => onInsert(block.type)}
                >
                  <block.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{block.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {block.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Categoria: Layout */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              Layout
            </h4>
            <div className="space-y-1">
              {layoutBlocks.map((block) => (
                <Button
                  key={block.type}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2"
                  onClick={() => onInsert(block.type)}
                >
                  <block.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{block.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {block.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Categoria: Avançado */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              Avançado
            </h4>
            <div className="space-y-1">
              {advancedBlocks.map((block) => (
                <Button
                  key={block.type}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2"
                  onClick={() => onInsert(block.type)}
                >
                  <block.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{block.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {block.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
