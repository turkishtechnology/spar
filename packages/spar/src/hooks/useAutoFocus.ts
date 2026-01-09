import { useEffect } from 'react';

/**
 * Hook to automatically focus an element on mount.
 * Safe for SSR and handles timing issues with requestAnimationFrame.
 *
 * @param ref - The ref to the element to focus
 * @param shouldAutoFocus - Whether to focus the element
 */
export const useAutoFocus = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  shouldAutoFocus: boolean = false,
) => {
  useEffect(() => {
    if (!shouldAutoFocus) return;

    // Check for browser environment
    if (typeof window === 'undefined') return;

    // Use requestAnimationFrame to ensure DOM is ready and preventing conflict with other focus events
    if (ref.current) {
      requestAnimationFrame(() => {
        ref.current?.focus();
      });
    }
  }, [shouldAutoFocus, ref]);
};
