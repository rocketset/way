// Página Way Academy
// Seção de cursos e materiais sobre E-commerce
// Visível para: membros, gestor_conteudo e administrador

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Video, FileText, Download } from 'lucide-react';

export default function Academy() {
  // Cursos e materiais de exemplo
  const courses = [
    {
      id: 1,
      title: 'Fundamentos do E-commerce',
      description: 'Aprenda os conceitos básicos para iniciar sua loja online',
      type: 'video',
      duration: '2h 30min',
      icon: Video,
    },
    {
      id: 2,
      title: 'Estratégias de Marketing Digital',
      description: 'Como atrair e converter clientes para seu e-commerce',
      type: 'video',
      duration: '3h 15min',
      icon: Video,
    },
    {
      id: 3,
      title: 'Otimização de Conversão',
      description: 'Técnicas para aumentar suas vendas online',
      type: 'document',
      duration: '45 páginas',
      icon: FileText,
    },
    {
      id: 4,
      title: 'Logística e Fulfillment',
      description: 'Gerenciamento eficiente de estoque e entregas',
      type: 'video',
      duration: '1h 45min',
      icon: Video,
    },
  ];

  const materials = [
    {
      id: 1,
      title: 'Checklist de Lançamento',
      description: 'Lista completa para lançar sua loja',
      type: 'pdf',
    },
    {
      id: 2,
      title: 'Templates de E-mail Marketing',
      description: 'Modelos prontos para suas campanhas',
      type: 'zip',
    },
    {
      id: 3,
      title: 'Guia de SEO para E-commerce',
      description: 'Como otimizar sua loja para os buscadores',
      type: 'pdf',
    },
  ];

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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Cursos Disponíveis</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>
                  <Button className="w-full">
                    Acessar Curso
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Seção de Materiais */}
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
                      <h3 className="font-medium">{material.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {material.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar {material.type.toUpperCase()}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
