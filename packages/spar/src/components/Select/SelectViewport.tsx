import { useLayoutEffect, useRef, type ElementType } from 'react';
import type { SelectViewportProps } from './types';
import { useSelectCollectionContext } from './hooks';
import { useMergedRef } from '@/hooks';

/**
 * Scrollable region that wraps the select options so long lists can scroll
 * within a bounded area instead of overflowing the viewport. Keeps the
 * highlighted option visible during keyboard navigation and typeahead.
 *
 * Headless: renders a plain element with no visual opinions. Apply a `max-height`
 * and `overflow` (e.g. `overflow-y: auto`) via `className`/`style` to enable
 * scrolling. Defaults to `role="presentation"` so it stays transparent in the
 * accessibility tree, preserving the `listbox` → `option` structure.
 */
export const SelectViewport = <T extends ElementType = 'div'>({
  as,
  role = 'presentation',
  ref,
  ...props
}: SelectViewportProps<T>) => {
  const Component = as || 'div';
  const { highlightedId } = useSelectCollectionContext();
  const viewportRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRef(viewportRef, ref);

  // Keep the highlighted option within the scrollable bounds. We adjust only
  // this element's `scrollTop` — never the page.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !highlightedId) return;

    const highlighted = viewport.querySelector<HTMLElement>('[data-highlighted]');
    if (!highlighted) return;

    const viewportRect = viewport.getBoundingClientRect();
    const itemRect = highlighted.getBoundingClientRect();

    if (itemRect.top < viewportRect.top) {
      viewport.scrollTop -= viewportRect.top - itemRect.top;
    } else if (itemRect.bottom > viewportRect.bottom) {
      viewport.scrollTop += itemRect.bottom - viewportRect.bottom;
    }
  }, [highlightedId]);

  return <Component {...props} ref={mergedRef} role={role} />;
};

SelectViewport.displayName = 'SelectViewport';
