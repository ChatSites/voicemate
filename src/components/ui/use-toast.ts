
// Re-export a simpler version from the hooks directory
import { useToast as useToastOriginal, toast as toastFunction, ToastProvider } from "@/hooks/use-toast";
import type { ToasterToast } from "@/hooks/use-toast";

// Safe wrapper for useToast that won't crash if used outside provider
export const useToast = () => {
  try {
    return useToastOriginal();
  } catch (error) {
    console.warn("Toast context not available");
    // Return minimal implementation that won't crash
    return {
      toasts: [],
      toast: () => "",
      dismiss: () => {},
      update: () => {},
      remove: () => {},
    };
  }
};

// Export the toast function directly
export const toast = toastFunction;
export { ToastProvider };
export type { ToasterToast };
