import { type ElementType } from 'react';
import { useSelectContext } from './hooks';
import type { SelectIconProps } from './types';

/**
 * Optional visual indicator (chevron, arrow) that displays the select state.
 */
export const SelectIcon = <T extends ElementType = 'span'>({
  as,
  children,
  ...props
}: SelectIconProps<T>) => {
  const Component = as || 'span';
  const context = useSelectContext();

  return (
    <Component aria-hidden='true' data-state={context.open ? 'open' : 'closed'} {...props}>
      {children}
    </Component>
  );
};

SelectIcon.displayName = 'SelectIcon';
