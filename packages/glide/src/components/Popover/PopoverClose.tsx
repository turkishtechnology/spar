import { cloneElement, isValidElement, useCallback } from 'react';
import { PopoverCloseProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Close button component that automatically closes the popover
 */
export const PopoverClose = ({
  asChild = false,
  children,
  onClick,
  ref,
  ...props
}: PopoverCloseProps) => {
  const { closePopover } = usePopoverContext();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      closePopover();
      onClick?.(event);
    },
    [closePopover, onClick],
  );

  const closeProps = {
    ref,
    onClick: handleClick,
    'data-popover-close': '',
    ...props,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, closeProps);
  }

  return (
    <button type='button' {...closeProps}>
      {children}
    </button>
  );
};

PopoverClose.displayName = 'PopoverClose';
