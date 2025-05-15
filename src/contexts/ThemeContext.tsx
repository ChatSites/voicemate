
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both theme classes
    root.classList.remove("light", "dark");
    
    // Add the new theme class
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      localStorage.setItem(storageKey, theme);
    } else {
      root.classList.add(theme);
      localStorage.setItem(storageKey, theme);
    }
    
    console.info("Theme changed to:", theme);
  }, [theme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;
    
    function handleSystemThemeChange(event: MediaQueryListEvent) {
      const root = window.document.documentElement;
      const isDark = event.matches;
      
      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");
    }
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      console.info("Toggling theme from", prevTheme);
      if (prevTheme === "dark") return "light";
      if (prevTheme === "light") return "dark";
      
      // If system, check what the current system theme is and toggle from there
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return isSystemDark ? "light" : "dark";
    });
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
