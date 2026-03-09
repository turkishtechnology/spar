import { useCallback } from 'react';
import { useDocumentEvent } from './useDocumentEvent';

/**
 * Focusable elements selector – covers all interactive elements excluding disabled ones.
 * Shared between all components that need focus trapping.
 */
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Traps keyboard focus within `containerRef` when `enabled` is `true`.
 *
 * Attaches a document-level `keydown` listener (via `useDocumentEvent`) and
 * intercepts `Tab` / `Shift+Tab` to keep focus cycling inside the container.
 * The listener is added/removed automatically when `enabled` changes or the
 * component unmounts.
 *
 * @param containerRef - Ref to the DOM element that should contain focus.
 * @param enabled      - Whether the trap is active. Pass `false` to disable without unmounting.
 *
 * @example
 * ```tsx
 * // Modal dialog – trap always active while open
 * useFocusTrap(contentRef, isOpen);
 *
 * // Popover – opt-in via prop
 * useFocusTrap(contentRef, isOpen && trapFocus);
 * ```
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  const handleTab = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [containerRef],
  );

  useDocumentEvent('keydown', handleTab, enabled);
}
