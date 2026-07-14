import type { ElementType } from 'react';
import type { SelectViewportProps } from './types';
import { useSelectCollectionContext } from './hooks';

/**
 * Scrollable region that wraps the select options so long lists can scroll
 * within a bounded area instead of overflowing the viewport.
 *
 * Headless: renders a plain element with no visual opinions. Apply a `max-height`
 * and `overflow` (e.g. `overflow-y: auto`) via `className`/`style` to enable
 * scrolling. Defaults to `role="presentation"` so it stays transparent in the
 * accessibility tree, preserving the `listbox` → `option` structure.
 *
 * Purely presentational: keeping the highlighted option visible during keyboard
 * navigation and typeahead is handled by `SelectItem` (each option scrolls itself
 * into its nearest scrollable ancestor), so it works whether or not the options
 * are wrapped in a `Viewport`.
 */
export const SelectViewport = <T extends ElementType = 'div'>({
  as,
  role = 'presentation',
  ref,
  ...props
}: SelectViewportProps<T>) => {
  const Component = as || 'div';
  // A Viewport only makes sense inside a Content; enforce that composition contract.
  useSelectCollectionContext();

  return <Component {...props} ref={ref} role={role} />;
};

SelectViewport.displayName = 'SelectViewport';
