
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={theme === "light"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-gray-200" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-400" />
      )}
    </div>
  );
}
