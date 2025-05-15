
// Re-export from the hooks directory with safeguards
import { useToast as useToastHook, toast as toastFunction, ToastProvider } from "@/hooks/use-toast";
import type { ToasterToast } from "@/hooks/use-toast";

// Safe wrapper for useToast that won't crash if used outside provider
export const useToast = () => {
  try {
    return useToastHook();
  } catch (error) {
    console.warn("Toast context not available");
    // Return minimal implementation that won't crash
    return {
      toast: () => "",
      toasts: [],
      dismiss: () => {},
      update: () => {},
      remove: () => {},
    };
  }
};

// Safe wrapper for toast function
export const toast = (props: any) => {
  try {
    return toastFunction(props);
  } catch (error) {
    console.warn("Toast function failed:", error);
    return "";
  }
};

export { ToastProvider };
export type { ToasterToast };
