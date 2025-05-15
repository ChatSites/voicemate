
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // For SSR safety, check if window exists before using it
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return savedTheme || (prefersDark ? "dark" : "light");
    }
    return "dark"; // Default fallback for SSR
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Apply theme class to html element
      const root = document.documentElement;
      root.classList.remove("dark", "light");
      root.classList.add(theme);
      
      // Store theme preference
      localStorage.setItem("theme", theme);
      
      console.log("Theme changed to:", theme); // Add logging for debugging
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      console.log("Toggling theme from", prevTheme, "to", newTheme); // Add logging for debugging
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
