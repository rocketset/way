// ============================================
// BIBLIOTECA DE MÍDIA
// ============================================
// Gerenciamento completo de uploads e mídias

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MediaItem {
  id: string;
  filename: string;
  original_filename?: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  criado_em: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar mídia',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Erro ao comprimir imagem:', error);
      return file;
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: 'Nenhum arquivo selecionado',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        // Comprimir imagem
        const compressedFile = await compressImage(file);
        
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `uploads/${fileName}`;

        // Upload para Storage
        const { error: uploadError } = await supabase.storage
          .from('media-library')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('media-library')
          .getPublicUrl(filePath);

        // Obter dimensões da imagem
        const dimensions = await getImageDimensions(compressedFile);

        // Salvar na tabela
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            filename: fileName,
            original_filename: file.name,
            file_path: publicUrl,
            mime_type: file.type,
            file_size: compressedFile.size,
            width: dimensions.width,
            height: dimensions.height,
          });

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);

      toast({
        title: 'Upload concluído',
        description: `${selectedFiles.length} arquivo(s) enviado(s) com sucesso`,
      });

      setSelectedFiles(null);
      loadMedia();
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddExternalUrl = async () => {
    if (!externalUrl) {
      toast({
        title: 'URL inválida',
        variant: 'destructive',
      });
      return;
    }

    try {
      const fileName = externalUrl.split('/').pop() || 'external-image';
      
      const { error } = await supabase
        .from('media_library')
        .insert({
          filename: fileName,
          original_filename: fileName,
          file_path: externalUrl,
          mime_type: 'image/external',
          file_size: 0,
        });

      if (error) throw error;

      toast({
        title: 'URL adicionada',
        description: 'Imagem externa adicionada com sucesso',
      });

      setExternalUrl('');
      loadMedia();
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar URL',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Deseja realmente excluir esta mídia?')) return;

    try {
      // Deletar do storage se não for URL externa
      if (!item.mime_type.includes('external')) {
        const path = item.file_path.split('/media-library/')[1];
        if (path) {
          await supabase.storage.from('media-library').remove([path]);
        }
      }

      // Deletar do banco
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: 'Mídia excluída',
        description: 'Arquivo removido com sucesso',
      });

      loadMedia();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.original_filename && item.original_filename.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Biblioteca de Mídia</h1>
        <p className="text-muted-foreground">Gerencie suas imagens e arquivos</p>
      </div>

      {/* Upload Section */}
      <Card className="p-6 mb-6">
        <Tabs defaultValue="upload">
          <TabsList className="mb-4">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link2 className="h-4 w-4 mr-2" />
              URL Externa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="space-y-4">
              <div>
                <Label>Selecionar Arquivos</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  As imagens serão comprimidas automaticamente para otimizar o carregamento
                </p>
              </div>
              <Button onClick={handleUpload} disabled={uploading || !selectedFiles}>
                {uploading ? 'Enviando...' : 'Fazer Upload'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="url">
            <div className="space-y-4">
              <div>
                <Label>URL da Imagem</Label>
                <Input
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button onClick={handleAddExternalUrl}>
                Adicionar URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mídia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando mídia...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma mídia encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="p-2 group relative">
              <div className="aspect-square bg-muted rounded overflow-hidden mb-2">
                <img
                  src={item.file_path}
                  alt={item.alt_text || item.filename}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs truncate mb-2">{item.original_filename || item.filename}</p>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detalhes da Mídia</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img src={item.file_path} alt={item.filename} className="w-full rounded" />
                      <div className="space-y-2 text-sm">
                        <p><strong>Nome:</strong> {item.original_filename}</p>
                        <p><strong>Tamanho:</strong> {(item.file_size / 1024).toFixed(2)} KB</p>
                        {item.width && item.height && (
                          <p><strong>Dimensões:</strong> {item.width}x{item.height}px</p>
                        )}
                        <p><strong>URL:</strong></p>
                        <Input value={item.file_path} readOnly />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}