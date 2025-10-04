import { EditorBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Poll } from '@/components/Poll';

/**
 * Renderiza um bloco do editor em JSX para visualização
 */
export const renderEditorBlock = (block: EditorBlock, index: number): JSX.Element => {
  const key = `${block.type}-${block.id}-${index}`;

  switch (block.type) {
    case 'paragraph':
      return (
        <div
          key={key}
          dangerouslySetInnerHTML={{ __html: block.content }}
          className={`
            prose-p:text-foreground/80 prose-p:leading-relaxed text-${block.alignment || 'left'}
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
            [&_a]:decoration-primary/50 [&_a:hover]:decoration-primary
            [&_a]:transition-colors [&_a]:cursor-pointer
          `}
        />
      );

    case 'heading':
      const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          key={key}
          className={`
            font-bold text-foreground
            ${block.level === 1 ? 'text-4xl mt-8 mb-4' : ''}
            ${block.level === 2 ? 'text-3xl text-primary mt-6 mb-3' : ''}
            ${block.level === 3 ? 'text-2xl mt-5 mb-2' : ''}
            ${block.level === 4 ? 'text-xl mt-4 mb-2' : ''}
            ${block.level === 5 ? 'text-lg mt-3 mb-2' : ''}
            ${block.level === 6 ? 'text-base mt-2 mb-1' : ''}
          `}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case 'list':
      const ListTag = block.listType === 'ordered' ? 'ol' : 'ul';
      const listClass = block.listType === 'ordered' 
        ? 'list-decimal list-inside space-y-2 text-foreground/80'
        : block.listType === 'checklist'
        ? 'space-y-2'
        : 'list-disc list-inside space-y-2 text-foreground/80';

      return (
        <ListTag key={key} className={listClass}>
          {block.items.map((item, i) => (
            block.listType === 'checklist' ? (
              <div key={i} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="mt-1 cursor-not-allowed"
                />
                <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                  {item.content}
                </span>
              </div>
            ) : (
              <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
            )
          ))}
        </ListTag>
      );

    case 'quote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-primary pl-6 py-2 my-6 italic text-lg bg-muted/30 rounded-r"
        >
          <div
            dangerouslySetInnerHTML={{ __html: block.content }}
            className={`
              text-foreground/90 mb-2
              [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
              [&_a]:decoration-primary/50 [&_a:hover]:decoration-primary
              [&_a]:transition-colors [&_a]:cursor-pointer
            `}
          />
          {block.author && (
            <footer className="text-sm text-muted-foreground not-italic">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );

    case 'image':
      return (
        <figure key={key} className="my-8">
          <img
            src={block.url}
            alt={block.alt || ''}
            className="w-full rounded-lg shadow-lg"
            style={{
              width: block.width || '100%',
              maxWidth: '100%'
            }}
          />
          {block.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'gallery':
      const columns = block.columns || 3;
      return (
        <div
          key={key}
          className={`grid gap-4 my-8`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {block.images.map((img, i) => (
            <figure key={i}>
              <img
                src={img.url}
                alt={img.alt || ''}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              {img.caption && (
                <figcaption className="text-xs text-muted-foreground mt-1">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      );

    case 'video':
      // Detectar se é URL do YouTube
      const isYouTube = block.url.includes('youtube.com') || block.url.includes('youtu.be');
      
      if (isYouTube) {
        // Extrair ID do vídeo do YouTube
        let videoId = '';
        if (block.url.includes('youtube.com/watch?v=')) {
          videoId = block.url.split('v=')[1]?.split('&')[0] || '';
        } else if (block.url.includes('youtu.be/')) {
          videoId = block.url.split('youtu.be/')[1]?.split('?')[0] || '';
        }
        
        return (
          <div key={key} className="my-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              />
            </div>
            {block.caption && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {block.caption}
              </p>
            )}
          </div>
        );
      }
      
      // Vídeo normal (arquivo)
      return (
        <div key={key} className="my-8">
          <video
            src={block.url}
            controls
            className="w-full rounded-lg"
            style={{ width: block.width || '100%' }}
          />
          {block.caption && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {block.caption}
            </p>
          )}
        </div>
      );

    case 'audio':
      return (
        <div key={key} className="my-8">
          <audio
            src={block.url}
            controls
            className="w-full"
          />
          {block.caption && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {block.caption}
            </p>
          )}
        </div>
      );

    case 'code':
      return (
        <div key={key} className="my-6">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className={`language-${block.language || 'plaintext'} text-sm`}>
              {block.content}
            </code>
          </pre>
        </div>
      );

    case 'divider':
      return (
        <hr
          key={key}
          className={`my-8 border-t-2 ${
            block.style === 'dashed' ? 'border-dashed' :
            block.style === 'dotted' ? 'border-dotted' :
            'border-solid'
          } border-border`}
        />
      );

    case 'button':
      const buttonVariant = block.variant === 'primary' ? 'default' : block.variant || 'default';
      return (
        <div key={key} className="my-6 text-center">
          <Button
            variant={buttonVariant as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'}
            asChild
          >
            <a
              href={block.url}
              target={block.target || '_self'}
              rel={block.target === '_blank' ? 'noopener noreferrer' : block.rel}
            >
              {block.text}
            </a>
          </Button>
        </div>
      );

    case 'html':
      return (
        <div
          key={key}
          dangerouslySetInnerHTML={{ __html: block.content }}
          className="my-6"
        />
      );

    case 'poll':
      return (
        <Poll
          key={key}
          blockId={block.id}
          question={block.question}
          pollType={block.pollType}
          options={block.options}
          requireLogin={block.requireLogin}
          allowAnonymous={block.allowAnonymous}
          showResultsAfterVote={block.showResultsAfterVote}
        />
      );

    case 'columns':
      const columnTemplate = `repeat(${block.columnCount}, 1fr)`;
      return (
        <div
          key={key}
          className="grid gap-6 my-8"
          style={{
            gridTemplateColumns: columnTemplate
          }}
        >
          {block.columns.map((column, i) => (
            <div key={i} className="space-y-4">
              {column.map((nestedBlock, j) => 
                renderEditorBlock(nestedBlock, j)
              )}
            </div>
          ))}
        </div>
      );

    default:
      return <div key={key} className="text-muted-foreground italic">Bloco não suportado</div>;
  }
};
