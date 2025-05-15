
import { useToast } from "@/components/ui/use-toast"
import { __setToastContextValue } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect } from "react"

export function Toaster() {
  // Add robust error handling to useToast
  const toastContext = useToast();
  const toasts = toastContext?.toasts || [];
  
  // Connect the toast context to the global toast function
  useEffect(() => {
    if (toastContext) {
      // @ts-ignore - internal API
      __setToastContextValue({
        toasts: toastContext.toasts,
        addToast: toastContext.toast,
        updateToast: toastContext.update,
        dismissToast: toastContext.dismiss,
        removeToast: toastContext.remove,
      });
    }
    
    return () => {
      // @ts-ignore - internal API
      __setToastContextValue(null);
    };
  }, [toastContext]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
