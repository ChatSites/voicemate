
// Re-export from the hooks directory to maintain compatibility with imports
import { useToast, toast, ToastProvider } from "@/hooks/use-toast";
import type { ToasterToast } from "@/hooks/use-toast";

export { useToast, toast, ToastProvider };
export type { ToasterToast };
