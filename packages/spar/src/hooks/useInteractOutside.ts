import { useEffect, useRef } from 'react';

export interface UseInteractOutsideOptions {
  /**
   * Whether the outside interaction detection is enabled
   * @defaultValue true
   */
  enabled?: boolean;

  /**
   * Callback fired when a pointer down event occurs outside the elements
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Callback fired when a focus event occurs outside the elements
   */
  onFocusOutside?: (event: FocusEvent) => void;

  /**
   * Generic callback fired for any interaction outside the elements
   */
  onInteractOutside?: (event: PointerEvent | FocusEvent) => void;

  /**
   * Whether to include focus events in outside detection
   * @defaultValue false
   */
  includeFocus?: boolean;

  /**
   * Whether to prevent the default behavior when outside interaction is detected
   * @defaultValue false
   */
  preventDefault?: boolean;
}

/**
 * Custom hook for detecting pointer and focus interactions outside specified elements.
 * Commonly used for closing modals, dropdowns, popovers, etc.
 *
 * @param refs - Array of refs to elements that should be considered "inside"
 * @param options - Configuration options for the hook
 *
 * @example
 * ```tsx
 * const contentRef = useRef<HTMLDivElement>(null);
 * const triggerRef = useRef<HTMLButtonElement>(null);
 *
 * useInteractOutside([contentRef, triggerRef], {
 *   enabled: isOpen,
 *   onPointerDownOutside: () => setIsOpen(false),
 *   onInteractOutside: (event) => console.log('Outside interaction:', event)
 * });
 * ```
 */
export function useInteractOutside(
  refs: Array<React.RefObject<Element | null>>,
  options: UseInteractOutsideOptions = {},
) {
  const {
    enabled = true,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    includeFocus = false,
    preventDefault = false,
  } = options;

  // Keep the latest refs/callbacks in a mutable ref so the document listeners
  // can stay subscribed across renders. Callers routinely pass a fresh `refs`
  // array literal and inline callbacks every render; binding the listeners to
  // those directly would tear down and re-add them on each render.
  const latest = useRef({
    refs,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    preventDefault,
  });
  latest.current = {
    refs,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    preventDefault,
  };

  useEffect(() => {
    if (!enabled) return;

    const doc = document;

    const isOutside = (target: Node) =>
      latest.current.refs.every((ref) => {
        const element = ref.current;
        return !element || !element.contains(target);
      });

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || !isOutside(target)) return;

      latest.current.onPointerDownOutside?.(event);
      latest.current.onInteractOutside?.(event);

      if (latest.current.preventDefault && !event.defaultPrevented) {
        event.preventDefault();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (!target || !isOutside(target)) return;

      latest.current.onFocusOutside?.(event);
      latest.current.onInteractOutside?.(event);

      if (latest.current.preventDefault && !event.defaultPrevented) {
        event.preventDefault();
      }
    };

    doc.addEventListener('pointerdown', handlePointerDown);
    if (includeFocus) {
      doc.addEventListener('focusin', handleFocusIn);
    }

    return () => {
      doc.removeEventListener('pointerdown', handlePointerDown);
      if (includeFocus) {
        doc.removeEventListener('focusin', handleFocusIn);
      }
    };
  }, [enabled, includeFocus]);
}
