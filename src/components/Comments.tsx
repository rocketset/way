import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useComments, Comment } from "@/hooks/useComments";
import { formatDate } from "@/utils/dateUtils";
import { MessageSquare, User, Send } from "lucide-react";

interface CommentsProps {
  postId: string;
}

const CommentItem = ({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply: (commentId: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {comment.author_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.criado_em)}
            </span>
          </div>
          <p className="text-foreground/80 leading-relaxed">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.id)}
            className="text-xs text-primary hover:text-primary/80"
          >
            Responder
          </Button>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 space-y-4 pl-4 border-l-2 border-border">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = ({ postId }: CommentsProps) => {
  const { comments, isLoading, addComment, isSubmitting } = useComments(postId);
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.author_name.trim() || !formData.author_email.trim()) {
      return;
    }

    addComment({
      ...formData,
      parent_id: replyingTo || undefined,
    });

    setFormData({ author_name: "", author_email: "", content: "" });
    setReplyingTo(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Comentários ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author_name">Nome *</Label>
            <Input
              id="author_name"
              value={formData.author_name}
              onChange={(e) =>
                setFormData({ ...formData, author_name: e.target.value })
              }
              placeholder="Seu nome"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author_email">E-mail *</Label>
            <Input
              id="author_email"
              type="email"
              value={formData.author_email}
              onChange={(e) =>
                setFormData({ ...formData, author_email: e.target.value })
              }
              placeholder="seu@email.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Comentário *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Deixe seu comentário..."
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Seu comentário será publicado após aprovação.
          </p>
          <Button type="submit" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Enviando..." : "Enviar comentário"}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6 pt-6 border-t border-border">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">
            Carregando comentários...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={setReplyingTo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
