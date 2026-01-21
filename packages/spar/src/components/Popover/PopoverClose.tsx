import { useCallback } from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import { PopoverCloseProps, PopoverCloseRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Close button component that automatically closes the popover
 */
export const PopoverClose = ({ children, onClick, ref, ...props }: PopoverCloseProps) => {
  const { closePopover, state } = usePopoverContext();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      closePopover();
      onClick?.(event);
    },
    [closePopover, onClick],
  );

  // Render props for children function
  const renderProps: PopoverCloseRenderProps = {
    isOpen: state.isOpen,
    close: closePopover,
  };

  return (
    <PrimitiveButton type='button' ref={ref} onClick={handleClick} data-popover-close='' {...props}>
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

PopoverClose.displayName = 'PopoverClose';
