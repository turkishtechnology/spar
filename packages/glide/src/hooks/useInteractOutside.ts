import { useEffect, useCallback } from 'react';

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

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!enabled) return;

      const target = event.target as Node | null;
      if (!target) return;

      // Check if the click is outside all specified elements
      const isOutside = refs.every((ref) => {
        const element = ref.current;
        return !element || !element.contains(target);
      });

      if (isOutside) {
        onPointerDownOutside?.(event);
        onInteractOutside?.(event);

        if (preventDefault && !event.defaultPrevented) {
          event.preventDefault();
        }
      }
    },
    [enabled, refs, onPointerDownOutside, onInteractOutside, preventDefault],
  );

  const handleFocusIn = useCallback(
    (event: FocusEvent) => {
      if (!enabled || !includeFocus) return;

      const target = event.target as Node | null;
      if (!target) return;

      // Check if the focus is outside all specified elements
      const isOutside = refs.every((ref) => {
        const element = ref.current;
        return !element || !element.contains(target);
      });

      if (isOutside) {
        onFocusOutside?.(event);
        onInteractOutside?.(event);

        if (preventDefault && !event.defaultPrevented) {
          event.preventDefault();
        }
      }
    },
    [enabled, includeFocus, refs, onFocusOutside, onInteractOutside, preventDefault],
  );

  useEffect(() => {
    if (!enabled) return;

    const doc = document;

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
  }, [enabled, handlePointerDown, handleFocusIn, includeFocus]);
}
