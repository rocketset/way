// ============================================
// UTILITÁRIOS DO EDITOR DE BLOCOS
// ============================================
// Funções auxiliares para trabalhar com blocos do editor
// Inclui: criação de blocos, extração de texto, cálculo de leitura, etc.

import { EditorBlock, ParagraphBlock, HeadingBlock, ListBlock } from '@/types/editor';
import { v4 as uuidv4 } from 'uuid';

// Nota: instale uuid se ainda não estiver instalado
// npm install uuid @types/uuid

/**
 * Cria um novo bloco vazio do tipo especificado
 * 
 * @param type - Tipo do bloco a ser criado
 * @returns Novo bloco com valores padrão
 * 
 * Como adicionar novos tipos:
 * 1. Adicione o tipo em src/types/editor.ts
 * 2. Adicione um case aqui com os valores padrão do bloco
 */
export function createEmptyBlock(
  type: EditorBlock['type']
): EditorBlock {
  const baseBlock = {
    id: uuidv4(), // Gera UUID único para o bloco
  };

  switch (type) {
    case 'paragraph':
      return {
        ...baseBlock,
        type: 'paragraph',
        content: '',
        alignment: 'left',
      } as ParagraphBlock;

    case 'heading':
      return {
        ...baseBlock,
        type: 'heading',
        level: 2, // H2 por padrão
        content: '',
        alignment: 'left',
      } as HeadingBlock;

    case 'list':
      return {
        ...baseBlock,
        type: 'list',
        listType: 'unordered',
        items: [{ id: uuidv4(), content: '' }],
      } as ListBlock;

    case 'quote':
      return {
        ...baseBlock,
        type: 'quote',
        content: '',
      };

    case 'code':
      return {
        ...baseBlock,
        type: 'code',
        language: 'javascript',
        content: '',
      };

    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        style: 'solid',
      };

    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        url: '',
        alt: '',
        alignment: 'center',
      };

    case 'gallery':
      return {
        ...baseBlock,
        type: 'gallery',
        images: [],
        columns: 3,
      };

    case 'video':
      return {
        ...baseBlock,
        type: 'video',
        url: '',
      };

    case 'audio':
      return {
        ...baseBlock,
        type: 'audio',
        url: '',
      };

    case 'columns':
      return {
        ...baseBlock,
        type: 'columns',
        columnCount: 2,
        columns: [[], []],
      };

    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        text: 'Clique aqui',
        url: '#',
        target: '_self',
        variant: 'primary',
      };

    case 'html':
      return {
        ...baseBlock,
        type: 'html',
        content: '',
      };

    case 'poll':
      return {
        ...baseBlock,
        type: 'poll',
        question: '',
        pollType: 'single',
        options: [
          { id: uuidv4(), text: '' },
          { id: uuidv4(), text: '' },
        ],
        allowAnonymous: false,
        requireLogin: true,
        showResultsAfterVote: true,
      };

    default:
      // Fallback para parágrafo se tipo desconhecido
      return createEmptyBlock('paragraph');
  }
}

/**
 * Extrai texto puro de um bloco (remove HTML e formatação)
 * 
 * @param block - Bloco do editor
 * @returns Texto puro extraído
 * 
 * Como usar:
 * - Para contagem de palavras
 * - Para prévia de texto
 * - Para busca de conteúdo
 */
export function extractTextFromBlock(block: EditorBlock): string {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
    case 'quote':
      // Remove tags HTML do conteúdo
      const div = document.createElement('div');
      div.innerHTML = block.content;
      return div.textContent || div.innerText || '';

    case 'list':
      return block.items.map(item => {
        const div = document.createElement('div');
        div.innerHTML = item.content;
        return div.textContent || div.innerText || '';
      }).join(' ');

    case 'code':
      return block.content;

    case 'button':
      return block.text;

    case 'poll':
      return `${block.question} ${block.options.map(o => o.text).join(' ')}`;

    default:
      return '';
  }
}

/**
 * Extrai todo o texto de uma lista de blocos
 * 
 * @param blocks - Array de blocos
 * @returns Texto completo extraído de todos os blocos
 */
export function extractTextFromBlocks(blocks: EditorBlock[]): string {
  return blocks.map(block => {
    // Se for um bloco de colunas, extrai texto recursivamente
    if (block.type === 'columns') {
      return block.columns
        .map(col => extractTextFromBlocks(col))
        .join(' ');
    }
    return extractTextFromBlock(block);
  }).join(' ');
}

/**
 * Conta o número de palavras em um texto
 * 
 * @param text - Texto para contar palavras
 * @returns Número de palavras
 */
export function countWords(text: string): number {
  // Remove espaços extras e quebras de linha
  const cleanText = text.trim().replace(/\s+/g, ' ');
  
  // Se não há texto, retorna 0
  if (!cleanText) return 0;
  
  // Divide por espaços e conta
  return cleanText.split(' ').filter(word => word.length > 0).length;
}

/**
 * Calcula o tempo estimado de leitura
 * 
 * @param wordCount - Número de palavras
 * @param wordsPerMinute - Palavras lidas por minuto (padrão: 200)
 * @returns Tempo de leitura em minutos (mínimo 1)
 * 
 * Como ajustar:
 * - Mude wordsPerMinute para ajustar a velocidade de leitura base
 * - Valor padrão de 200 é a média para leitura em português
 */
export function calculateReadingTime(
  wordCount: number,
  wordsPerMinute: number = 200
): number {
  if (wordCount === 0) return 1;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

/**
 * Calcula estatísticas de leitura de um array de blocos
 * 
 * @param blocks - Array de blocos do editor
 * @returns Objeto com contagem de palavras e tempo de leitura
 */
export function calculateReadingStats(blocks: EditorBlock[]): {
  wordCount: number;
  readingTime: number;
} {
  const text = extractTextFromBlocks(blocks);
  const wordCount = countWords(text);
  const readingTime = calculateReadingTime(wordCount);
  
  return { wordCount, readingTime };
}

/**
 * Move um bloco de uma posição para outra (drag and drop)
 * 
 * @param blocks - Array de blocos
 * @param fromIndex - Índice de origem
 * @param toIndex - Índice de destino
 * @returns Novo array com bloco movido
 */
export function moveBlock(
  blocks: EditorBlock[],
  fromIndex: number,
  toIndex: number
): EditorBlock[] {
  const newBlocks = [...blocks];
  const [movedBlock] = newBlocks.splice(fromIndex, 1);
  newBlocks.splice(toIndex, 0, movedBlock);
  return newBlocks;
}

/**
 * Duplica um bloco
 * 
 * @param block - Bloco a ser duplicado
 * @returns Novo bloco com ID único mas mesmo conteúdo
 */
export function duplicateBlock(block: EditorBlock): EditorBlock {
  const newBlock = JSON.parse(JSON.stringify(block)); // Deep clone
  newBlock.id = uuidv4(); // Novo ID único
  
  // Se for uma lista, gera novos IDs para os itens
  if (newBlock.type === 'list') {
    newBlock.items = newBlock.items.map((item: any) => ({
      ...item,
      id: uuidv4(),
    }));
  }
  
  // Se for uma enquete, gera novos IDs para as opções e remove o pollId
  if (newBlock.type === 'poll') {
    newBlock.pollId = undefined;
    newBlock.options = newBlock.options.map((option: any) => ({
      ...option,
      id: uuidv4(),
    }));
  }
  
  // Se for colunas, gera novos IDs recursivamente
  if (newBlock.type === 'columns') {
    newBlock.columns = newBlock.columns.map((col: EditorBlock[]) =>
      col.map((b: EditorBlock) => duplicateBlock(b))
    );
  }
  
  return newBlock;
}

/**
 * Valida se um bloco está completo e pode ser salvo
 * 
 * @param block - Bloco a ser validado
 * @returns true se válido, false caso contrário
 * 
 * Como adicionar validações:
 * - Adicione cases para novos tipos de blocos
 * - Defina o que torna um bloco válido (ex: imagem precisa ter URL e alt)
 */
export function isBlockValid(block: EditorBlock): boolean {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
      return block.content.trim().length > 0;

    case 'list':
      return block.items.length > 0 && 
             block.items.some(item => item.content.trim().length > 0);

    case 'quote':
    case 'code':
      return block.content.trim().length > 0;

    case 'image':
      return block.url.trim().length > 0 && block.alt.trim().length > 0;

    case 'video':
    case 'audio':
      return block.url.trim().length > 0;

    case 'button':
      return block.text.trim().length > 0 && block.url.trim().length > 0;

    case 'poll':
      return (
        block.question.trim().length > 0 &&
        block.options.length >= 2 &&
        block.options.every(opt => opt.text.trim().length > 0)
      );

    case 'gallery':
      return block.images.length > 0;

    case 'divider':
    case 'html':
    case 'columns':
      return true; // Sempre válidos

    default:
      return false;
  }
}

/**
 * Remove blocos vazios/inválidos de um array
 * 
 * @param blocks - Array de blocos
 * @returns Array apenas com blocos válidos
 */
export function removeInvalidBlocks(blocks: EditorBlock[]): EditorBlock[] {
  return blocks.filter(isBlockValid);
}
