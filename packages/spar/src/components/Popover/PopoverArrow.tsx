import { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { PopoverArrowProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { usePopoverContentContext } from './hooks/usePopoverContentContext';

/**
 * Optional decorative arrow element for popover.
 * Automatically positioned by Floating UI middleware — sits at the edge of the
 * content element pointing toward the trigger. Headless: no visual opinions,
 * user is responsible for shape/rotation styling.
 */
export const PopoverArrow = <T extends ElementType = 'div'>({
  as,
  ref,
  style,
  ...props
}: PopoverArrowProps<T>) => {
  const Component = as || 'div';
  const { arrowRef } = usePopoverContext();
  const { arrowStyles } = usePopoverContentContext();
  const mergedRef = useMergedRef(arrowRef, ref as React.Ref<Element | null>);

  return (
    <Component ref={mergedRef} aria-hidden='true' style={{ ...arrowStyles, ...style }} {...props} />
  );
};

PopoverArrow.displayName = 'PopoverArrow';
