
import { useToast } from "@/hooks/use-toast"
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
  // Get toast context
  const { toasts, toast: addToast, dismiss, update, remove } = useToast();
  
  // Connect the toast context to the global toast function
  useEffect(() => {
    __setToastContextValue({
      toasts,
      addToast,
      updateToast: update,
      dismissToast: dismiss,
      removeToast: remove,
    });
    
    return () => {
      __setToastContextValue(null);
    };
  }, [toasts, addToast, dismiss, update, remove]);

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
