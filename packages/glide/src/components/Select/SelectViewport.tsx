import type { SelectViewportProps } from './types';

/**
 * Scrollable container for select items. Provides semantic structure and manages scroll behavior.
 */
export const SelectViewport = ({
  as: Component = 'div',
  children,
  ...props
}: SelectViewportProps) => {
  return <Component {...props}>{children}</Component>;
};

SelectViewport.displayName = 'SelectViewport';
