
"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </NextThemeProvider>
  );
}

// Re-export useTheme from the context
export { useTheme } from "@/contexts/ThemeContext";
