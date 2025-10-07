import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  parent_id: string | null;
  approved: boolean;
  criado_em: string;
  atualizado_em: string;
  replies?: Comment[];
}

interface NewComment {
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  parent_id?: string | null;
}

export const useComments = (postId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('criado_em', { ascending: true });

      if (error) throw error;

      // Organizar comentários em árvore (comentários principais e respostas)
      const commentsMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      // Primeiro, criar o mapa de todos os comentários
      data.forEach((comment) => {
        commentsMap.set(comment.id, { ...comment, replies: [] });
      });

      // Depois, organizar em árvore
      data.forEach((comment) => {
        const commentWithReplies = commentsMap.get(comment.id)!;
        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(commentWithReplies);
          }
        } else {
          rootComments.push(commentWithReplies);
        }
      });

      return rootComments;
    },
  });

  const addComment = useMutation({
    mutationFn: async (newComment: NewComment) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: newComment.post_id,
          author_name: newComment.author_name,
          author_email: newComment.author_email,
          content: newComment.content,
          parent_id: newComment.parent_id || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast({
        title: 'Comentário enviado!',
        description: 'Seu comentário será publicado após aprovação.',
      });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        title: 'Erro ao enviar comentário',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  return {
    comments,
    isLoading,
    addComment: addComment.mutate,
    isAddingComment: addComment.isPending,
  };
};
