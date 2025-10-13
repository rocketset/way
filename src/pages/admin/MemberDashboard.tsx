// Dashboard do Membro - Página principal da Way Academy
// Exibe progresso, estatísticas e materiais disponíveis

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Video, FileText, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContents: 0,
    totalVideos: 0,
    totalMaterials: 0,
    completedItems: 0,
    lastUpdate: null as Date | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Busca total de conteúdos publicados
      const { count: contentsCount, error: contentsError } = await supabase
        .from('academy_content')
        .select('*', { count: 'exact', head: true })
        .eq('publicado', true);

      if (contentsError) {
        console.error('Erro ao buscar conteúdos:', contentsError);
      }

      // Busca conteúdos de vídeo
      const { count: videosCount, error: videosError } = await supabase
        .from('academy_content')
        .select('*', { count: 'exact', head: true })
        .eq('publicado', true)
        .eq('formato', 'video');

      if (videosError) {
        console.error('Erro ao buscar vídeos:', videosError);
      }

      // Busca total de materiais
      const { count: materialsCount, error: materialsError } = await supabase
        .from('academy_materials')
        .select('*', { count: 'exact', head: true });

      if (materialsError) {
        console.error('Erro ao buscar materiais:', materialsError);
      }

      // Busca progresso do usuário
      const { count: completedCount, error: progressError } = await supabase
        .from('academy_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('concluido', true);

      if (progressError) {
        console.error('Erro ao buscar progresso:', progressError);
      }

      // Busca última atualização de conteúdo
      const { data: lastContent, error: lastContentError } = await supabase
        .from('academy_content')
        .select('atualizado_em')
        .eq('publicado', true)
        .order('atualizado_em', { ascending: false })
        .limit(1)
        .single();

      if (lastContentError && lastContentError.code !== 'PGRST116') {
        console.error('Erro ao buscar última atualização:', lastContentError);
      }

      setStats({
        totalContents: contentsCount || 0,
        totalVideos: videosCount || 0,
        totalMaterials: materialsCount || 0,
        completedItems: completedCount || 0,
        lastUpdate: lastContent?.atualizado_em ? new Date(lastContent.atualizado_em) : null,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcula a porcentagem de conclusão
  const totalItems = stats.totalContents + stats.totalMaterials;
  const completionPercentage = totalItems > 0 ? Math.round((stats.completedItems / totalItems) * 100) : 0;

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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Way Academy</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe seu progresso e continue aprendendo
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Treinamentos Disponíveis</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Conteúdos publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vídeos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Vídeos disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Materiais complementares
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Seu Progresso</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhe sua evolução nos conteúdos
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Conclusão Total</span>
              <span className="font-bold text-lg">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Concluídos</p>
              <p className="text-2xl font-bold text-primary">{stats.completedItems}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Última Atualização */}
      {stats.lastUpdate && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {format(stats.lastUpdate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Novos conteúdos foram adicionados
            </p>
          </CardContent>
        </Card>
      )}

      {/* CTA para acessar conteúdos */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Pronto para aprender mais?</h3>
              <p className="text-muted-foreground">
                Explore todos os conteúdos disponíveis na Way Academy
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/admin/academy')}>
              Ver Conteúdos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
