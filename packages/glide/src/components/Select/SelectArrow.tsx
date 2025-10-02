import React from 'react';
import type { SelectArrowProps } from './types';

/**
 * Optional arrow element that points to the trigger. Provides visual connection between trigger and dropdown.
 */
export const SelectArrow = ({
  width = 10,
  height = 5,
  as: Component = 'svg',
  children,
  ...props
}: SelectArrowProps) => {
  return (
    <Component
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
