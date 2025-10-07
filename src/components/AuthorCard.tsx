import { Link } from "react-router-dom";
import { User } from "lucide-react";

interface AuthorCardProps {
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  authorRole?: string | null;
  showRole?: boolean;
}

const AuthorCard = ({ 
  authorId, 
  authorName, 
  authorAvatar, 
  authorRole,
  showRole = false 
}: AuthorCardProps) => {
  return (
    <Link 
      to={`/colunista/${authorId}`}
      className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
        {authorAvatar ? (
          <img 
            src={authorAvatar} 
            alt={authorName}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
          {authorName}
        </span>
        {showRole && authorRole && (
          <span className="text-xs text-muted-foreground truncate">
            {authorRole}
          </span>
        )}
      </div>
    </Link>
  );
};

export default AuthorCard;
