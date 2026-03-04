import { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { TooltipArrowProps } from './types';
import { useTooltipContext } from './hooks';

/**
 * Optional decorative arrow element pointing to the trigger.
 * Registered in context for Floating UI arrow middleware positioning.
 * Headless: renders a plain element with no visual opinions — user provides all styling.
 */
export const TooltipArrow = <T extends ElementType = 'div'>({
  as,
  ref,
  ...props
}: TooltipArrowProps<T>) => {
  const Component = as || 'div';
  const { arrowRef } = useTooltipContext();
  const mergedRef = useMergedRef(arrowRef, ref as React.Ref<Element | null>);

  return <Component ref={mergedRef} aria-hidden='true' {...props} />;
};

TooltipArrow.displayName = 'TooltipArrow';
