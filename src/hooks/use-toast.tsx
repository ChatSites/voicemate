
"use client";

import * as React from "react";
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 2000; 

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

// Define the interface for our context
interface ToastContextType {
  toasts: ToasterToast[];
  addToast: (props: Omit<ToasterToast, "id">) => string;
  updateToast: (toast: ToasterToast) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
}

// Create context with default values
export const ToastContext = React.createContext<ToastContextType | null>(null);

// Global reference for the toast context value
let globalToastContext: ToastContextType | null = null;

// Function to set the toast context value
export function __setToastContextValue(value: ToastContextType | null) {
  globalToastContext = value;
}

// Make useToast safer
export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    console.warn("useToast used outside of ToastProvider");
    
    // Return a minimal implementation that won't crash
    return {
      toasts: [],
      toast: () => "",
      dismiss: () => {},
      update: () => {},
      remove: () => {},
    };
  }
  
  const { toasts, addToast, updateToast, dismissToast, removeToast } = context;

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

  const contextValue: ToastContextType = {
    toasts: state.toasts,
    addToast,
    updateToast,
    dismissToast,
    removeToast,
  };

  // Update global context reference when context changes
  React.useEffect(() => {
    __setToastContextValue(contextValue);
    return () => {
      __setToastContextValue(null);
    };
  }, [contextValue]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

// The actual toast function exported for use throughout the app
export const toast = (props: Omit<ToasterToast, "id">): string => {
  if (typeof window !== "undefined") {
    // First check if we have the global context available
    if (globalToastContext) {
      return globalToastContext.addToast(props);
    }
    
    // Fallback for when context isn't available
    console.warn("Toast called before context was available:", props);
  }
  return "";
};
