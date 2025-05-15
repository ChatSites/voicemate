
"use client";

import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

export type ToasterToast = Omit<ToastProps, "children"> & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST;
      toast: ToasterToast;
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST;
      toast: Partial<ToasterToast>;
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST;
      toastId?: string;
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST;
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        };
      }
      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false,
        })),
      };
    }
    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        };
      }
      return {
        ...state,
        toasts: [],
      };
    }
  }
};

const ToastContext = createContext<{
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, "id">) => void;
  updateToast: (toast: ToasterToast) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  const { toasts, addToast, updateToast, dismissToast, removeToast } = useContext(ToastContext);

  return {
    toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      addToast(props);
    },
    dismiss: (toastId?: string) => dismissToast(toastId),
    update: (props: ToasterToast) => updateToast(props),
    remove: (toastId?: string) => removeToast(toastId),
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ toasts: [] });

  const addToast = useCallback((toast: Omit<ToasterToast, "id">) => {
    const id = toast.id || genId();

    setState((prev) => ({
      ...prev,
      toasts: [{ ...toast, id, open: true }, ...prev.toasts].slice(0, TOAST_LIMIT),
    }));

    return id;
  }, []);

  const updateToast = useCallback((toast: ToasterToast) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)),
    }));
  }, []);

  const dismissToast = useCallback((toastId?: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.map((t) => {
        if (toastId ? t.id === toastId : true) {
          const timeout = toastTimeouts.get(t.id);
          if (timeout) {
            clearTimeout(timeout);
          }

          const dismissTimeout = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              toasts: prev.toasts.filter((toast) => toast.id !== t.id),
            }));
            toastTimeouts.delete(t.id);
          }, TOAST_REMOVE_DELAY);

          toastTimeouts.set(t.id, dismissTimeout);

          return {
            ...t,
            open: false,
          };
        }
        return t;
      }),
    }));
  }, []);

  const removeToast = useCallback((toastId?: string) => {
    if (toastId) {
      setState((prev) => ({
        ...prev,
        toasts: prev.toasts.filter((t) => t.id !== toastId),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        toasts: [],
      }));
    }
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export const toast = (props: Omit<ToasterToast, "id">) => {
  const { toast } = useToast();
  toast(props);
};
