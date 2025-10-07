import { Facebook, Mail, MessageCircle, Link as LinkIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
}

const ShareButtons = ({ title, url, excerpt }: ShareButtonsProps) => {
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

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleShareWhatsApp = () => {
    const text = `${title}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareTelegram = () => {
    const text = title;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${excerpt || ''}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareFacebook}
        className="bg-card border-border text-foreground hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
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
        onClick={handleShareTelegram}
        className="bg-card border-border text-foreground hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-all"
      >
        <Send className="w-4 h-4 mr-2" />
        Telegram
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShareEmail}
        className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary transition-all"
      >
        <Mail className="w-4 h-4 mr-2" />
        E-mail
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary transition-all"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Copiar Link
      </Button>
    </div>
  );
};

export default ShareButtons;
