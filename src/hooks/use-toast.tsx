"use client";

import * as React from "react";
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000; // Changed from 2000 to 3000 (3 seconds)

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

// Create and export a global toast function instance
let addToastFn: ((props: Omit<ToasterToast, "id">) => string) | null = null;

export const toast = (props: Omit<ToasterToast, "id">): string => {
  if (typeof window !== "undefined") {
    if (addToastFn) {
      return addToastFn(props);
    } else {
      console.warn("Toast called before context was ready");
      // Return an empty string to avoid errors
      return "";
    }
  }
  return "";
};

export function useToast() {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  });

  React.useEffect(() => {
    state.toasts.forEach((t) => {
      if (!t.open && !toastTimeouts.has(t.id)) {
        const timeout = setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId: t.id });
          toastTimeouts.delete(t.id);
        }, TOAST_REMOVE_DELAY);
        
        toastTimeouts.set(t.id, timeout);
      }
    });
  }, [state.toasts]);

  const addToast = React.useCallback(
    (props: Omit<ToasterToast, "id">) => {
      const id = genId();

      const newToast: ToasterToast = {
        ...props,
        id,
        open: true,
      };
      
      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: newToast,
      });

      return id;
    },
    [dispatch]
  );

  const updateToast = React.useCallback(
    (props: Partial<ToasterToast>) => {
      if (!props.id) {
        return;
      }

      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: props,
      });
    },
    [dispatch]
  );

  const dismissToast = React.useCallback(
    (toastId?: string) => {
      dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId,
      });
    },
    [dispatch]
  );

  const removeToast = React.useCallback(
    (toastId?: string) => {
      if (toastId) {
        toastTimeouts.delete(toastId);
      }

      dispatch({
        type: actionTypes.REMOVE_TOAST,
        toastId,
      });
    },
    [dispatch]
  );

  React.useEffect(() => {
    // Set the global toast function when the component mounts
    addToastFn = addToast;
    return () => {
      addToastFn = null;
      for (const timeout of Array.from(toastTimeouts.values())) {
        clearTimeout(timeout);
      }
      toastTimeouts.clear();
    };
  }, [addToast]);

  return {
    toasts: state.toasts,
    toast: addToast,
    dismiss: dismissToast,
    update: updateToast,
    remove: removeToast,
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return children;
}
