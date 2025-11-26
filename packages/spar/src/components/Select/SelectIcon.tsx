import React from 'react';
import type { SelectIconProps } from './types';
import { useSelectContext } from './SelectRoot';

/**
 * Optional visual indicator (chevron, arrow) that displays the select state.
 */
export const SelectIcon = ({ as: Component = 'span', children, ...props }: SelectIconProps) => {
  const context = useSelectContext();

  return (
    <Component aria-hidden='true' data-state={context.open ? 'open' : 'closed'} {...props}>
      {children}
    </Component>
  );
};

SelectIcon.displayName = 'SelectIcon';
