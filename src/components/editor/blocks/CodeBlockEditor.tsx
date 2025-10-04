// Editor de Bloco de Código
import { CodeBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Props {
  block: CodeBlock;
  onChange: (block: CodeBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function CodeBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'php',
    'ruby', 'go', 'rust', 'html', 'css', 'sql', 'bash', 'json', 'xml'
  ];

  return (
    <div className="group relative">
      <div className="border rounded-lg p-4 bg-muted/20 hover:border-border transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Label className="text-xs">Linguagem:</Label>
          <Select
            value={block.language}
            onValueChange={(value) => onChange({ ...block, language: value })}
          >
            <SelectTrigger className="w-40 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Cole seu código aqui..."
          className="font-mono text-sm min-h-[200px] bg-background"
          spellCheck={false}
        />
      </div>

      <BlockActions
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onInsertBelow={onInsertBelow}
      />
    </div>
  );
}
