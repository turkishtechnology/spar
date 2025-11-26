import { PopoverArrowProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Optional arrow element for popover visual enhancement
 */
export const PopoverArrow = ({
  width = 10,
  height = 5,
  offset = 0,
  style,
  ref,
  ...props
}: PopoverArrowProps) => {
  const { state, arrowRef } = usePopoverContext();

  // Unused prop for future implementation
  void offset;

  if (!state.isOpen) return null;

  return (
    <div
      ref={(element: HTMLDivElement | null) => {
        if (arrowRef && 'current' in arrowRef) {
          arrowRef.current = element;
        }
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
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
