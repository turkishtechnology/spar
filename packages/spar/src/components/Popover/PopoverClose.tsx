import { useCallback } from 'react';
import { PopoverCloseProps, PopoverCloseRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { Button } from '../Button';

/**
 * Close button component that automatically closes the popover
 */
export const PopoverClose = ({
  as = 'button',
  children,
  onClick,
  ref,
  ...props
}: PopoverCloseProps) => {
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
    <Button as={as} ref={ref} onClick={handleClick} data-popover-close='' {...props}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

PopoverClose.displayName = 'PopoverClose';
