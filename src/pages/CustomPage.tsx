import { useParams } from 'react-router-dom';
import { useCustomPageBySlug } from '@/hooks/useCustomPages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import DOMPurify from 'dompurify';
import { useEffect } from 'react';
import { renderEditorBlock } from '@/utils/blockRenderer';
import { EditorBlock } from '@/types/editor';

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = useCustomPageBySlug(slug);

  // Execute JS safely after content loads
  useEffect(() => {
    if (page?.js_content) {
      try {
        // Create a function from the JS content and execute it
        const executeScript = new Function(page.js_content);
        executeScript();
      } catch (e) {
        console.error('Error executing page script:', e);
      }
    }
  }, [page?.js_content]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (error || !page) {
    return null; // Let 404 route handle this
  }

  // Sanitize HTML content
  const sanitizedHtml = DOMPurify.sanitize(page.html_content || '', {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'loading'],
  });

  return (
    <>
      <SEO
        title={page.meta_title || page.titulo}
        description={page.meta_description || ''}
        ogImage={page.og_image || undefined}
        noindex={page.noindex}
        canonical={page.canonical_url || undefined}
      />

      {/* Custom CSS */}
      {page.css_content && (
        <style dangerouslySetInnerHTML={{ __html: page.css_content }} />
      )}

      {/* Custom Head */}
      {page.custom_head && (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.custom_head) }} />
      )}

      {page.header_visible && <Header />}

      <main className={page.header_visible ? 'pt-20' : ''}>
        {page.blocks_content && Array.isArray(page.blocks_content) && page.blocks_content.length > 0 ? (
          <div className={page.layout === 'boxed' ? 'container mx-auto px-4 py-8' : 'py-8'}>
            <div className="prose prose-lg max-w-none">
              {(page.blocks_content as EditorBlock[]).map((block, index) =>
                renderEditorBlock(block, index)
              )}
            </div>
          </div>
        ) : (
          <div
            className={page.layout === 'boxed' ? 'container mx-auto px-4' : ''}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        )}
      </main>

      {page.footer_visible && <Footer />}
    </>
  );
}