import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PollProps {
  blockId: string;
  question: string;
  pollType: 'single' | 'multiple';
  options: { id: string; text: string }[];
  requireLogin: boolean;
  allowAnonymous: boolean;
  showResultsAfterVote: boolean;
  postId?: string;
}

interface PollResults {
  [optionId: string]: number;
}

// Gera um fingerprint simples do navegador
const getBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const fingerprint = canvas.toDataURL();
  return btoa(fingerprint + navigator.userAgent + navigator.language);
};

export function Poll({
  blockId,
  question,
  pollType,
  options,
  requireLogin,
  allowAnonymous,
  showResultsAfterVote,
  postId,
}: PollProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [results, setResults] = useState<PollResults>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [pollId, setPollId] = useState<string | null>(null);

  useEffect(() => {
    loadPollId();
  }, [blockId]);

  useEffect(() => {
    if (pollId) {
      checkIfVoted();
      if (showResultsAfterVote || hasVoted) {
        loadResults();
      }
    }
  }, [pollId, user]);

  const loadPollId = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('id')
        .eq('block_id', blockId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setPollId(data.id);
      } else {
        // Enquete não existe, vamos criá-la
        await createPollInDatabase();
      }
    } catch (error) {
      console.error('Erro ao carregar poll ID:', error);
      // Tenta criar a enquete mesmo assim
      await createPollInDatabase();
    }
  };

  const createPollInDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .insert({
          block_id: blockId,
          post_id: postId,
          question,
          poll_type: pollType,
          options,
          require_login: requireLogin,
          allow_anonymous: allowAnonymous,
          show_results_after_vote: showResultsAfterVote,
        })
        .select('id')
        .single();

      if (error) throw error;
      setPollId(data.id);
      console.log('Enquete criada com sucesso:', data.id);
    } catch (error) {
      console.error('Erro ao criar enquete:', error);
    }
  };

  const checkIfVoted = async () => {
    if (!pollId) return;
    
    try {
      const fingerprint = getBrowserFingerprint();
      
      const query = supabase
        .from('poll_votes')
        .select('id')
        .eq('poll_id', pollId);

      if (user) {
        query.eq('user_id', user.id);
      } else {
        query.eq('voter_fingerprint', fingerprint);
      }

      const { data, error } = await query.single();

      if (data && !error) {
        setHasVoted(true);
        if (showResultsAfterVote) {
          setShowResults(true);
        }
      }
    } catch (error) {
      // Usuário não votou ainda
    }
  };

  const loadResults = async () => {
    if (!pollId) return;
    
    try {
      const { data: votes, error } = await supabase
        .from('poll_votes')
        .select('option_ids')
        .eq('poll_id', pollId);

      if (error) throw error;

      const resultsCount: PollResults = {};
      let total = 0;

      votes?.forEach((vote) => {
        const optionIds = vote.option_ids as string[];
        optionIds.forEach((optionId) => {
          resultsCount[optionId] = (resultsCount[optionId] || 0) + 1;
          total++;
        });
      });

      setResults(resultsCount);
      setTotalVotes(total);
    } catch (error) {
      console.error('Erro ao carregar resultados:', error);
    }
  };

  const handleVote = async () => {
    if (!pollId) {
      toast.error('Erro ao identificar enquete');
      return;
    }

    if (selectedOptions.length === 0) {
      toast.error('Selecione pelo menos uma opção');
      return;
    }

    if (requireLogin && !user) {
      toast.error('Você precisa estar logado para votar');
      return;
    }

    if (!allowAnonymous && !user) {
      toast.error('Votação anônima não é permitida nesta enquete');
      return;
    }

    setLoading(true);

    try {
      const fingerprint = getBrowserFingerprint();

      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user?.id || null,
          voter_fingerprint: user ? null : fingerprint,
          option_ids: selectedOptions,
        });

      if (error) throw error;

      setHasVoted(true);
      toast.success('Voto registrado com sucesso!');

      if (showResultsAfterVote) {
        setShowResults(true);
        await loadResults();
      }
    } catch (error: any) {
      console.error('Erro ao votar:', error);
      toast.error('Erro ao registrar voto');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (optionId: string): number => {
    if (totalVotes === 0) return 0;
    return Math.round(((results[optionId] || 0) / totalVotes) * 100);
  };

  if (hasVoted && !showResults) {
    return (
      <div className="my-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {question}
        </h3>
        <p className="text-center text-muted-foreground py-8">
          ✓ Obrigado por votar!
        </p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="my-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {question}
        </h3>
        <div className="space-y-4">
          {options.map((option) => {
            const votes = results[option.id] || 0;
            const percentage = getPercentage(option.id);
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">
                    {option.text}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {votes} voto{votes !== 1 ? 's' : ''} ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Total de votos: {totalVotes}
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
      <h3 className="text-xl font-semibold mb-4 text-foreground">
        {question}
      </h3>

      {pollType === 'single' ? (
        <RadioGroup
          value={selectedOptions[0]}
          onValueChange={(value) => setSelectedOptions([value])}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <span className="text-muted-foreground mr-2">{index + 1}.</span>
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:border-primary/50 transition-colors"
            >
              <Checkbox
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedOptions([...selectedOptions, option.id]);
                  } else {
                    setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
                  }
                }}
              />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <span className="text-muted-foreground mr-2">{index + 1}.</span>
                {option.text}
              </Label>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleVote}
        disabled={loading || selectedOptions.length === 0}
        className="w-full mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Votando...
          </>
        ) : (
          'Votar'
        )}
      </Button>

      {requireLogin && !user && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Você precisa estar logado para votar
        </p>
      )}
    </div>
  );
}
