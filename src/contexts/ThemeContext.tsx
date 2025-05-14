
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  // Apply theme function to ensure consistency
  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save to localStorage
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    // Use saved theme or default to dark
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    
    // Apply theme to the document
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      // Apply the theme change
      applyTheme(newTheme);
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
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
