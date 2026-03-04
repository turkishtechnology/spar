import { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { DropdownMenuArrowProps } from './types';
import { useDropdownMenuContext } from './hooks';

/**
 * Optional decorative arrow element for dropdown menu.
 * Registered in context for Floating UI arrow middleware positioning.
 * Headless: renders a plain element with no visual opinions — user provides all styling.
 */
export const DropdownMenuArrow = <T extends ElementType = 'div'>({
  as,
  ref,
  ...props
}: DropdownMenuArrowProps<T>) => {
  const Component = as || 'div';
  const { arrowRef } = useDropdownMenuContext();
  const mergedRef = useMergedRef(arrowRef, ref as React.Ref<Element | null>);

  return <Component ref={mergedRef} aria-hidden='true' {...props} />;
};

DropdownMenuArrow.displayName = 'DropdownMenuArrow';
