
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-4 w-4 ${!isDark ? 'text-yellow-500' : 'text-gray-400'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
    </div>
  );
}
