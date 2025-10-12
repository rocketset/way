import { Heart, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useConductGuideContent } from "@/hooks/useConductGuideContent";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConductGuide() {
  const { data: sections, isLoading } = useConductGuideContent();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const renderContent = (content: any[]) => {
    return content.map((item, index) => (
      <div key={index} className="space-y-2">
        {item.title && <h3 className="font-semibold text-lg">{item.title}</h3>}
        {item.content && <p className="text-muted-foreground">{item.content}</p>}
        {item.items && (
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {item.items.map((listItem: string, idx: number) => (
              <li key={idx}>{listItem}</li>
            ))}
          </ul>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Guia de Boas Práticas</h1>
            <p className="text-muted-foreground">
              Princípios e valores que norteiam nossa comunidade
            </p>
          </div>
        </div>
        {isAdmin && (
          <Button
            onClick={() => navigate("/admin/conduct-guide/edit")}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar Conteúdo
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-6">
          {sections?.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.section_title}</CardTitle>
                {section.section_description && (
                  <CardDescription>{section.section_description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {renderContent(section.content)}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
