import React from 'react';
import { useTheme } from "../providers/ThemeProvider";

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      Switch to {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
};

