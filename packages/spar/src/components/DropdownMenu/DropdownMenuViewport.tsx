import type { ElementType } from 'react';
import type { DropdownMenuViewportProps } from './types';
import { useDropdownMenuCollectionContext } from './hooks';

/**
 * Scrollable region that wraps the menu items so long menus can scroll within a
 * bounded area instead of overflowing the viewport.
 *
 * Headless: renders a plain element with no visual opinions. Apply a `max-height`
 * and `overflow` (e.g. `overflow-y: auto`) via `className`/`style` to enable
 * scrolling. Defaults to `role="presentation"` so it stays transparent in the
 * accessibility tree, preserving the `menu` → `menuitem` structure.
 *
 * Purely presentational: keeping the highlighted item visible during keyboard
 * navigation and typeahead is handled centrally by `DropdownMenuContent`, so it
 * works whether or not the menu is wrapped in a `Viewport`.
 */
export const DropdownMenuViewport = <T extends ElementType = 'div'>({
  as,
  role = 'presentation',
  ref,
  ...props
}: DropdownMenuViewportProps<T>) => {
  const Component = as || 'div';
  // A Viewport only makes sense inside a Content; enforce that composition contract.
  useDropdownMenuCollectionContext();

  return <Component {...props} ref={ref} role={role} />;
};

DropdownMenuViewport.displayName = 'DropdownMenuViewport';
