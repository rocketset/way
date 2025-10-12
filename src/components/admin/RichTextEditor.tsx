import { useState } from "react";
import { Bold, Link as LinkIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, label, placeholder }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);

  const insertFormatting = (before: string, after: string = "") => {
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (textarea && textarea.tagName === "TEXTAREA") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newValue =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        );
      }, 0);
    }
  };

  const insertBold = () => {
    insertFormatting("**", "**");
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const textarea = document.activeElement as HTMLTextAreaElement;
      if (textarea && textarea.tagName === "TEXTAREA") {
        const start = textarea.selectionStart;
        const linkMarkdown = `[${linkText}](${linkUrl})`;
        const newValue =
          value.substring(0, start) + linkMarkdown + value.substring(start);
        onChange(newValue);
        setLinkUrl("");
        setLinkText("");
        setShowLinkPopover(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="border rounded-md">
        <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBold}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                title="Inserir Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Texto do Link</Label>
                  <Input
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Clique aqui"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://exemplo.com"
                  />
                </div>
                <Button onClick={insertLink} className="w-full">
                  Inserir Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-2 text-xs text-muted-foreground">
            Use ** para negrito | Pressione Enter 2x para novo parágrafo
          </div>
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 min-h-[120px] focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
