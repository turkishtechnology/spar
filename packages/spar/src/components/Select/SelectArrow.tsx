import React, { type ElementType } from 'react';
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

  // Merge external ref with internal ref
  React.useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(arrowRef.current);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = arrowRef.current;
      }
    }
  }, [ref]);

  // Note: Arrow positioning is handled by Floating UI's arrow middleware
  // Users must pass this component's ref to SelectContent's arrowRef prop for proper positioning
  // Example:
  // const arrowRef = useRef(null);
  // <SelectContent arrowRef={arrowRef}>
  //   <SelectArrow ref={arrowRef} />
  // </SelectContent>

  return (
    <Component
      ref={arrowRef}
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
