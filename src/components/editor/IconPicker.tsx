import { TrendingUp, Users, ShoppingCart, Award, Zap, Target, Trophy, Rocket, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

const AVAILABLE_ICONS = {
  TrendingUp,
  Users,
  ShoppingCart,
  Award,
  Zap,
  Target,
  Trophy,
  Rocket,
  Star,
  Heart,
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const SelectedIcon = AVAILABLE_ICONS[value as keyof typeof AVAILABLE_ICONS] || TrendingUp;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <SelectedIcon className="h-4 w-4" />
          {value || "Selecione um ícone"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => (
            <Button
              key={name}
              variant={value === name ? "default" : "outline"}
              size="icon"
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              title={name}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
