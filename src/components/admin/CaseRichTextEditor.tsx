import { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { FormattingToolbar } from '@/components/editor/FormattingToolbar';

interface CaseRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function CaseRichTextEditor({
  value,
  onChange,
  placeholder = 'Digite seu texto aqui...',
  minHeight = '200px',
}: CaseRichTextEditorProps) {
  const contentRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleContentChange = (evt: any) => {
    onChange(evt.target.value);
  };

  const captureSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (contentRef.current && contentRef.current.contains(range.commonAncestorContainer)) {
      // Selection captured
    }
  };

  const handleInsertList = (type: 'ul' | 'ol') => {
    const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(command, false);
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all
        ${isFocused ? 'border-primary shadow-sm' : 'border-border hover:border-border/80'}
      `}
    >
      {isFocused && (
        <FormattingToolbar
          onFormat={(format) => {
            document.execCommand(format, false);
            if (contentRef.current) {
              onChange(contentRef.current.innerHTML);
            }
          }}
          onCaptureSelection={captureSelection}
          onInsertList={handleInsertList}
        />
      )}

      <ContentEditable
        innerRef={contentRef}
        html={value || `<p class="text-muted-foreground">${placeholder}</p>`}
        onChange={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseUp={captureSelection}
        onKeyUp={captureSelection}
        style={{ minHeight }}
        className={`
          outline-none prose prose-sm max-w-none
          [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
          [&_a]:decoration-primary/50 [&_a:hover]:decoration-primary
          [&_a]:transition-colors [&_a]:cursor-pointer
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
          [&_li]:my-1
        `}
        tagName="div"
      />
    </div>
  );
}
