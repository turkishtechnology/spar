import { useEffect, useRef } from 'react';

/**
 * Hook for safely attaching event listeners to the document.
 *
 * - **SSR-safe**: Runs only inside `useEffect` (no `document` access during SSR).
 * - **Stable listener**: Uses a ref for the handler to avoid unnecessary
 *   remove/add cycles when the handler identity changes.
 * - **Automatic cleanup**: Removes the listener when `enabled` becomes
 *   `false` or the component unmounts.
 *
 * @param event   - The `Document` event name (e.g. `'keydown'`, `'pointerdown'`).
 * @param handler - The event handler callback.
 * @param enabled - Whether the listener should be active (default `true`).
 * @param capture - Whether to use the capture phase (default `false`).
 *
 * @example
 * ```tsx
 * useDocumentEvent('keydown', (e) => {
 *   if (e.key === 'Escape') close();
 * }, isOpen);
 * ```
 */
export function useDocumentEvent<K extends keyof DocumentEventMap>(
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
  enabled = true,
  capture = false,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const listener = (e: DocumentEventMap[K]) => handlerRef.current(e);

    document.addEventListener(event, listener, capture);
    return () => document.removeEventListener(event, listener, capture);
  }, [event, enabled, capture]);
}
