import { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import { PopoverArrowProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Optional arrow element for popover visual enhancement
 */
export const PopoverArrow = <T extends ElementType = 'div'>({
  as,
  width = 10,
  height = 5,
  offset = 0,
  style,
  ref,
  ...props
}: PopoverArrowProps<T>) => {
  const Component = as || 'div';
  const { state, arrowRef } = usePopoverContext();

  const mergedRef = useMergedRef(arrowRef as React.RefObject<HTMLDivElement | null>, ref);

  // Unused prop for future implementation
  void offset;

  if (!state.isOpen) return null;

  return (
    <Component
      ref={mergedRef}
      role='presentation'
      data-side={state.actualSide}
      style={
        {
          position: 'absolute',
          width,
          height,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

PopoverArrow.displayName = 'PopoverArrow';
