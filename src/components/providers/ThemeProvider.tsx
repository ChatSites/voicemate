
"use client";

// Re-export the ThemeProvider and useTheme from our context
export { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

// Export the ToastProvider to ensure it's properly initialized
export { ToastProvider } from "@/hooks/use-toast";
