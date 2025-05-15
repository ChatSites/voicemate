
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="flex items-center gap-2 p-2 rounded-full bg-opacity-50 backdrop-blur-sm">
      <Sun className={`h-4 w-4 ${!isDark ? 'text-amber-500' : 'text-gray-400'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className={isDark ? "bg-gray-700" : "bg-gray-200"}
      />
      <Moon className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
    </div>
  );
}
