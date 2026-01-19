import { useMemo } from 'react';
import { PopoverAnchorProps, PopoverAnchorRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Anchor component for custom positioning reference
 */
export const PopoverAnchor = ({ children, ref, ...props }: PopoverAnchorProps) => {
  const { anchorRef, state } = usePopoverContext();

  const anchorRefCallback = useMemo(
    () => (element: HTMLDivElement | null) => {
      if (anchorRef && 'current' in anchorRef) {
        anchorRef.current = element;
      }
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [anchorRef, ref],
  );

  // Render props for children function
  const renderProps: PopoverAnchorRenderProps = {
    isOpen: state.isOpen,
  };

  return (
    <div ref={anchorRefCallback} data-popover-anchor='' {...props}>
      {typeof children === 'function' ? children(renderProps) : children}
    </div>
  );
};

PopoverAnchor.displayName = 'PopoverAnchor';
