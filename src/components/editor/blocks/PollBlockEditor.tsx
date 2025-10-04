// Editor de Bloco de Enquete
import { PollBlock } from '@/types/editor';
import { BlockActions } from '../BlockActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';

interface Props {
  block: PollBlock;
  onChange: (block: PollBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onInsertBelow: (type: any) => void;
}

export function PollBlockEditor({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
}: Props) {
  const handleAddOption = () => {
    onChange({
      ...block,
      options: [...block.options, { id: crypto.randomUUID(), text: '' }],
    });
  };

  const handleRemoveOption = (id: string) => {
    if (block.options.length > 2) {
      onChange({
        ...block,
        options: block.options.filter((opt) => opt.id !== id),
      });
    }
  };

  const handleOptionChange = (id: string, text: string) => {
    onChange({
      ...block,
      options: block.options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    });
  };

  return (
    <div className="group relative">
      <div className="border rounded-lg p-4 bg-blue-500/10 hover:border-border transition-all">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Pergunta da Enquete</Label>
            <Input
              value={block.question}
              onChange={(e) => onChange({ ...block, question: e.target.value })}
              placeholder="Qual é sua opinião sobre...?"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Resposta</Label>
            <Select
              value={block.pollType}
              onValueChange={(value) => onChange({ ...block, pollType: value as any })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Resposta Única</SelectItem>
                <SelectItem value="multiple">Múltipla Escolha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Opções</Label>
            {block.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  className="h-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveOption(option.id)}
                  disabled={block.options.length <= 2}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={handleAddOption}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>

          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="require-login"
                checked={block.requireLogin}
                onCheckedChange={(checked) =>
                  onChange({ ...block, requireLogin: checked as boolean })
                }
              />
              <Label htmlFor="require-login" className="text-sm cursor-pointer">
                Exigir login para votar
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow-anonymous"
                checked={block.allowAnonymous}
                onCheckedChange={(checked) =>
                  onChange({ ...block, allowAnonymous: checked as boolean })
                }
              />
              <Label htmlFor="allow-anonymous" className="text-sm cursor-pointer">
                Permitir votos anônimos
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-results"
                checked={block.showResultsAfterVote}
                onCheckedChange={(checked) =>
                  onChange({ ...block, showResultsAfterVote: checked as boolean })
                }
              />
              <Label htmlFor="show-results" className="text-sm cursor-pointer">
                Mostrar resultados após votar
              </Label>
            </div>
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
