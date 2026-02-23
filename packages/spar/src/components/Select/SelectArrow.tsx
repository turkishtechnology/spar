import React, { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { SelectArrowProps } from './types';

/**
 * Optional arrow element that points to the trigger. Provides visual connection between trigger and dropdown. Automatically positioned by Floating UI's arrow middleware when passed to SelectContent via arrowRef prop.
 */
export const SelectArrow = <T extends ElementType = 'svg'>({
  width = 10,
  height = 5,
  as,
  ref,
  children,
  ...props
}: SelectArrowProps<T>) => {
  const Component = as || 'svg';
  const arrowRef = React.useRef<SVGSVGElement>(null);
  const mergedRef = useMergedRef(arrowRef, ref);

  // Note: Arrow positioning is handled by Floating UI's arrow middleware
  // Users must pass this component's ref to SelectContent's arrowRef prop for proper positioning
  // Example:
  // const arrowRef = useRef(null);
  // <SelectContent arrowRef={arrowRef}>
  //   <SelectArrow ref={arrowRef} />
  // </SelectContent>

  return (
    <Component
      ref={mergedRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden='true'
      {...props}
    >
      {children || <polygon points={`0,0 ${width},0 ${width / 2},${height}`} />}
    </Component>
  );
};

SelectArrow.displayName = 'SelectArrow';
