import { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { SelectArrowProps } from './types';
import { useSelectContext } from './hooks';

/**
 * Optional decorative arrow element pointing to the trigger.
 * Registered in context for Floating UI arrow middleware positioning.
 * Headless: renders a plain element with no visual opinions — user provides all styling.
 */
export const SelectArrow = <T extends ElementType = 'div'>({
  as,
  ref,
  ...props
}: SelectArrowProps<T>) => {
  const Component = as || 'div';
  const { arrowRef } = useSelectContext();
  const mergedRef = useMergedRef(arrowRef, ref as React.Ref<Element | null>);

  return <Component ref={mergedRef} aria-hidden='true' {...props} />;
};

SelectArrow.displayName = 'SelectArrow';
