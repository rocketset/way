// Componente reutilizável para upload de arquivos
// Faz upload para o Supabase Storage e retorna a URL pública

import { useState } from 'react';
import heic2any from 'heic2any';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, FileText, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileUploadProps = {
  label: string;
  accept?: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
  helperText?: string;
};

export default function FileUpload({
  label,
  accept = 'image/*',
  currentUrl,
  onUploadComplete,
  folder = 'academy',
  maxSizeMB = 10,
  showPreview = true,
  helperText,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // allow selecting the same file again
    event.target.value = '';

    let fileToUpload: File = selectedFile;

    // Normalizar extensão
    const initialExt = (selectedFile.name.split('.').pop() || '').toLowerCase();

    // iPhone/Apple costuma enviar HEIC/HEIF (muitas vezes vindo como octet-stream)
    if (['heic', 'heif'].includes(initialExt) || ['image/heic', 'image/heif'].includes(selectedFile.type)) {
      try {
        toast.message('Convertendo HEIC para JPG...');
        const converted = (await heic2any({
          blob: selectedFile,
          toType: 'image/jpeg',
          quality: 0.9,
        })) as Blob;

        const jpgName = selectedFile.name.replace(/\.(heic|heif)$/i, '.jpg');
        fileToUpload = new File([converted], jpgName, { type: 'image/jpeg' });
      } catch (err) {
        toast.error('Formato HEIC não suportado. Converta para JPG/PNG e tente novamente.');
        return;
      }
    }

    // Verificar tamanho do arquivo
    const fileSizeMB = fileToUpload.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      return;
    }

    const ext = (fileToUpload.name.split('.').pop() || '').toLowerCase();
    const inferContentType = (e: string) => {
      const map: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
        svg: 'image/svg+xml',
      };
      return map[e] || '';
    };

    const contentType =
      fileToUpload.type && fileToUpload.type !== 'application/octet-stream'
        ? fileToUpload.type
        : inferContentType(ext) || 'image/jpeg';

    setUploading(true);

    try {
      // Gerar nome único para o arquivo
      const safeExt = ext || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${safeExt}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('media-library')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          contentType,
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      toast.success('Upload realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onUploadComplete('');
  };

  const getFileIcon = () => {
    if (accept.includes('image')) return <ImageIcon className="h-4 w-4" />;
    if (accept.includes('video')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const isImage = accept.includes('image');
  const isVideo = accept.includes('video');

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Preview */}
      {showPreview && previewUrl && (
        <div className="relative inline-block">
          {isImage && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-lg border"
            />
          )}
          {isVideo && (
            <video
              src={previewUrl}
              controls
              className="max-h-48 rounded-lg border"
            />
          )}
          {!isImage && !isVideo && (
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              {getFileIcon()}
              <span className="text-sm truncate max-w-[200px]">{previewUrl}</span>
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Button */}
      {!previewUrl && (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${label.replace(/\s/g, '-')}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`file-upload-${label.replace(/\s/g, '-')}`)?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
          </Button>
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
