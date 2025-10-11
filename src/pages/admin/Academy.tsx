// Página Way Academy
// Seção de cursos e materiais sobre E-commerce
// Visível para: membros, gestor_conteudo e administrador

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Video, FileText, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AcademyContent = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'curso' | 'material';
  formato: 'video' | 'documento' | 'pdf' | 'zip';
  duracao: string | null;
  arquivo_url: string | null;
};

export default function Academy() {
  const [courses, setCourses] = useState<AcademyContent[]>([]);
  const [materials, setMaterials] = useState<AcademyContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_content')
        .select('*')
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      if (error) throw error;

      const coursesData = (data?.filter((item) => item.tipo === 'curso') || []) as AcademyContent[];
      const materialsData = (data?.filter((item) => item.tipo === 'material') || []) as AcademyContent[];

      setCourses(coursesData);
      setMaterials(materialsData);
    } catch (error: any) {
      console.error('Erro ao carregar conteúdos:', error);
      toast.error('Erro ao carregar conteúdos');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (formato: string) => {
    switch (formato) {
      case 'video':
        return Video;
      case 'documento':
      case 'pdf':
      case 'zip':
      default:
        return FileText;
    }
  };

  const handleAccessContent = (url: string | null) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.info('URL do conteúdo não disponível');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Way Academy</h1>
          <p className="text-muted-foreground mt-1">
            Cursos e materiais exclusivos sobre E-commerce
          </p>
        </div>
      </div>

      {/* Seção de Cursos */}
      {courses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Cursos Disponíveis</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const Icon = getIcon(course.formato);
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{course.titulo}</CardTitle>
                          {course.duracao && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {course.duracao}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.descricao}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => handleAccessContent(course.arquivo_url)}
                    >
                      Acessar Curso
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Seção de Materiais */}
      {materials.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Materiais para Download</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">{material.titulo}</h3>
                        <p className="text-sm text-muted-foreground">
                          {material.descricao}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAccessContent(material.arquivo_url)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar {material.formato.toUpperCase()}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mensagem quando não há conteúdos */}
      {courses.length === 0 && materials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum conteúdo disponível
            </h3>
            <p className="text-muted-foreground">
              Os cursos e materiais estarão disponíveis em breve.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Banner de Suporte */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Precisa de ajuda com algum curso?
              </h3>
              <p className="text-muted-foreground">
                Nossa equipe está pronta para te auxiliar no seu aprendizado
              </p>
            </div>
            <Button>
              Falar com Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
