import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Reply, User } from "lucide-react";
import { useComments, Comment } from "@/hooks/useComments";
import { formatDate } from "@/utils/dateUtils";

interface CommentsProps {
  postId: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
}

const CommentItem = ({ comment, onReply, replyingTo }: CommentItemProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{comment.author_name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.criado_em)}
            </span>
          </div>
          <p className="text-foreground/80 leading-relaxed">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.id)}
            className="text-primary hover:text-primary/80 -ml-2"
          >
            <Reply className="w-3 h-3 mr-1" />
            Responder
          </Button>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 space-y-4 border-l-2 border-border pl-6">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              replyingTo={replyingTo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = ({ postId }: CommentsProps) => {
  const { comments, isLoading, addComment, isAddingComment } = useComments(postId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      return;
    }

    addComment({
      post_id: postId,
      author_name: name.trim(),
      author_email: email.trim(),
      content: content.trim(),
      parent_id: replyingTo,
    });

    // Limpar formulário
    setName("");
    setEmail("");
    setContent("");
    setReplyingTo(null);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    // Scroll para o formulário
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Comentários {comments && comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Comment Form */}
      <form id="comment-form" onSubmit={handleSubmit} className="space-y-4 bg-card rounded-2xl p-6 border border-border">
        {replyingTo && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-sm text-foreground">Respondendo a um comentário</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="text-xs"
            >
              Cancelar
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Comentário *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu comentário..."
            required
            rows={4}
            className="bg-background border-border resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isAddingComment}
          className="w-full md:w-auto"
        >
          {isAddingComment ? 'Enviando...' : 'Enviar Comentário'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Seu comentário será publicado após aprovação.
        </p>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando comentários...</p>
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              replyingTo={replyingTo}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Seja o primeiro a comentar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
