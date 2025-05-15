
// Re-export from either hooks or sonner based on the more stable implementation
import { toast as toastImpl, useToast as useToastHook, ToastProvider } from "@/hooks/use-toast";
import type { ToasterToast } from "@/hooks/use-toast";

// Export a safe toast function that won't throw errors
export const useToast = useToastHook;

// Export the toast function directly
export const toast = toastImpl;
export { ToastProvider };
export type { ToasterToast };
