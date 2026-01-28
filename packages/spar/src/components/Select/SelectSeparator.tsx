import React, { type ElementType } from 'react';
import type { SelectSeparatorProps } from './types';

/**
 * Visual separator between select items or groups. Provides semantic structure for organizing options.
 */
export const SelectSeparator = <T extends ElementType = 'div'>({
  as,
  children,
  ...props
}: SelectSeparatorProps<T>) => {
  const Component = as || 'div';
  return (
    <Component role='separator' aria-orientation='horizontal' {...props}>
      {children}
    </Component>
  );
};

SelectSeparator.displayName = 'SelectSeparator';
