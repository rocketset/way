import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeSelector = () => {
  return (
    <Button variant="ghost" size="icon" disabled>
      <Moon className="h-5 w-5" />
      <span className="sr-only">Tema escuro ativo</span>
    </Button>
  );
};
