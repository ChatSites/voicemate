
// Re-export from the hooks directory with safeguards
import { useToast as useToastHook, toast as toastFunction, toast2, ToastProvider } from "@/hooks/use-toast";
import type { ToasterToast } from "@/hooks/use-toast";

// Safe wrapper for useToast that won't crash if used outside provider
export const useToast = () => {
  try {
    return useToastHook();
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

// Export the toast function/object for backwards compatibility
export const toast = toast2;

// Export the toast object for those who need it
export { toastFunction, ToastProvider };
export type { ToasterToast };
