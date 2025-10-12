import { Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConductGuide() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Guia de Boas Práticas e Conduta</h1>
          <p className="text-muted-foreground">
            Princípios e valores que norteiam nossa comunidade
          </p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nossos Valores</CardTitle>
              <CardDescription>
                Compromissos fundamentais que guiam nossa comunidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Respeito Mútuo</h3>
                <p className="text-muted-foreground">
                  Tratamos todos os membros com dignidade e consideração, valorizando a diversidade de opiniões e experiências.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Colaboração</h3>
                <p className="text-muted-foreground">
                  Trabalhamos juntos para alcançar objetivos comuns, compartilhando conhecimento e apoiando o crescimento de todos.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Integridade</h3>
                <p className="text-muted-foreground">
                  Agimos com honestidade e transparência em todas as nossas interações, mantendo altos padrões éticos.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Código de Conduta</CardTitle>
              <CardDescription>
                Diretrizes para uma convivência harmoniosa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Comunicação Respeitosa</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Use linguagem apropriada e profissional</li>
                  <li>Evite comentários ofensivos ou discriminatórios</li>
                  <li>Seja construtivo nas críticas e feedbacks</li>
                  <li>Ouça ativamente e valorize diferentes perspectivas</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Confidencialidade</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Respeite a privacidade dos outros membros</li>
                  <li>Não compartilhe informações confidenciais sem autorização</li>
                  <li>Proteja dados sensíveis da organização e clientes</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Responsabilidade</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Cumpra prazos e compromissos assumidos</li>
                  <li>Assuma responsabilidade por suas ações e decisões</li>
                  <li>Comunique proativamente sobre desafios ou atrasos</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Boas Práticas Profissionais</CardTitle>
              <CardDescription>
                Recomendações para excelência no trabalho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Organização e Planejamento</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Mantenha documentação clara e atualizada</li>
                  <li>Use ferramentas de gestão de projetos de forma eficaz</li>
                  <li>Priorize tarefas de acordo com impacto e urgência</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Aprendizado Contínuo</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Busque constantemente novos conhecimentos</li>
                  <li>Compartilhe aprendizados com a equipe</li>
                  <li>Participe ativamente de treinamentos e workshops</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Qualidade e Excelência</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Revise seu trabalho antes de compartilhar</li>
                  <li>Busque feedback para melhorias contínuas</li>
                  <li>Mantenha padrões elevados de qualidade</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reporte de Violações</CardTitle>
              <CardDescription>
                Como proceder em caso de descumprimento das diretrizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Se você presenciar ou vivenciar uma situação que viole nosso código de conduta:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Relate o ocorrido ao seu gestor imediato ou à equipe de RH</li>
                <li>Forneça detalhes específicos sobre o incidente</li>
                <li>Todas as denúncias serão tratadas com confidencialidade</li>
                <li>Não haverá retaliação contra quem reportar violações de boa-fé</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
