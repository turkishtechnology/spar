import React from 'react';
import type { SelectSeparatorProps } from './types';

/**
 * Visual separator between select items or groups. Provides semantic structure for organizing options.
 */
export const SelectSeparator = ({
  as: Component = 'div',
  children,
  ...props
}: SelectSeparatorProps) => {
  return (
    <Component role='separator' aria-orientation='horizontal' {...props}>
      {children}
    </Component>
  );
};

SelectSeparator.displayName = 'SelectSeparator';
