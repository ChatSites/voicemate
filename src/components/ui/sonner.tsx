
"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Get theme safely with fallback
  let themeValue = "system";
  try {
    const themeContext = useTheme();
    if (themeContext && themeContext.theme) {
      themeValue = themeContext.theme;
    }
  } catch (err) {
    console.warn("Error accessing theme:", err);
  }

  return (
    <Sonner
      theme={themeValue as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
export { toast } from "sonner";
