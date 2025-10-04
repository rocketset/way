// ============================================
// SELETOR DE MÍDIA (MODAL)
// ============================================
// Modal para escolher imagens da biblioteca ou adicionar URLs

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, Upload, Link2, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface MediaItem {
  id: string;
  filename: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
}

interface MediaSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, alt?: string) => void;
}

export function MediaSelector({ open, onClose, onSelect }: MediaSelectorProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadMedia();
    }
  }, [open]);

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

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);

    try {
      const file = selectedFiles[0]; // Apenas um arquivo por vez no seletor
      const compressedFile = await compressImage(file);
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      const dimensions = await getImageDimensions(compressedFile);

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

      toast({
        title: 'Upload concluído',
      });

      onSelect(publicUrl, file.name);
      onClose();
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

  const handleSelectExternal = () => {
    if (!externalUrl) return;
    onSelect(externalUrl);
    setExternalUrl('');
    onClose();
  };

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Selecionar Imagem</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library">
              <ImageIcon className="h-4 w-4 mr-2" />
              Biblioteca
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link2 className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar na biblioteca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma imagem encontrada</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 p-2">
                  {filteredMedia.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.file_path, item.alt_text || item.filename);
                        onClose();
                      }}
                      className="group relative aspect-square bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                    >
                      <img
                        src={item.file_path}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Selecionar</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4 p-4">
              <div>
                <Label>Selecionar Arquivo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  A imagem será comprimida automaticamente
                </p>
              </div>
              <Button 
                onClick={handleUpload} 
                disabled={uploading || !selectedFiles}
                className="w-full"
              >
                {uploading ? 'Enviando...' : 'Enviar e Selecionar'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-4 p-4">
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
              <Button 
                onClick={handleSelectExternal}
                disabled={!externalUrl}
                className="w-full"
              >
                Usar esta URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}