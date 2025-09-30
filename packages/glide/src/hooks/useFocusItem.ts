import { useEffect, useLayoutEffect, type RefObject } from 'react';

// Use useLayoutEffect in browser, useEffect in SSR for safety
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Hook to focus an element when a condition is met.
 * Uses useIsomorphicLayoutEffect for SSR-safe synchronous focus management.
 *
 * @param shouldFocus - Condition to determine if element should be focused
 * @param elementRef - Ref to the element that should receive focus
 */
export function useFocusItem(shouldFocus: boolean, elementRef: RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    if (shouldFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [shouldFocus, elementRef]);
}
