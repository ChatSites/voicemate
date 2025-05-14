
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-yellow-400' : 'text-gray-400'}`} />
      <Switch
        checked={theme === "light"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-400'}`} />
    </div>
  );
}
