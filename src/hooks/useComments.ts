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
  replies?: Comment[];
}

export const useComments = (postId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("criado_em", { ascending: true });

      if (error) throw error;

      // Organize comments into threads (parent comments with replies)
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      data.forEach((comment) => {
        const commentWithReplies = commentMap.get(comment.id)!;
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies!.push(commentWithReplies);
          }
        } else {
          rootComments.push(commentWithReplies);
        }
      });

      return rootComments;
    },
  });

  const addComment = useMutation({
    mutationFn: async ({
      author_name,
      author_email,
      content,
      parent_id,
    }: {
      author_name: string;
      author_email: string;
      content: string;
      parent_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user?.id || null,
        author_name,
        author_email,
        content,
        parent_id: parent_id || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast({
        title: "Comentário enviado!",
        description: "Seu comentário será publicado após aprovação.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar comentário",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  return {
    comments,
    isLoading,
    addComment: addComment.mutate,
    isSubmitting: addComment.isPending,
  };
};
