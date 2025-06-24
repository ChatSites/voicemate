
const TOAST_LIMIT = 3; // Reduced from 5 to prevent overcrowding
const TOAST_REMOVE_DELAY = 4000; // Increased to 4 seconds for better UX

let count = 0;

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export { TOAST_LIMIT, TOAST_REMOVE_DELAY };
