import { type ElementType } from 'react';
import type { SelectSeparatorProps } from './types';

/**
 * Visual separator between select items or groups. Rendered as a presentational,
 * screen-reader-hidden node by default: a `listbox` may only own `option` /
 * `group` children, so exposing `role="separator"` inside `SelectContent` fails
 * `aria-required-children`. Pass `role` / `aria-hidden` to restore separator
 * semantics when the divider carries meaning.
 */
export const SelectSeparator = <T extends ElementType = 'div'>({
  as,
  role = 'presentation',
  'aria-hidden': ariaHidden = role === 'presentation' ? true : undefined,
  children,
  ...props
}: SelectSeparatorProps<T>) => {
  const Component = as || 'div';
  return (
    <Component role={role} aria-hidden={ariaHidden} {...props}>
      {children}
    </Component>
  );
};

SelectSeparator.displayName = 'SelectSeparator';
