import type { ElementType } from 'react';
import type { SelectViewportProps } from './types';

/**
 * Scrollable container for select items. Provides semantic structure and manages scroll behavior.
 */
export const SelectViewport = <T extends ElementType = 'div'>({
  as,
  children,
  ...props
}: SelectViewportProps<T>) => {
  const Component = as || 'div';
  return <Component {...props}>{children}</Component>;
};

SelectViewport.displayName = 'SelectViewport';
