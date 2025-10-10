import { Link } from "react-router-dom";
import { User, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useColumnists } from "@/hooks/useColumnists";
import { formatDate } from "@/utils/dateUtils";

const ColumnistsSection = () => {
  const { data: columnists, isLoading } = useColumnists();

  if (isLoading) {
    return (
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-4xl font-bold">Colunistas</h2>
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                E-cor
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!columnists || columnists.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">Colunistas</h2>
            <Badge className="bg-primary text-primary-foreground px-4 py-1">
              E-cor
            </Badge>
          </div>

          {/* Columnists Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {columnists.slice(0, 6).map((columnist) => (
              <Link
                key={columnist.id}
                to={`/colunista/${columnist.id}`}
                className="group"
              >
                <Card className="bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          {columnist.avatar_url ? (
                            <img
                              src={columnist.avatar_url}
                              alt={columnist.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                          {columnist.nome}
                        </h3>
                        
                        {columnist.last_post_date && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(columnist.last_post_date)}</span>
                          </div>
                        )}

                        {columnist.last_post_excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {columnist.last_post_excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColumnistsSection;
