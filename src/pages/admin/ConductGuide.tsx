import { Heart, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConductGuideContent } from "@/hooks/useConductGuideContent";
import { useAuth } from "@/hooks/useAuth";

export default function ConductGuide() {
  const navigate = useNavigate();
  const { data: sections, isLoading } = useConductGuideContent();
  const { isAdmin } = useAuth();

  const renderContent = (content: any) => {
    if (Array.isArray(content)) {
      return content.map((item: any, index: number) => (
        <div key={index} className="space-y-2">
          {item.title && <h3 className="font-semibold text-lg">{item.title}</h3>}
          {item.content && (
            <div className="text-muted-foreground prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {item.content}
              </ReactMarkdown>
            </div>
          )}
          {item.items && (
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {item.items.map((listItem: string, i: number) => (
                <li key={i}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {listItem}
                  </ReactMarkdown>
                </li>
              ))}
            </ul>
          )}
        </div>
      ));
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Carregando...</p>
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
          <Button onClick={() => navigate("/admin/conduct-guide/edit")}>
            <Edit className="h-4 w-4 mr-2" />
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
                  <CardDescription className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {section.section_description}
                    </ReactMarkdown>
                  </CardDescription>
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
