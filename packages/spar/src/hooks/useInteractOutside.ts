import { useEffect, useCallback, useRef } from 'react';

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
 * Handlers returned by {@link useInteractOutside}. Spread them onto the
 * element rendered for the layer (composing any consumer handlers) so that
 * interactions starting in its React subtree are treated as inside.
 */
export interface UseInteractOutsideReturn {
  onPointerDownCapture: (event: React.PointerEvent) => void;
  onFocusCapture: (event: React.FocusEvent) => void;
}

/**
 * Custom hook for detecting pointer and focus interactions outside specified elements.
 * Commonly used for closing modals, dropdowns, popovers, etc.
 *
 * An interaction counts as inside when its target is a DOM descendant of one
 * of `refs`, or when it starts in the React subtree of the element that the
 * returned handlers are attached to. The second check covers nested layers
 * that are portaled elsewhere in the DOM (a Select or Popover opened inside a
 * Dialog), because React events propagate through portals along the React
 * tree and React's listeners run before this hook's `document` listeners.
 *
 * @param refs - Array of refs to elements that should be considered "inside"
 * @param options - Configuration options for the hook
 * @returns Capture handlers to spread onto the layer's element
 *
 * @example
 * ```tsx
 * const contentRef = useRef<HTMLDivElement>(null);
 * const triggerRef = useRef<HTMLButtonElement>(null);
 *
 * const insideHandlers = useInteractOutside([contentRef, triggerRef], {
 *   enabled: isOpen,
 *   onPointerDownOutside: () => setIsOpen(false),
 *   onInteractOutside: (event) => console.log('Outside interaction:', event)
 * });
 *
 * return <div ref={contentRef} {...insideHandlers}>…</div>;
 * ```
 */
export function useInteractOutside(
  refs: Array<React.RefObject<Element | null>>,
  options: UseInteractOutsideOptions = {},
): UseInteractOutsideReturn {
  const {
    enabled = true,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    includeFocus = false,
    preventDefault = false,
  } = options;

  // Native events that reached the layer through the React tree (including
  // through portals). They are inside even when the DOM says otherwise.
  const insideTreeEvents = useRef<WeakSet<Event>>(new WeakSet());

  const isOutside = useCallback(
    (event: Event, target: Node) =>
      !insideTreeEvents.current.has(event) &&
      refs.every((ref) => {
        const element = ref.current;
        return !element || !element.contains(target);
      }),
    [refs],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!enabled) return;

      const target = event.target as Node | null;
      if (!target) return;

      if (isOutside(event, target)) {
        onPointerDownOutside?.(event);
        onInteractOutside?.(event);

        if (preventDefault && !event.defaultPrevented) {
          event.preventDefault();
        }
      }
    },
    [enabled, isOutside, onPointerDownOutside, onInteractOutside, preventDefault],
  );

  const handleFocusIn = useCallback(
    (event: FocusEvent) => {
      if (!enabled || !includeFocus) return;

      const target = event.target as Node | null;
      if (!target) return;

      if (isOutside(event, target)) {
        onFocusOutside?.(event);
        onInteractOutside?.(event);

        if (preventDefault && !event.defaultPrevented) {
          event.preventDefault();
        }
      }
    },
    [enabled, includeFocus, isOutside, onFocusOutside, onInteractOutside, preventDefault],
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

  const onPointerDownCapture = useCallback((event: React.PointerEvent) => {
    insideTreeEvents.current.add(event.nativeEvent);
  }, []);

  const onFocusCapture = useCallback((event: React.FocusEvent) => {
    insideTreeEvents.current.add(event.nativeEvent);
  }, []);

  return { onPointerDownCapture, onFocusCapture };
}
