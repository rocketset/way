import { Button } from "@/components/ui/button";
import { Share2, Facebook, MessageCircle, Send, Mail, Link2, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  excerpt?: string;
  url: string;
}

const ShareButtons = ({ title, excerpt, url }: ShareButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const shareUrl = url || window.location.href;
  const shareText = `${title}${excerpt ? ` - ${excerpt}` : ''}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar link",
        variant: "destructive",
      });
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-[#1877F2] hover:text-white",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-[#25D366] hover:text-white",
      action: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
          "_blank"
        );
      },
    },
    {
      name: "Telegram",
      icon: Send,
      color: "hover:bg-[#0088cc] hover:text-white",
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      },
    },
    {
      name: "E-mail",
      icon: Mail,
      color: "hover:bg-muted hover:text-foreground",
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
      },
    },
    {
      name: "Copiar link",
      icon: Link2,
      color: "hover:bg-primary hover:text-primary-foreground",
      action: handleCopyLink,
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-card border-border text-foreground hover:bg-card/80 hover:border-primary"
      >
        {isOpen ? (
          <X className="w-4 h-4 mr-2" />
        ) : (
          <Share2 className="w-4 h-4 mr-2" />
        )}
        Compartilhar
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-lg p-4 z-50 min-w-[280px] animate-scale-in">
          <p className="text-sm font-medium text-foreground mb-3">
            Compartilhar em:
          </p>
          <div className="space-y-2">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border transition-all duration-300 ${option.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{option.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
