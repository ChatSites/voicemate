
"use client";

import * as React from "react";
import { ToasterToast } from "@/types/toast";
import { toastReducer } from "./toast/useToastState";
import { useToastActions, useToastTimeouts } from "./toast/useToastActions";
import { toastTimeouts } from "./toast/toastUtils";

// Create and export a global toast function instance
let addToastFn: ((props: Omit<ToasterToast, "id">) => string) | null = null;

export const toast = (props: Omit<ToasterToast, "id">): string => {
  if (typeof window !== "undefined") {
    if (addToastFn) {
      return addToastFn(props);
    } else {
      console.warn("Toast called before context was ready");
      return "";
    }
  }
  return "";
};

export function useToast() {
  const [state, dispatch] = React.useReducer(toastReducer, {
    toasts: [],
  });

  const { addToast, updateToast, dismissToast, removeToast } = useToastActions(dispatch);
  
  useToastTimeouts(state.toasts, dispatch);

  React.useEffect(() => {
    // Set the global toast function when the component mounts
    addToastFn = addToast;
    return () => {
      addToastFn = null;
      // Clear all timeouts on cleanup
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
