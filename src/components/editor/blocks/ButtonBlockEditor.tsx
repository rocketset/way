// Editor de Bloco de Botão
import { ButtonBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button as UIButton } from '@/components/ui/button';

interface Props {
  block: ButtonBlock;
  onChange: (block: ButtonBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function ButtonBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  return (
    <div className="group relative">
      <div className="border rounded-lg p-4 hover:border-border transition-all">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Texto do Botão</Label>
            <Input
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Clique aqui"
            />
          </div>

          <div className="space-y-2">
            <Label>URL de Destino</Label>
            <Input
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Estilo</Label>
              <Select
                value={block.variant}
                onValueChange={(value) => onChange({ ...block, variant: value as any })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Abrir em</Label>
              <Select
                value={block.target}
                onValueChange={(value) => onChange({ ...block, target: value as any })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Mesma aba</SelectItem>
                  <SelectItem value="_blank">Nova aba</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-3 flex justify-center">
            <UIButton
              variant={block.variant === 'primary' ? 'default' : block.variant as any}
              className="pointer-events-none"
            >
              {block.text || 'Preview do Botão'}
            </UIButton>
          </div>
        </div>
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
