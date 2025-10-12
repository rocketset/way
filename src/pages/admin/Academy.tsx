// Página Way Academy
// Seção de cursos e materiais sobre E-commerce com categorias e banner
// Visível para: membros, gestor_conteudo e administrador

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Video, FileText, Download } from 'lucide-react';

type AcademyContent = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  formato: string;
  duracao: string | null;
  arquivo_url: string | null;
  capa_url: string | null;
  categoria_id: string | null;
  publicado: boolean;
};

type AcademyCategory = {
  id: string;
  nome: string;
  descricao: string | null;
};

type BannerSettings = {
  banner_url: string | null;
  banner_titulo: string | null;
  banner_descricao: string | null;
};

export default function Academy() {
  const navigate = useNavigate();
  const [contents, setContents] = useState<AcademyContent[]>([]);
  const [categories, setCategories] = useState<AcademyCategory[]>([]);
  const [banner, setBanner] = useState<BannerSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchContents(), fetchCategories(), fetchBanner()]);
    setLoading(false);
  };

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_content')
        .select('*')
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setContents((data || []) as AcademyContent[]);
    } catch (error: any) {
      console.error('Erro ao carregar conteúdos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_categories')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setCategories((data || []) as AcademyCategory[]);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_settings')
        .select('banner_url, banner_titulo, banner_descricao')
        .single();

      if (error) throw error;
      setBanner(data);
    } catch (error: any) {
      console.error('Erro ao carregar banner:', error);
    }
  };

  const getContentsByCategory = (categoryId: string) => {
    return contents.filter((content) => content.categoria_id === categoryId);
  };

  const getContentsWithoutCategory = () => {
    return contents.filter((content) => !content.categoria_id);
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
      {/* Banner */}
      {banner && banner.banner_url && (
        <div
          className="relative h-[300px] rounded-lg overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.banner_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
            <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {banner.banner_titulo || 'Way Academy'}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                {banner.banner_descricao ||
                  'Desenvolva suas habilidades com nossos cursos e materiais exclusivos'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!banner?.banner_url && (
        <div>
          <h1 className="text-3xl font-bold">Way Academy</h1>
          <p className="text-muted-foreground mt-2">
            Acesse nossos cursos e materiais exclusivos para desenvolvimento profissional
          </p>
        </div>
      )}

      {/* Conteúdos por categoria */}
      {categories.map((category) => {
        const categoryContents = getContentsByCategory(category.id);
        if (categoryContents.length === 0) return null;

        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{category.nome}</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {categoryContents.length} {categoryContents.length === 1 ? 'material' : 'materiais'}
              </span>
            </div>
            {category.descricao && (
              <p className="text-muted-foreground mt-1">{category.descricao}</p>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryContents.map((content) => (
                <Card 
                  key={content.id} 
                  className="hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/academy/content/${content.id}`)}
                >
                  {content.capa_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={content.capa_url}
                        alt={content.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {content.formato === 'video' ? (
                          <Video className="h-5 w-5 text-primary" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {content.tipo}
                      </span>
                    </div>
                    <CardTitle className="mt-4">{content.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {content.descricao}
                    </p>
                    {content.duracao && (
                      <span className="text-xs text-muted-foreground">
                        {content.duracao}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Conteúdos sem categoria */}
      {getContentsWithoutCategory().length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Outros Conteúdos</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {getContentsWithoutCategory().length} {getContentsWithoutCategory().length === 1 ? 'material' : 'materiais'}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getContentsWithoutCategory().map((content) => (
              <Card 
                key={content.id} 
                className="hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                onClick={() => navigate(`/academy/content/${content.id}`)}
              >
                {content.capa_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={content.capa_url}
                      alt={content.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {content.formato === 'video' ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {content.tipo}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{content.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {content.descricao}
                  </p>
                  {content.duracao && (
                    <span className="text-xs text-muted-foreground">
                      {content.duracao}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {contents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum conteúdo disponível no momento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
