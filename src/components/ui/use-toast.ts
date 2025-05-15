
// Re-export from the hooks directory with safeguards
import { useToast as useToastHook, toast as toastObject, ToastProvider } from "@/hooks/use-toast";
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

// Create a backwards-compatible toast function
export const toast = (props: Omit<ToasterToast, "id">) => {
  try {
    return toastObject.toast(props);
  } catch (error) {
    console.warn("Toast function failed:", error);
    return "";
  }
};

// Export the toast object for those who need it
export { toastObject, ToastProvider };
export type { ToasterToast };
