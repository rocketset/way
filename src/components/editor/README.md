# Editor WordPress-Like - Documentação

Este é um sistema de editor de posts estilo WordPress com suporte a blocos, mídia, SEO e muito mais.

## Estrutura de Arquivos

```
src/components/editor/
├── BlockEditor.tsx          # Componente principal do editor de blocos
├── blocks/                  # Componentes individuais de cada tipo de bloco
│   ├── ParagraphBlock.tsx   # Bloco de parágrafo
│   ├── HeadingBlock.tsx     # Bloco de título (H1-H6)
│   ├── ImageBlock.tsx       # Bloco de imagem
│   ├── PollBlock.tsx        # Bloco de enquete
│   └── ...                  # Outros blocos
├── toolbar/                 # Barra de ferramentas do editor
│   ├── BlockToolbar.tsx     # Toolbar com botões de adicionar blocos
│   └── FormattingToolbar.tsx# Toolbar de formatação de texto
├── MediaLibrary.tsx         # Biblioteca de mídia (upload e seleção)
├── SEOPanel.tsx             # Painel lateral de SEO
├── RevisionHistory.tsx      # Histórico de revisões
└── AutoSave.tsx             # Sistema de autosave
```

## Como Funciona

### 1. Estrutura de Blocos

Cada post é composto por um array de blocos em formato JSON:

```typescript
const blocks: EditorBlock[] = [
  {
    id: 'uuid-1',
    type: 'paragraph',
    content: '<p>Texto com <strong>formatação</strong></p>',
    alignment: 'left'
  },
  {
    id: 'uuid-2',
    type: 'image',
    url: 'https://...',
    alt: 'Descrição da imagem',
    caption: 'Legenda opcional'
  }
];
```

### 2. Tipos de Blocos Disponíveis

- **Texto**: paragraph, heading (H1-H6), list, quote, code
- **Mídia**: image, gallery, video, audio
- **Layout**: columns, divider, button
- **Interativo**: poll (enquete)
- **Avançado**: html (HTML bruto sanitizado)

### 3. Sistema de SEO

Cada post pode ter metadados de SEO completos:
- Meta title e description
- Open Graph (Facebook)
- Twitter Card
- URL canônica
- Controle de indexação

### 4. Sistema de Revisões

- Autosave a cada 30 segundos (configurável)
- Histórico completo de revisões
- Restaurar qualquer revisão anterior
- Ver diff entre revisões

### 5. Biblioteca de Mídia

- Upload de imagens, vídeos e áudio
- Busca e filtros por tipo
- Gerenciamento de alt text e legendas
- Resize automático e lazy loading

## Como Adicionar um Novo Tipo de Bloco

### Passo 1: Definir o Tipo

Em `src/types/editor.ts`, adicione a interface do bloco:

```typescript
export interface MeuNovoBlock extends BaseBlock {
  type: 'meuNovo';
  meuCampo: string;
  minhaConfig?: boolean;
}

// Adicione ao union type
export type EditorBlock = 
  | ParagraphBlock 
  | ... 
  | MeuNovoBlock;
```

### Passo 2: Criar o Componente

Crie `src/components/editor/blocks/MeuNovoBlock.tsx`:

```typescript
import { useState } from 'react';
import { MeuNovoBlock as MeuNovoBlockType } from '@/types/editor';

interface Props {
  block: MeuNovoBlockType;
  onChange: (updatedBlock: MeuNovoBlockType) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function MeuNovoBlock({ block, onChange, onDelete }: Props) {
  return (
    <div className="border rounded p-4">
      {/* Seu editor aqui */}
      <input
        value={block.meuCampo}
        onChange={(e) => onChange({ ...block, meuCampo: e.target.value })}
      />
    </div>
  );
}
```

### Passo 3: Adicionar ao Editor

Em `BlockEditor.tsx`, adicione o caso no switch:

```typescript
case 'meuNovo':
  return <MeuNovoBlock key={block.id} block={block} ... />;
```

### Passo 4: Adicionar ao Toolbar

Em `toolbar/BlockToolbar.tsx`, adicione o botão:

```typescript
<Button onClick={() => onInsertBlock('meuNovo')}>
  <MeuIcone className="h-4 w-4" />
  Meu Novo Bloco
</Button>
```

### Passo 5: Adicionar Criação Padrão

Em `src/utils/editorUtils.ts`, adicione o caso:

```typescript
case 'meuNovo':
  return {
    ...baseBlock,
    type: 'meuNovo',
    meuCampo: 'valor padrão',
  } as MeuNovoBlock;
```

## Como Modificar o Autosave

Em `AutoSave.tsx`, você pode ajustar:

```typescript
// Intervalo de autosave (em milissegundos)
const AUTOSAVE_INTERVAL = 30000; // 30 segundos

// Altere para o intervalo desejado:
const AUTOSAVE_INTERVAL = 60000; // 1 minuto
const AUTOSAVE_INTERVAL = 5000;  // 5 segundos
```

## Como Adicionar Validações Customizadas

Em `src/utils/editorUtils.ts`, na função `isBlockValid`:

```typescript
case 'meuNovo':
  return (
    block.meuCampo.length >= 5 && // Mínimo 5 caracteres
    block.minhaConfig !== undefined // Campo obrigatório
  );
```

## Como Personalizar os Metadados de SEO

Em `SEOPanel.tsx`, adicione novos campos ao formulário:

```typescript
<div className="space-y-2">
  <Label>Meu Campo Customizado</Label>
  <Input
    value={seoMeta.meuCampo}
    onChange={(e) => setSeoMeta({ ...seoMeta, meuCampo: e.target.value })}
  />
</div>
```

E atualize o tipo em `src/types/editor.ts`:

```typescript
export interface PostMeta {
  // ... campos existentes
  meuCampo?: string;
}
```

## Como Customizar a Geração de Slug

Em `src/utils/slugUtils.ts`, modifique a função `generateSlug`:

```typescript
// Para usar underscores ao invés de hífens
slug = slug.replace(/\s+/g, '_');

// Para manter números no início
// (remova o trim de caracteres inválidos no início)

// Para permitir pontos
slug = slug.replace(/[^a-z0-9\s\-.]/g, '');
```

## Como Adicionar Novos Formatos de Mídia

Em `MediaLibrary.tsx`, adicione o tipo MIME:

```typescript
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  document: ['application/pdf'], // Novo tipo
};
```

## Atalhos de Teclado

No editor, você pode usar:

- `/` - Abre menu de inserção de blocos
- `**texto**` - Negrito (ao digitar)
- `##` - Converte em título (ao digitar)
- `Ctrl/Cmd + B` - Negrito
- `Ctrl/Cmd + I` - Itálico
- `Ctrl/Cmd + S` - Salvar
- `Ctrl/Cmd + Z` - Desfazer
- `Ctrl/Cmd + Shift + Z` - Refazer

## Limitações e Próximos Passos

### Implementado:
✅ Estrutura de blocos base
✅ Tipos TypeScript completos
✅ Funções utilitárias (slug, leitura, etc.)
✅ Migração do banco de dados
✅ Sistema de SEO completo

### Para Implementar (expandir):
⏳ Componentes visuais de todos os blocos
⏳ Toolbar de formatação rica (negrito, itálico, links)
⏳ Drag and drop entre blocos
⏳ Sistema completo de revisões
⏳ Preview em tempo real
⏳ Biblioteca de mídia completa com upload
⏳ Sistema de enquetes interativo
⏳ Autosave automático
⏳ Atalhos de teclado

### Como Continuar o Desenvolvimento:

1. **Implementar blocos faltantes**: Copie a estrutura de `ParagraphBlock.tsx` e adapte
2. **Adicionar formatação**: Use bibliotecas como `react-quill` ou `tiptap`
3. **Drag and drop**: Use `@dnd-kit/core` para arrastar blocos
4. **Upload de mídia**: Integre com Supabase Storage (já configurado no banco)
5. **Autosave**: Use `useEffect` com debounce para salvar automaticamente

## Arquitetura de Dados

### Banco de Dados

```sql
posts:
- conteudo: JSONB (array de blocos)
- slug: TEXT (único)
- excerpt: TEXT
- featured_image: TEXT
- status: post_status ENUM
- word_count: INTEGER
- reading_time: INTEGER

post_meta:
- meta_title, meta_description
- og_*, twitter_*

post_revisions:
- conteudo: JSONB (snapshot dos blocos)
- revision_number: INTEGER

media_library:
- file_path, mime_type
- alt_text, caption
- width, height

polls:
- question, options: JSONB
- poll_type, require_login

poll_votes:
- option_ids: JSONB
- voter_fingerprint (previne votos duplicados)
```

## Segurança

### RLS (Row Level Security)

Todas as tabelas têm políticas RLS:
- Apenas admins podem criar/editar/deletar posts
- Posts publicados são públicos
- Biblioteca de mídia apenas para admins
- Enquetes públicas apenas em posts publicados

### Sanitização

- HTML bruto é sanitizado antes de renderizar (use DOMPurify)
- URLs de imagens/vídeos são validadas
- Slugs são sanitizados e validados

### Prevenção de Duplicatas

- Slugs únicos (índice no banco)
- Votos em enquetes: verificação por fingerprint
- Revisões: número sequencial por post

## Performance

### Otimizações Implementadas:

- Índices no banco para queries rápidas
- JSONB para conteúdo (busca eficiente)
- Lazy loading de imagens
- Cálculo de leitura no banco (função SQL)

### Otimizações Recomendadas:

- Implementar virtual scrolling para listas grandes de blocos
- Debounce no autosave (300-500ms)
- Cache de revisões no localStorage
- Comprimir imagens antes de upload
- CDN para servir mídia

## Suporte e Manutenção

Para dúvidas ou problemas:
1. Verifique os tipos em `src/types/editor.ts`
2. Revise as funções utilitárias em `src/utils/`
3. Consulte os comentários inline no código
4. Todos os arquivos têm comentários em português explicando cada seção

## Contribuindo

Ao adicionar novos recursos:
1. Sempre adicione comentários em português
2. Mantenha os tipos TypeScript atualizados
3. Adicione validações apropriadas
4. Teste com posts reais
5. Documente mudanças neste README

---

**Versão**: 1.0.0  
**Última atualização**: 2025  
**Compatibilidade**: React 18+, Supabase, TypeScript 5+
