// ============================================
// TIPOS DO EDITOR DE POSTS
// ============================================
// Define todos os tipos TypeScript usados no editor WordPress-like
// Para adicionar novos tipos de blocos, adicione-os aqui primeiro

// Status possíveis de um post
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived' | 'rascunho' | 'em_edicao' | 'excluido';

// Tipo de enquete
export type PollType = 'single' | 'multiple';

// ============================================
// TIPOS DE BLOCOS DO EDITOR
// ============================================
// Cada bloco tem um ID único, tipo e conteúdo específico

// Bloco base - todos os blocos herdam essas propriedades
export interface BaseBlock {
  id: string; // UUID único do bloco
  type: string; // Tipo do bloco (paragraph, heading, image, etc.)
}

// Bloco de parágrafo - texto simples com formatação
export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string; // Texto em HTML (com formatação inline)
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

// Bloco de título (H1-H6)
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6; // Nível do título
  content: string; // Texto do título
  alignment?: 'left' | 'center' | 'right';
}

// Bloco de lista (ordenada ou não ordenada)
export interface ListBlock extends BaseBlock {
  type: 'list';
  listType: 'ordered' | 'unordered' | 'checklist'; // Tipo de lista
  items: { id: string; content: string; checked?: boolean }[]; // Itens da lista
}

// Bloco de citação (quote)
export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string; // Texto da citação
  author?: string; // Autor da citação (opcional)
}

// Bloco de código inline
export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string; // Linguagem de programação
  content: string; // Código
}

// Bloco de separador/divisor
export interface DividerBlock extends BaseBlock {
  type: 'divider';
  style?: 'solid' | 'dashed' | 'dotted'; // Estilo da linha
}

// Bloco de imagem
export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string; // URL da imagem
  alt: string; // Texto alternativo (acessibilidade)
  caption?: string; // Legenda da imagem
  width?: string | number; // Largura (px, %, auto)
  alignment?: 'left' | 'center' | 'right' | 'full';
}

// Bloco de galeria (múltiplas imagens)
export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: {
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }[];
  columns?: number; // Número de colunas (padrão: 3)
}

// Bloco de vídeo
export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string; // URL do vídeo ou embed URL
  caption?: string;
  width?: string | number;
}

// Bloco de áudio
export interface AudioBlock extends BaseBlock {
  type: 'audio';
  url: string; // URL do arquivo de áudio
  caption?: string;
}

// Bloco de colunas (layout)
export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  columnCount: 2 | 3 | 4; // Número de colunas
  columns: EditorBlock[][]; // Cada coluna contém uma lista de blocos
}

// Bloco de botão (CTA)
export interface ButtonBlock extends BaseBlock {
  type: 'button';
  text: string; // Texto do botão
  url: string; // URL de destino
  target?: '_blank' | '_self'; // Abrir em nova aba ou mesma aba
  rel?: string; // atributos rel (ex: nofollow, noopener)
  variant?: 'primary' | 'secondary' | 'outline'; // Estilo do botão
}

// Bloco de HTML bruto (com sanitização)
export interface HTMLBlock extends BaseBlock {
  type: 'html';
  content: string; // HTML bruto (será sanitizado antes de renderizar)
}

// Bloco de enquete (poll)
export interface PollBlock extends BaseBlock {
  type: 'poll';
  pollId?: string; // ID da enquete no banco (se já salvo)
  question: string; // Pergunta da enquete
  pollType: PollType; // Resposta única ou múltipla
  options: { id: string; text: string }[]; // Opções de resposta
  allowAnonymous: boolean; // Permitir voto anônimo
  requireLogin: boolean; // Exigir login para votar
  showResultsAfterVote: boolean; // Mostrar resultados após votar
}

// Categorias de eventos disponíveis
export type EventCategory = 
  | 'Ecommerce' 
  | 'Marketplace' 
  | 'ERP' 
  | 'Logística' 
  | 'Varejo' 
  | 'Tecnologia' 
  | 'Inovação';

// Bloco de vitrine de eventos
export interface EventsBlock extends BaseBlock {
  type: 'events';
  title?: string; // Título da seção
  subtitle?: string; // Subtítulo da seção
  showTitle?: boolean; // Toggle para exibir/ocultar título (padrão: false)
  showFilters?: boolean; // Mostrar filtros de busca
  showCalendar?: boolean; // Mostrar calendário
  // Texto antes do calendário
  calendarIntroTitle?: string;
  calendarIntroText?: string;
  // Texto antes da listagem de eventos
  eventsIntroTitle?: string;
  eventsIntroText?: string;
  events: {
    id: string;
    nome: string;
    resumo?: string;
    imagem: string;
    data: string;
    local: string;
    modalidade: 'Presencial' | 'Online' | 'Híbrido';
    categoria?: EventCategory; // Categoria do evento
    publicoAlvo?: string; // "Para quem é"
    valor?: 'Gratuito' | 'Pago' | 'A confirmar';
    participacaoSebrae?: string;
    descricao?: string;
    linkMaisInfo?: string;
    linkInscricao?: string;
  }[];
}

// União de todos os tipos de blocos
export type EditorBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | CodeBlock
  | DividerBlock
  | ImageBlock
  | GalleryBlock
  | VideoBlock
  | AudioBlock
  | ColumnsBlock
  | ButtonBlock
  | HTMLBlock
  | PollBlock
  | EventsBlock;

// ============================================
// TIPOS DE POST
// ============================================

// Estrutura completa de um post
export interface Post {
  id: string;
  titulo: string; // Título do post
  slug: string; // URL amigável (slug)
  excerpt?: string; // Resumo/descrição curta
  conteudo: EditorBlock[]; // Conteúdo em blocos JSON
  featured_image?: string; // URL da imagem destacada
  categoria_id?: string; // ID da categoria
  categories?: { nome: string }; // Dados da categoria (join)
  status: PostStatus; // Status do post
  scheduled_at?: string; // Data de agendamento (ISO string)
  autor_id?: string; // ID do autor
  publicado: boolean; // Se está publicado (legado - usar status)
  word_count: number; // Contagem de palavras
  reading_time: number; // Tempo de leitura em minutos
  criado_em: string; // Data de criação
  atualizado_em: string; // Data de atualização
}

// Metadados de SEO de um post
export interface PostMeta {
  id?: string;
  post_id: string;
  meta_title?: string; // Título customizado para SEO
  meta_description?: string; // Descrição customizada para SEO (até 160 caracteres)
  canonical_url?: string; // URL canônica
  noindex: boolean; // Se deve ser indexado por mecanismos de busca
  og_title?: string; // Open Graph title
  og_description?: string; // Open Graph description
  og_image?: string; // Open Graph image URL
  twitter_card_type: string; // Tipo de card do Twitter
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
}

// Revisão de um post (histórico)
export interface PostRevision {
  id: string;
  post_id: string;
  user_id?: string;
  titulo: string;
  conteudo: EditorBlock[]; // Conteúdo em blocos na revisão
  excerpt?: string;
  metadata: Record<string, any>; // Outros campos salvos na revisão
  revision_number: number; // Número sequencial da revisão
  criado_em: string;
}

// ============================================
// TIPOS DE MÍDIA
// ============================================

// Item da biblioteca de mídia
export interface MediaItem {
  id: string;
  user_id?: string;
  filename: string; // Nome do arquivo no servidor
  original_filename: string; // Nome original do arquivo
  mime_type: string; // Tipo MIME (image/jpeg, video/mp4, etc.)
  file_size: number; // Tamanho em bytes
  file_path: string; // Caminho completo no storage
  alt_text?: string; // Texto alternativo (importante para acessibilidade!)
  caption?: string; // Legenda da mídia
  width?: number; // Largura (para imagens)
  height?: number; // Altura (para imagens)
  metadata: Record<string, any>; // Metadados adicionais
  criado_em: string;
  atualizado_em: string;
}

// ============================================
// TIPOS DE ENQUETE
// ============================================

// Estrutura de uma enquete
export interface Poll {
  id: string;
  post_id?: string;
  block_id: string; // ID do bloco no editor onde a enquete está
  question: string;
  poll_type: PollType;
  options: { id: string; text: string }[]; // Opções de resposta
  allow_anonymous: boolean;
  require_login: boolean;
  show_results_after_vote: boolean;
  criado_em: string;
  atualizado_em: string;
}

// Voto em uma enquete
export interface PollVote {
  id: string;
  poll_id: string;
  user_id?: string; // null se anônimo
  option_ids: string[]; // IDs das opções votadas
  voter_fingerprint?: string; // Hash para prevenir votos duplicados
  criado_em: string;
}

// Resultado de uma enquete (agregado)
export interface PollResults {
  pollId: string;
  totalVotes: number; // Total de votos
  optionResults: {
    optionId: string;
    optionText: string;
    voteCount: number;
    percentage: number; // Percentual de votos
  }[];
}

// ============================================
// TIPOS DE CATEGORIA E TAG
// ============================================

export interface Category {
  id: string;
  nome: string;
  tipo: 'blog' | 'case'; // Tipo da categoria
  criado_em: string;
  atualizado_em: string;
}

export interface Tag {
  id: string;
  nome: string;
  tipo: 'blog' | 'case';
  criado_em: string;
  atualizado_em: string;
}

// ============================================
// TIPOS DE FORMULÁRIO
// ============================================

// Estado do formulário de edição de post
export interface PostFormData {
  titulo: string;
  slug: string;
  excerpt: string;
  conteudo: EditorBlock[];
  featured_image?: string;
  categoria_id?: string;
  categoriesIds: string[]; // Múltiplas categorias
  tagsIds: string[]; // Múltiplas tags
  status: PostStatus;
  scheduled_at?: Date;
  is_featured: boolean;
  seoMeta: Partial<PostMeta>;
}
