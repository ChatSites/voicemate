
import * as React from "react";
import { ToasterToast, actionTypes } from "@/types/toast";
import { genId, toastTimeouts, TOAST_REMOVE_DELAY } from "./toastUtils";

export const useToastActions = (dispatch: React.Dispatch<any>) => {
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
      if (toastId && toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId));
        toastTimeouts.delete(toastId);
      }

      dispatch({
        type: actionTypes.REMOVE_TOAST,
        toastId,
      });
    },
    [dispatch]
  );

  return {
    addToast,
    updateToast,
    dismissToast,
    removeToast,
  };
};

export const useToastTimeouts = (toasts: ToasterToast[], dispatch: React.Dispatch<any>) => {
  React.useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.open !== false && !toastTimeouts.has(toast.id)) {
        // Auto-dismiss after delay
        const dismissTimeout = setTimeout(() => {
          dispatch({ type: actionTypes.DISMISS_TOAST, toastId: toast.id });
        }, TOAST_REMOVE_DELAY);
        
        // Remove from DOM after dismiss animation
        const removeTimeout = setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId: toast.id });
          toastTimeouts.delete(toast.id);
        }, TOAST_REMOVE_DELAY + 300); // Extra time for dismiss animation
        
        toastTimeouts.set(toast.id, removeTimeout);
      }
    });
  }, [toasts, dispatch]);
};
