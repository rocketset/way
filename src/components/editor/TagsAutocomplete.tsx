import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/editor';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface TagsAutocompleteProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  allTags: Tag[];
}

export const TagsAutocomplete = ({ selectedTagIds, onChange, allTags }: TagsAutocompleteProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Filtra tags baseado no input
  const filteredTags = allTags.filter(tag => 
    tag.nome.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTagIds.includes(tag.id)
  );

  // Tags selecionadas
  const selectedTags = allTags.filter(tag => selectedTagIds.includes(tag.id));

  // Verifica se a tag digitada já existe
  const tagExists = allTags.some(tag => 
    tag.nome.toLowerCase() === inputValue.toLowerCase().trim()
  );

  // Criar nova tag
  const createTag = async (nome: string) => {
    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('tags')
        .insert({ nome: nome.trim(), tipo: 'blog' })
        .select()
        .single();
      
      if (error) throw error;
      
      // Invalida cache para recarregar tags
      await queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
      
      // Adiciona a nova tag aos selecionados
      onChange([...selectedTagIds, data.id]);
      setInputValue('');
      toast.success(`Tag "${nome}" criada com sucesso!`);
      
      return data;
    } catch (error: any) {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Se a tag já existe, seleciona ela
      const existingTag = allTags.find(tag => 
        tag.nome.toLowerCase() === inputValue.toLowerCase().trim()
      );
      
      if (existingTag && !selectedTagIds.includes(existingTag.id)) {
        onChange([...selectedTagIds, existingTag.id]);
        setInputValue('');
      } else if (!existingTag) {
        // Cria nova tag
        await createTag(inputValue);
      }
    }
  };

  // Adiciona tag selecionada
  const handleSelectTag = (tagId: string) => {
    onChange([...selectedTagIds, tagId]);
    setInputValue('');
    inputRef.current?.focus();
  };

  // Remove tag
  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTagIds.filter(id => id !== tagId));
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.tags-autocomplete-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3 tags-autocomplete-container">
      {/* Input de busca */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Digite para buscar ou criar tags..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={isCreating}
          className="w-full"
        />
        
        {/* Dropdown de sugestões */}
        {isOpen && inputValue.trim() && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {filteredTags.length > 0 ? (
              <div className="py-1">
                {filteredTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleSelectTag(tag.id)}
                    className="w-full px-4 py-2 text-left hover:bg-accent transition-colors flex items-center justify-between group"
                  >
                    <span className="text-sm">{tag.nome}</span>
                    <Check className="h-4 w-4 opacity-0 group-hover:opacity-100 text-primary" />
                  </button>
                ))}
              </div>
            ) : !tagExists ? (
              <div className="py-2 px-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Nenhuma tag encontrada
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => createTag(inputValue)}
                  disabled={isCreating}
                >
                  {isCreating ? 'Criando...' : `Criar tag "${inputValue}"`}
                </Button>
              </div>
            ) : (
              <div className="py-2 px-4">
                <p className="text-sm text-muted-foreground">
                  Tag já selecionada
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground">
        Pressione Enter para adicionar ou criar uma nova tag
      </p>

      {/* Tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {selectedTags.map(tag => (
            <Badge 
              key={tag.id} 
              variant="secondary"
              className="px-3 py-1 flex items-center gap-2"
            >
              {tag.nome}
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remover tag ${tag.nome}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
