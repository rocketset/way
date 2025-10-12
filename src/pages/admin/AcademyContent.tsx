import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Download, FileText, Video, BookOpen, FileSpreadsheet, PlayCircle } from "lucide-react";
import { useAcademyMaterials } from "@/hooks/useAcademyMaterials";
import { useAcademyProgress, useUpdateProgress } from "@/hooks/useAcademyProgress";
import { toast } from "sonner";

interface AcademyContent {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  formato: string;
  capa_url?: string;
  arquivo_url?: string;
  duracao?: string;
}

const getIconForType = (tipo: string) => {
  switch (tipo) {
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'ebook':
      return <BookOpen className="h-5 w-5" />;
    case 'planilha':
      return <FileSpreadsheet className="h-5 w-5" />;
    case 'guia':
    case 'curso':
    case 'treinamento':
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function AcademyContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<AcademyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>();

  const { data: materials = [] } = useAcademyMaterials(id || "");
  const { data: progress = [] } = useAcademyProgress(id || "", userId);
  const updateProgress = useUpdateProgress();

  useEffect(() => {
    fetchContent();
    fetchUser();
    
    // Registra visualização do conteúdo
    const registerView = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && id) {
        await supabase.from('user_activity_logs').insert({
          user_id: user.id,
          activity_type: 'content_view',
          activity_data: { content_id: id }
        });
      }
    };
    
    registerView();
  }, [id]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("academy_content")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error("Erro ao buscar conteúdo:", error);
      toast.error("Erro ao carregar conteúdo");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = (materialId: string, currentStatus: boolean) => {
    if (!id) return;
    updateProgress.mutate({
      contentId: id,
      materialId,
      concluido: !currentStatus,
    });
  };

  const isMaterialComplete = (materialId: string) => {
    return progress.some(p => p.material_id === materialId && p.concluido);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Detecta diferentes formatos de URL do YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return null;
  };

  // Se não houver materiais, usa o arquivo_url do próprio conteúdo como fallback
  const videoMaterial = materials.find(m => m.tipo_material === 'video') || 
    (content?.arquivo_url && content?.formato === 'video' ? {
      id: 'content-video',
      arquivo_url: content.arquivo_url,
      tipo_material: 'video' as const,
      nome: content.titulo,
      formato: content.formato,
      duracao: content.duracao,
    } : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Conteúdo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/academy")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid gap-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{content.titulo}</h1>
            <p className="text-muted-foreground text-lg">{content.descricao}</p>
          </div>

          {/* Video Player */}
          {videoMaterial?.arquivo_url && (() => {
            const youtubeUrl = getYouTubeEmbedUrl(videoMaterial.arquivo_url);
            const isVideoComplete = isMaterialComplete(videoMaterial.id);
            
            return (
              <div className="space-y-4">
                <Card className="overflow-hidden">
                  {youtubeUrl ? (
                    <iframe
                      className="w-full aspect-video"
                      src={youtubeUrl}
                      title={content.titulo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      className="w-full aspect-video"
                      src={videoMaterial.arquivo_url}
                      onEnded={() => handleToggleComplete(videoMaterial.id, false)}
                    >
                      Seu navegador não suporta reprodução de vídeo.
                    </video>
                  )}
                </Card>
                
                {/* Checkbox de conclusão do vídeo */}
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="video-complete"
                      checked={isVideoComplete}
                      onCheckedChange={() =>
                        handleToggleComplete(videoMaterial.id, isVideoComplete)
                      }
                    />
                    <label
                      htmlFor="video-complete"
                      className="text-sm font-medium leading-none cursor-pointer select-none"
                    >
                      {isVideoComplete ? '✓ Vídeo concluído' : 'Marcar vídeo como concluído'}
                    </label>
                  </div>
                </Card>
              </div>
            );
          })()}

          {/* Materials Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Materiais</h2>
            <div className="grid gap-4">
              {materials.filter(m => m.id !== videoMaterial?.id).map((material) => (
                <Card key={material.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Checkbox
                        id={`material-${material.id}`}
                        checked={isMaterialComplete(material.id)}
                        onCheckedChange={() =>
                          handleToggleComplete(
                            material.id,
                            isMaterialComplete(material.id)
                          )
                        }
                      />
                      <label
                        htmlFor={`material-${material.id}`}
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        {getIconForType(material.tipo_material)}
                        <div>
                          <p className="font-medium">{material.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {material.tipo_material} • {material.formato}
                            {material.duracao && ` • ${material.duracao}`}
                          </p>
                        </div>
                      </label>
                    </div>
                    {material.arquivo_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={material.arquivo_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}

              {materials.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum material disponível
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
