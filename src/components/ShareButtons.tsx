import { MessageCircle, Link as LinkIcon, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para a área de transferência.',
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const handleShareWhatsApp = () => {
    const text = `${title}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareLinkedIn}
        className="bg-card border-border text-foreground hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShareWhatsApp}
        className="bg-card border-border text-foreground hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="bg-card border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Copiar Link
      </Button>
    </div>
  );
};

export default ShareButtons;
