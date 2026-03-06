import { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { TooltipArrowProps } from './types';
import { useTooltipContext, useTooltipContentContext } from './hooks';
import { getPlacement } from '@/utils';

/**
 * Optional decorative arrow element for tooltip.
 * Automatically positioned by Floating UI middleware — sits at the edge of the
 * content element pointing toward the trigger. Headless: no visual opinions,
 * user is responsible for shape/rotation styling.
 */
export const TooltipArrow = <T extends ElementType = 'svg'>({
  as,
  ref,
  style,
  children,
  ...props
}: TooltipArrowProps<T>) => {
  const Component = as || 'svg';
  const { arrowRef } = useTooltipContext();
  const { arrowStyles, side, align } = useTooltipContentContext();
  const mergedRef = useMergedRef(arrowRef, ref as React.Ref<Element | null>);
  const placement = getPlacement(side, align);
  return (
    <Component
      ref={mergedRef}
      aria-hidden='true'
      data-placement={placement}
      width={10}
      height={5}
      viewBox='0 0 10 5'
      style={{ ...arrowStyles, ...style }}
      {...props}
    >
      {children ?? <polygon points='0,0 5,5 10,0' fill='currentColor' />}
    </Component>
  );
};

TooltipArrow.displayName = 'TooltipArrow';
