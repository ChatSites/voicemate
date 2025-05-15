
"use client";

import * as React from "react";
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000; // Reduced from 5000ms to 3000ms to make toasts disappear faster

type ToasterToast = Omit<ToastProps, "children"> & {
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

const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  addToast: (props: Omit<ToasterToast, "id">) => string;
  updateToast: (toast: ToasterToast) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
}>({
  toasts: [],
  addToast: () => "",
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  const { toasts, addToast, updateToast, dismissToast, removeToast } = React.useContext(ToastContext);

  return {
    toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      return addToast(props);
    },
    dismiss: (toastId?: string) => dismissToast(toastId),
    update: (toast: ToasterToast) => updateToast(toast),
    remove: (toastId?: string) => removeToast(toastId),
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const addToast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = genId();
    
    const toast = {
      ...props,
      id,
      open: true,
    } as ToasterToast;
    
    dispatch({
      type: actionTypes.ADD_TOAST,
      toast,
    });

    return id;
  }, []);

  const updateToast = React.useCallback((toast: ToasterToast) => {
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast,
    });
  }, []);

  const dismissToast = React.useCallback((toastId?: string) => {
    dispatch({
      type: actionTypes.DISMISS_TOAST,
      toastId,
    });
    
    // Remove toast after the animation completes
    if (toastId) {
      const timeout = toastTimeouts.get(toastId);
      if (timeout) {
        clearTimeout(timeout);
      }
      
      const dismissTimeout = setTimeout(() => {
        dispatch({
          type: actionTypes.REMOVE_TOAST,
          toastId,
        });
        toastTimeouts.delete(toastId);
      }, TOAST_REMOVE_DELAY);
      
      toastTimeouts.set(toastId, dismissTimeout);
    }
  }, []);

  const removeToast = React.useCallback((toastId?: string) => {
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, []);

  React.useEffect(() => {
    return () => {
      toastTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
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

// To simplify usage - with error handling
export const toast = (props: Omit<ToasterToast, "id">) => {
  try {
    // Static function - get toast context directly
    const context = React.useContext(ToastContext);
    if (!context) {
      console.warn("Toast used outside of ToastProvider - no toast will be shown");
      return "";
    }
    return context.addToast(props);
  } catch (error) {
    console.error("Error dispatching toast:", error);
    return "";
  }
};

export type { ToasterToast };
